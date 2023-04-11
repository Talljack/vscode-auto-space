import type { TextEditorEdit } from 'vscode'
import { Position, Range, window as Window, workspace as Workspace } from 'vscode'

export function addSpaceChineseAndEnglish(line: string) {
  const regexCE = /\s*?.*?([\u4E00-\u9FA5]+)([a-zA-Z0-9]+).*/
  const regexEC = /\s*?.*?([a-zA-Z0-9]+)([\u4E00-\u9FA5]+).*/
  let match = regexCE.exec(line) || regexEC.exec(line)
  let changed = false
  while (match !== null) {
    const chinese = match[1]
    const english = match[2]
    line = line.replace(chinese + english, `${chinese} ${english}`)
    changed = true
    match = regexCE.exec(line) || regexEC.exec(line)
  }
  return {
    line,
    changed,
  }
}

export function getAutoSapceConfig() {
  const config = Workspace.getConfiguration('autoAddSpace')
  const enable = config.get('enable')
  const comment = config.get('comment')
  return {
    enable,
    comment,
  }
}

export function autoAddSpaceAll(text: string) {
  const editor = Window.activeTextEditor
  if (!editor)
    return
  const document = editor.document
  const lines = text.split(/\n/g)
  const updatedLines = lines?.map((line) => {
    return addSpaceChineseAndEnglish(line).line
  })
  const updatedText = updatedLines.join('\n')
  const start = new Position(0, 0)
  const end = new Position(document.lineCount, 0)
  const range = new Range(start, end)
  editor.edit((editBuilder: TextEditorEdit) => {
    editBuilder.replace(range, updatedText)
  })
}

export async function autoAddSpaceComment(text: string) {
  const editor = Window.activeTextEditor
  if (!editor)
    return
  const document = editor.document
  // javascript java c++ c# php swift
  const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//gm
  // python
  const pythonRegex = /(\"\"\"|\'\'\')([\s\S]*?)(\"\"\"|\'\'\')|(#.*$)/gm
  // ruby
  const rubyRegex = /#\s*(.*)$/gm
  const commonlines = text.match(commentRegex)
  const pythonlines = text.match(pythonRegex)
  const rubylines = text.match(rubyRegex)
  const lines = commonlines?.concat(pythonlines ?? []).concat(rubylines ?? [])
  if (!lines || lines?.length === 0)
    return
  for (let i = 0; i < lines?.length; i++) {
    const line = lines[i]
    const { line: replaceLine, changed } = addSpaceChineseAndEnglish(line)
    if (!changed)
      continue
    const offset = text.indexOf(line)
    const start = document.positionAt(offset)
    const end = document.positionAt(offset + line.length)
    const range = new Range(start, end)
    await editor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(range, replaceLine)
    })
  }
}

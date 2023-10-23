import type { TextEditorEdit } from 'vscode'
import { Position, Range, window as Window, workspace as Workspace } from 'vscode'
import pangu from 'pangu'

export function addSpaceChineseAndEnglish(line: string) {
  const regexCE = /([\u4E00-\u9FA5]+)([a-zA-Z0-9]+)/
  const regexEC = /([a-zA-Z0-9]+)([\u4E00-\u9FA5]+)/
  let changed = false
  do {
    line = pangu.spacing(line)
    changed = true
  } while (line.match(regexCE) || line.match(regexEC))
  return {
    line,
    changed,
  }
}

export function getAutoSpaceConfig() {
  const config = Workspace.getConfiguration('autoAddSpace')
  const enable = config.get('enable')
  const comment = config.get('comment')
  return {
    enable,
    comment,
  }
}

export function autoAddSpace(text: string) {
  const editor = Window.activeTextEditor
  if (!editor)
    return
  const document = editor.document
  const { enable, comment } = getAutoSpaceConfig()
  if (!enable)
    return
  let lines: string[] = []
  if (comment === 'comment') {
    // javascript java c++ c# php swift
    const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//gm
    // python
    const pythonRegex = /(\"\"\"|\'\'\')([\s\S]*?)(\"\"\"|\'\'\')|(#.*$)/gm
    // ruby
    const rubyRegex = /#\s*(.*)$/gm
    const commonLines = text.match(commentRegex)
    const pythonLines = text.match(pythonRegex)
    const rubyLines = text.match(rubyRegex)
    lines = commonLines?.concat(pythonLines ?? []).concat(rubyLines ?? []) as string[]
  }
  else {
    lines = text.split(/\n/g)
  }
  const updatedLines = lines?.map((line) => {
    return pangu.spacing(line)
  })
  const updatedText = updatedLines.join('\n')
  const start = new Position(0, 0)
  const end = new Position(document.lineCount, 0)
  const range = new Range(start, end)
  editor.edit((editBuilder: TextEditorEdit) => {
    editBuilder.replace(range, updatedText)
  })
}

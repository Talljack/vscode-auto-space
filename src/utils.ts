// import type { TextEditorEdit } from 'vscode'
import { Range, TextEdit, window as Window, workspace as Workspace } from 'vscode'
import { customSpacing } from './handler'
import type { AutoSpaceConfigType } from './type'

/**
 *
 * @param text
 */
function escapeMarkdown(text: string) {
  const replacements: string[] = []
  const placeholder = '%%PLACEHOLDER%%'
  // eslint-disable-next-line no-useless-escape
  const reg = /\*\*\*[^\*]*\*\*\*|\*\*[^\*]*\*\*|\*[^\*]*\*|~~[^~]*~~|`[^`]*`/g
  const escapedText = text.replace(reg, (match) => {
    replacements.push(match)
    return `${placeholder}${replacements.length - 1}%%`
  })
  return {
    escapedText,
    replacements,
  }
}

/**
 *
 * @param replacedText
 * @param replacements
 */
function restoreMarkdown(replacedText: string, replacements: string[]) {
  return replacedText.replace(/%%\s?PLACEHOLDER%%(\d+)%%/g, (match, index) => {
    const originalText = replacements[Number.parseInt(index, 10)]
    if (!originalText)
      return match
    return originalText.replace(/([\u4E00-\u9FA5])([a-zA-Z])/g, '$1 $2')
      .replace(/([a-zA-Z])([\u4E00-\u9FA5])/g, '$1 $2')
  })
}

/**
 *
 */
export function getAutoSpaceConfig(): AutoSpaceConfigType {
  const config = Workspace.getConfiguration('autoAddSpace')
  // const enable = config.get('enable')
  const formatOnSave = config.get('formatOnSave') as boolean
  const formatOnDocument = config.get('formatOnDocument') as boolean
  const spaceType = config.get('spaceType') as AutoSpaceConfigType['spaceType']
  return {
    formatOnSave,
    formatOnDocument,
    spaceType,
  }
}

/**
 *
 * @param text
 */
export function autoAddSpace(text: string) {
  const editor = Window.activeTextEditor
  if (!editor)
    return
  const document = editor.document
  const lang = document.languageId
  const { spaceType } = getAutoSpaceConfig()
  let lines: string[] = []
  if (spaceType === 'comment') {
    // javascript java c++ c# php swift
    const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//gm
    // python
    const pythonRegex = /("""|''')([\s\S]*?)("""|''')|(#.*$)/gm
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
    // markdown 语法加粗问题
    if (lang === 'markdown') {
      const { escapedText, replacements } = escapeMarkdown(line)
      const spacedText = customSpacing(escapedText)
      return restoreMarkdown(spacedText, replacements)
    }
    else {
      return customSpacing(line)
    }
  })
  const updatedText = updatedLines.join('\n')
  // const start = new Position(0, 0)
  // const end = new Position(document.lineCount, 0)
  // const range = new Range(start, end)
  // editor.edit((editBuilder: TextEditorEdit) => {
  //   editBuilder.replace(range, updatedText)
  // })
  const fullRange = new Range(
    document.positionAt(0),
    document.positionAt(text.length),
  )
  return [TextEdit.replace(fullRange, updatedText)]
}

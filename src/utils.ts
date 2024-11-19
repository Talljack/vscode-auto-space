// import type { TextEditorEdit } from 'vscode'
import type { TextDocument } from 'vscode'
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
  const formatOnSave = config.get('formatOnSave') as boolean
  const formatOnDocument = config.get('formatOnDocument') as boolean
  const spaceType = config.get('spaceType') as AutoSpaceConfigType['spaceType']
  const excludedExtensions = config.get('excludedExtensions') as string[]
  return {
    formatOnSave,
    formatOnDocument,
    spaceType,
    excludedExtensions,
  }
}

/**
 *
 * @param document
 */
export function shouldProcessFile(document: TextDocument): boolean {
  const { excludedExtensions } = getAutoSpaceConfig()
  if (!excludedExtensions || excludedExtensions.length === 0)
    return true

  const fileName = document.fileName
  const fileExtension = fileName.split('.').pop()?.toLowerCase()

  if (!fileExtension)
    return true

  return !excludedExtensions.includes(fileExtension)
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
  if (!shouldProcessFile(document))
    return

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
  const fullRange = new Range(
    document.positionAt(0),
    document.positionAt(text.length),
  )
  return [TextEdit.replace(fullRange, updatedText)]
}

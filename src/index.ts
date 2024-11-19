import * as vscode from 'vscode'
import type { Disposable } from 'vscode'
import { autoAddSpace, getAutoSpaceConfig } from './utils'

let autoAddSpaceListener: Disposable
let configurationListener: Disposable

/**
 *
 * @param document
 */
async function formatDocument(document: vscode.TextDocument) {
  if (!shouldProcessFile(document))
    return []

  const text = document.getText()
  return autoAddSpace(text)
}

/**
 *
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
  const autoAddSpaceListener = vscode.commands.registerCommand('extension.autoAddSpace', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor)
      return

    const document = editor.document
    const text = document.getText()
    autoAddSpace(text)
  })
  context.subscriptions.push(autoAddSpaceListener)

  vscode.workspace.onWillSaveTextDocument((event) => {
    const { formatOnSave } = getAutoSpaceConfig()
    if (formatOnSave)
      event.waitUntil(formatDocument(event.document))
  })
  // 监听格式化文档命令
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('*', {
    provideDocumentFormattingEdits: (document) => {
      const { formatOnDocument } = getAutoSpaceConfig()
      if (formatOnDocument && isFormatDocumentCommand())
        return formatDocument(document)

      return []
    },
  })
  context.subscriptions.push(formattingProvider)
  // 全局变量来跟踪当前操作
  let isFormatDocumentCommandActive = false
  // 注册一个命令来设置标志
  const formatDocumentCommand = vscode.commands.registerCommand('editor.action.formatDocument', async () => {
    isFormatDocumentCommandActive = true
    try {
      await vscode.commands.executeCommand('editor.action.formatDocument.multiple')
    }
    finally {
      isFormatDocumentCommandActive = false
    }
  })

  /**
   *
   */
  function isFormatDocumentCommand() {
    return isFormatDocumentCommandActive
  }

  // 在 activate 函数中添加这个命令
  context.subscriptions.push(formatDocumentCommand)
}

/**
 *
 */
export function deactivate() {
  autoAddSpaceListener.dispose()
  configurationListener.dispose()
}

/**
 *
 * @param document
 */
function shouldProcessFile(document: vscode.TextDocument) {
  const { excludedExtensions } = getAutoSpaceConfig()
  const fileExtension = document.fileName.split('.').pop()

  return fileExtension && !excludedExtensions.includes(fileExtension)
}

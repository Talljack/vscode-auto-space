import * as vscode from 'vscode'
import type { Disposable } from 'vscode'
import { autoAddSpaceAll, autoAddSpaceComment, getAutoSapceConfig } from './utils'

let autoAddSpaceListener: Disposable
let configurationListener: Disposable

export function activate(context: vscode.ExtensionContext) {
  const registerFormatterIfEnabled = () => {
    const { enable } = getAutoSapceConfig()
    console.log('enable', enable)
    if (enable) {
      autoAddSpaceListener = vscode.languages.registerDocumentFormattingEditProvider('autoAddSpace', {
        provideDocumentFormattingEdits(document: vscode.TextDocument) {
          const text = document.getText()
          const { comment } = getAutoSapceConfig()
          console.log('comment', comment)
          if (comment === 'all')
            return autoAddSpaceAll(text)
          else if (comment === 'comment')
            return autoAddSpaceComment(text)
        },
      })
    }
    else {
      autoAddSpaceListener.dispose()
    }
  }
  registerFormatterIfEnabled()

  configurationListener = vscode.workspace.onDidChangeConfiguration(registerFormatterIfEnabled)
}

export function deactivate() {
  autoAddSpaceListener.dispose()
  configurationListener.dispose()
}

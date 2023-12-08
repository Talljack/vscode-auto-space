import * as vscode from 'vscode'
import type { Disposable } from 'vscode'
import { autoAddSpace, getAutoSpaceConfig } from './utils'

let autoAddSpaceListener: Disposable
let configurationListener: Disposable

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

  const configurationChanged = () => {
    const { enable } = getAutoSpaceConfig()
    if (enable)
      vscode.commands.executeCommand('extension.autoAddSpace')
    else
      autoAddSpaceListener.dispose()
  }

  configurationListener = vscode.workspace.onDidChangeConfiguration(configurationChanged)

  vscode.workspace.onWillSaveTextDocument(() => {
    const { enable } = getAutoSpaceConfig()
    if (enable)
      vscode.commands.executeCommand('extension.autoAddSpace')
    else
      autoAddSpaceListener.dispose()
  })
}

export function deactivate() {
  autoAddSpaceListener.dispose()
  configurationListener.dispose()
}

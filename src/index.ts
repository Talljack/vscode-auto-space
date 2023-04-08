import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.addSpaceBetweenComment', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor)
      return

    const document = editor.document
    const text = document.getText()
    // javascript java c++ c# php swift
    // const commentRegex = /^\/\/.*$|^\/\*[\s\S]*?\*\//gm
    // // python
    // const pythonRegex = /^(\"\"\"|\'\'\')([\s\S]*?)(\"\"\"|\'\'\')|(^#.*$)/gm
    // // ruby
    // const rubyRegex = /^#\s*(.*)$/gm
    // const commonlines = text.match(commentRegex)
    // const pythonlines = text.match(pythonRegex)
    // const rubylines = text.match(rubyRegex)
    // const lines = commonlines?.concat(pythonlines ?? []).concat(rubylines ?? [])
    const lines = text.split(/\n/g)
    const updatedLines = lines?.map((line) => {
      const regexCE = /\s*?.*?([\u4E00-\u9FA5]+)([a-zA-Z0-9]+).*/g
      const regexEC = /\s*?.*?([a-zA-Z0-9]+)([\u4E00-\u9FA5]+).*/g
      let match = regexCE.exec(line) || regexEC.exec(line)
      while (match !== null) {
        const chinese = match[1]
        const english = match[2]
        line = line.replace(chinese + english, `${chinese} ${english}`)
        match = regexCE.exec(line) || regexEC.exec(line)
      }
      return line
    })

    const updatedText = updatedLines.join('\n')
    const start = new vscode.Position(0, 0)
    const end = new vscode.Position(document.lineCount, 0)
    const range = new vscode.Range(start, end)
    editor.edit((editBuilder) => {
      editBuilder.replace(range, updatedText)
    })
  })

  context.subscriptions.push(disposable)

  vscode.workspace.onDidSaveTextDocument((textDocument) => {
    console.log('save', textDocument.isDirty)
    if (textDocument.isDirty) {
      console.log('jump', textDocument.isDirty)
      vscode.commands.executeCommand('extension.addSpaceBetweenComment')
    }
  })
}

export function deactivate() { }

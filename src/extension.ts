// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import nodeFS, { readdirSync } from "node:fs"
import { basename, dirname, resolve } from "node:path"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand(
        "tolokoban-quick-file-switcher.switch",
        () => {
            const editor = vscode.window.activeTextEditor
            if (!editor) {
                // The code you place here will be executed every time your command is executed
                // Display a message box to the user
                vscode.window.showErrorMessage(
                    "This command works only with an active editor!"
                )
                return
            }
            const { fileName } = editor.document
            const dirName = dirname(fileName)
            const fileBaseName = basename(fileName)
            const commonPrefix = `${fileBaseName.split(".")[0]}.`
            const siblings = readdirSync(dirName, {
                withFileTypes: true,
                recursive: false,
            })
                .filter(
                    file => file.isFile() && file.name.startsWith(commonPrefix)
                )
                .map(file => file.name)
            const currentIndex = siblings.findIndex(
                name => name === fileBaseName
            )
            const targetFileName = resolve(
                dirName,
                siblings[(currentIndex + 1) % siblings.length] ?? fileBaseName
            )
            vscode.workspace.openTextDocument(targetFileName).then(
                (document: vscode.TextDocument) => {
                    vscode.window.showTextDocument(document)
                    vscode.window.showInformationMessage("Done.")
                },
                (reason: any) => {
                    vscode.window.showErrorMessage(reason)
                }
            )
            vscode.window.showInformationMessage(
                `Switched to "${base(targetFileName)}".`
            )
        }
    )

    context.subscriptions.push(disposable)
}

function base(path: string) {
    const parts = path.split("/")
    return parts.pop()
}

// This method is called when your extension is deactivated
export function deactivate() {}

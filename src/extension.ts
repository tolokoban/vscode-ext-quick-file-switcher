// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import nodeFS from "node:fs"

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
            const TS = ["tsx", "ts", "jsx", "js"]
            const CSS = ["module.css", "module.scss", "css", "scss"]
            const TEST = [
                "test.tsx",
                "test.ts",
                "test.jsx",
                "test.js",
                "spec.tsx",
                "spec.ts",
                "spec.jsx",
                "spec.js",
            ]
            const switches: Array<[string[], string[]]> = [
                [TEST, TS],
                [TS, [...CSS, "vert", "frag", ...TEST]],
                [CSS, [...TEST, ...TS]],
                [["vert"], ["frag", ...TEST, ...TS]],
                [["frag"], [...TEST, ...TS, "vert"]],
            ]
            const { fileName } = editor.document
            for (const [inputs, outputs] of switches) {
                for (const input of inputs) {
                    if (fileName.endsWith(`.${input}`)) {
                        for (const output of outputs) {
                            const targetFileName = `${fileName.substring(
                                0,
                                fileName.length - input.length
                            )}${output}`
                            if (!nodeFS.existsSync(targetFileName)) {
                                continue
                            }

                            vscode.workspace
                                .openTextDocument(targetFileName)
                                .then(
                                    (document: vscode.TextDocument) => {
                                        vscode.window.showTextDocument(document)
                                        vscode.window.showInformationMessage(
                                            "Done."
                                        )
                                    },
                                    (reason: any) => {
                                        vscode.window.showErrorMessage(reason)
                                    }
                                )
                            vscode.window.showInformationMessage(
                                `Switched to "${base(targetFileName)}".`
                            )
                            return
                        }
                        return
                    }
                }
            }
            vscode.window.showInformationMessage(
                `Don't know how to switch from this file: "${fileName}"!`
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

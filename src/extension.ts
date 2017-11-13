'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
        for (const folder of vscode.workspace.workspaceFolders!) {
            try {
                vscode.workspace.getConfiguration('files', folder.uri).get('exclude');
            } catch (e) {
                console.log(e, folder.uri.fsPath);
            }
        }
    });
    vscode.workspace.onDidChangeWorkspaceFolders((e: vscode.WorkspaceFoldersChangeEvent) => {
        if (e.added.length) {
            try {
                vscode.workspace.getConfiguration('files', e.added[0].uri).get('exclude');
            } catch (e) {
                console.log(e);
            }
        }
        if (e.removed.length) {
            try {
                vscode.workspace.getConfiguration('files', e.removed[0].uri).get('exclude');
            } catch (e) {
                console.log(e);
            }
        }
    });
}

'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
		vscode.commands.registerCommand('simple.setTrue', () => context.globalState.update('syncKey', true)),
		vscode.commands.registerCommand('simple.setFalse', () => context.globalState.update('syncKey', false)),
		vscode.commands.registerCommand('simple.setUndefined', () => context.globalState.update('syncKey', undefined))
	);

	context.globalState.setKeysForSync(['syncKey']);

	let disposable: vscode.Disposable | undefined;
	setInterval(() => {
		disposable?.dispose();
		disposable = vscode.window.setStatusBarMessage(
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			`syncKey=${context.globalState.get<boolean>('syncKey')}, ${new Date()}`
		);
	}, 1000);
}

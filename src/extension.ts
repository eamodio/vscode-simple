'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
	const fn = (command: string) => {
		void vscode.window.showInformationMessage(`${command} executed`);
	};
	context.subscriptions.push(
		vscode.commands.registerCommand('simple.command', () => fn('simple.command')),
		vscode.commands.registerCommand('simple.commandInDiffLeft', () => fn('simple.commandInDiffLeft')),
		vscode.commands.registerCommand('simple.commandInDiffRight', () => fn('simple.commandInDiffRight'))
	);
}

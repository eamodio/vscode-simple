'use strict';
import { clear } from 'console';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const content = `function foo(){

	console.log('hello');
	console.log('world');

	console.log('works!');

	console.log('hello');
	console.log('world');

	console.log('works!');

	console.log('hello');
	console.log('world');

	console.log('works!');
}`;

	vscode.commands.registerCommand('simple.command', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const cursor = editor.selection.active;
		const end = editor.document.validatePosition(new vscode.Position(cursor.line, Number.MAX_VALUE));
		if (end.character !== cursor.character) return;

		const lines = content.split('\n');

		const editorConfig = vscode.workspace.getConfiguration('editor');
		let lineHeight = editorConfig.get('lineHeight');
		if (lineHeight === 0) {
			lineHeight = Math.floor(editorConfig.get<number>('fontSize', 14) * 1.4);
		}

		const firstGhostLine = vscode.window.createTextEditorDecorationType({
			rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
			textDecoration: 'none',
			before: {
				color: new vscode.ThemeColor('simple.ghostTextColor'),
			},
		});

		const nextGhostLine = vscode.window.createTextEditorDecorationType({
			rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
			before: {
				color: new vscode.ThemeColor('simple.ghostTextColor'),
				textDecoration: `none;display:block;white-space:pre;`,
			},
		});

		const nonGhostLines = vscode.window.createTextEditorDecorationType({
			rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
			before: {
				contentText: ' ',
				textDecoration: `none;display:block;margin-bottom:calc(${lineHeight}px * ${lines.length});`,
			},
		});

		const firstGhostLineDecorations: vscode.DecorationOptions[] = [];
		firstGhostLineDecorations.push({
			range: new vscode.Range(cursor, cursor),
			renderOptions: {
				before: {
					contentText: lines.shift() || ' ',
				},
			},
		});

		const nextGhostLineDecorations: vscode.DecorationOptions[] = [];
		const range = editor.document.validateRange(
			new vscode.Range(
				new vscode.Position(cursor.line + 1, 0),
				new vscode.Position(cursor.line + 1, Number.MAX_VALUE)
			)
		);

		nextGhostLineDecorations.push({
			range: range,
			renderOptions: {
				before: {
					// can't use contentText because it will escape the `\A`
					contentText: ' ', //lines.join('\\A'),
					textDecoration: `none;content:'${lines
						.join('\\A')
						.replace(/['\\][^A]/g, '\\$&')
						.replace(' ', '\u00a0')}';margin-bottom:calc(-${lineHeight}px * ${lines.length});`,
				},
			},
		});

		await vscode.workspace.getConfiguration('editor').update('codeLens', false);

		const nonGhostDecorations: vscode.DecorationOptions[] = [];
		for (let i = cursor.line + 1; i < editor.visibleRanges[0].end.line + 100; i++) {
			nonGhostDecorations.push({
				range: new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, 0)),
			});
		}

		editor.setDecorations(firstGhostLine, firstGhostLineDecorations);
		editor.setDecorations(nextGhostLine, nextGhostLineDecorations);
		editor.setDecorations(nonGhostLines, nonGhostDecorations);

		let disposables: vscode.Disposable[] = [];

		function reset() {
			disposables.forEach((d) => d.dispose());
			editor!.setDecorations(firstGhostLine, []);
			editor!.setDecorations(nextGhostLine, []);
			editor!.setDecorations(nonGhostLines, []);
			vscode.workspace.getConfiguration('editor').update('codeLens', true);
		}

		disposables.push(
			vscode.window.onDidChangeTextEditorSelection(() => reset()),
			vscode.window.onDidChangeTextEditorVisibleRanges(() => reset())
		);
	});
}

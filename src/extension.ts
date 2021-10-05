'use strict';
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
	const fs = new RevisionFileSystem();

	context.subscriptions.push(
		vscode.commands.registerCommand('simple.open', async () => {
			vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('simple:///foo.md'));
		}),

		vscode.commands.registerCommand('simple.reset', async () => {
			fs.reset();
		}),

		vscode.workspace.registerFileSystemProvider('simple', fs)
	);
}

class RevisionFileSystem implements vscode.FileSystemProvider {
	private state: { mtime: number; revision: number } = { mtime: Date.now(), revision: 1 };

	reset() {
		this.state = { mtime: Date.now(), revision: 1 };
		this.canFastForward = true;
	}

	private canFastForward = true;
	private fastForward() {
		if (!this.canFastForward) return;

		this.canFastForward = false;
		this.state.mtime = Date.now();
		this.state.revision++;
		this._onDidChangeFile.fire([
			{ type: vscode.FileChangeType.Changed, uri: vscode.Uri.parse('simple:///foo.md') },
		]);
	}

	private _onDidChangeFile = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	get onDidChangeFile(): vscode.Event<vscode.FileChangeEvent[]> {
		return this._onDidChangeFile.event;
	}

	watch(uri: vscode.Uri, options: { recursive: boolean; excludes: string[] }): vscode.Disposable {
		return {
			dispose: () => {},
		};
	}

	async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
		const state = { ...this.state };
		console.log('stat', uri.toString(), state.revision);

		await sleep(2500);
		this.fastForward();
		await sleep(2500);

		return Promise.resolve({
			type: vscode.FileType.File,
			ctime: 0,
			mtime: state.mtime,
			size: 1,
		});
	}

	async readFile(uri: vscode.Uri): Promise<Uint8Array> {
		const state = { ...this.state };
		console.log('readFile', uri.toString(), state.revision);

		await sleep(2500);
		this.fastForward();
		await sleep(2500);

		return Promise.resolve(Buffer.from(`revision: ${state.revision}`));
	}

	readDirectory(uri: vscode.Uri): [string, vscode.FileType][] {
		throw new Error('Method not implemented.');
	}

	writeFile(uri: vscode.Uri, content: Uint8Array): void {
		throw new Error('Method not implemented.');
	}

	createDirectory(uri: vscode.Uri): void {
		throw new Error('Method not implemented.');
	}

	delete(uri: vscode.Uri, options: { recursive: boolean }): void {
		throw new Error('Method not implemented.');
	}

	rename(oldUri: vscode.Uri, newUri: vscode.Uri, options: { overwrite: boolean }): void {
		throw new Error('Method not implemented.');
	}

	copy(source: vscode.Uri, destination: vscode.Uri, options: { overwrite: boolean }): void {
		throw new Error('Method not implemented.');
	}
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

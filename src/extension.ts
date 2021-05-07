'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	// const hello = 'Hello';
	// const world = 'World';
	// void vscode.window.showInformationMessage(
	// 	'1 Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :)',
	// 	hello,
	// 	world
	// );

	// void vscode.window.showWarningMessage(
	// 	'2 Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :)',
	// 	hello,
	// 	world
	// );

	// void vscode.window.showErrorMessage(
	// 	'3 Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :) Hello World! How are things going today? Well great? :)',
	// 	hello,
	// 	world
	// );

	const tdp = new SimpleTree();
	vscode.window.createTreeView('simple.view', { treeDataProvider: tdp });
	vscode.commands.registerCommand('simple.command', () => tdp.refresh());
}

let count = 0;

class SimpleTree implements vscode.TreeDataProvider<TreeItemWithChildren> {
	private _onDidChangeTreeData = new vscode.EventEmitter<TreeItemWithChildren | null | undefined>();
	onDidChangeTreeData = this._onDidChangeTreeData.event;

	children: TreeItemWithChildren[];

	constructor() {
		this.children = [
			this.getChild('Behind', [
				this.getChild(
					'Commits',
					Promise.resolve([
						this.getChild('commit 1'),
						this.getChild('commit 2'),
						this.getChild('commit 3'),
						this.getChild('commit 4'),
					])
				),
				this.getChild(
					'files changed',
					Promise.resolve([
						this.getChild('file 1'),
						this.getChild('file 2'),
						this.getChild('file 3'),
						this.getChild('file 4'),
					])
				),
			]),
			this.getChild('Ahead', [
				this.getChild(
					'Commits',
					Promise.resolve([
						this.getChild('commit 1'),
						this.getChild('commit 2'),
						this.getChild('commit 3'),
						this.getChild('commit 4'),
					])
				),
				this.getChild(
					'files changed',
					Promise.resolve([
						this.getChild('file 1'),
						this.getChild('file 2'),
						this.getChild('file 3'),
						this.getChild('file 4'),
					])
				),
			]),
			this.getChild(
				'files changed',
				Promise.resolve([
					this.getChild('file 1'),
					this.getChild('file 2'),
					this.getChild('file 3'),
					this.getChild('file 4'),
				])
			),
		];

		setInterval(async () => {
			let item: TreeItemWithChildren | undefined = undefined;
			switch (random(0, 2)) {
				case 0:
					// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
					item = (await this.children[0].children)?.[1]!;
					break;
				case 1:
					// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
					item = (await this.children[1].children)?.[1]!;
					break;
				case 2:
					item = this.children[2];
					break;
			}
			if (!item) return;

			item.label = `${item.contextValue ?? ''} ${Date.now()}`;
			this.refresh(item);
		}, 1000);
	}

	refresh(item?: TreeItemWithChildren) {
		this._onDidChangeTreeData.fire(item);
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		if (element) return element;

		const item = new TreeItemWithChildren('root', vscode.TreeItemCollapsibleState.Expanded);
		return item;
	}

	getChildren(element?: TreeItemWithChildren): vscode.ProviderResult<TreeItemWithChildren[]> {
		return element?.children ?? this.children;
	}

	private getChild(
		label: string,
		children?: TreeItemWithChildren[] | Promise<TreeItemWithChildren[]>
	): TreeItemWithChildren {
		const item = new TreeItemWithChildren(label, vscode.TreeItemCollapsibleState.Collapsed);
		// item.iconPath = new vscode.ThemeIcon(icon, color ? new vscode.ThemeColor(color) : undefined);
		item.id = `${count++}`;
		item.contextValue = `${item.id}: ${label}`;
		item.children = children;
		return item;
	}
}

function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

class TreeItemWithChildren extends vscode.TreeItem {
	children?: TreeItemWithChildren[] | Promise<TreeItemWithChildren[]>;

	constructor(public label: string, public collapsibleState: vscode.TreeItemCollapsibleState) {
		super(label, collapsibleState);
	}
}

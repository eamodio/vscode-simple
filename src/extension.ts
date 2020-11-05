'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const tdp = new SimpleTree();
	vscode.window.createTreeView('simple.view', { treeDataProvider: tdp });
	vscode.commands.registerCommand('simple.command', () => tdp.refresh());
}

class SimpleTree implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | null | undefined>();
	onDidChangeTreeData = this._onDidChangeTreeData.event;

	children: vscode.TreeItem[];

	constructor() {
		this.children = [
			this.getChild('Compare', 'git-compare'),
			this.getChild('Push', 'cloud-upload', 'simple.iconColor1'),
			this.getChild('Pull', 'cloud-download', 'simple.iconColor2'),
			this.getChild('Push', 'cloud-upload', 'simple.iconColor2'),
			this.getChild('Pull', 'cloud-download', 'simple.iconColor1')
		];

		setInterval(() => {
			const child = this.children[random(0, 4)];
			child.label = `${child.contextValue} ${Date.now()}`;
			this.refresh(child);
		}, 10000);
	}

	refresh(item?: vscode.TreeItem) {
		this._onDidChangeTreeData.fire(item);
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		if (element) return element;

		const item = new vscode.TreeItem('root', vscode.TreeItemCollapsibleState.Expanded);
		return item;
	}

	getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
		return this.children;
	}

	private getChild(label: string, icon: string, color?: string) {
		const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
		item.iconPath = new (vscode.ThemeIcon as any)(icon, color ? new vscode.ThemeColor(color) : undefined);
		item.contextValue = label;
		return item;
	}
}

function random(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

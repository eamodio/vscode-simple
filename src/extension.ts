'use strict';
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    const tree = new TestTree();

    context.subscriptions.push(
        vscode.commands.registerCommand('simple.views.refresh', () => tree.refresh()),
        vscode.commands.registerCommand('simple.views.toggle', (node: TestNode) => {
            if (node.counter === undefined) {
                node.counter = 0;
            }
            node.counter++;
            if (node.collapsibleState === vscode.TreeItemCollapsibleState.None) {
                node.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
            } else {
                node.collapsibleState = vscode.TreeItemCollapsibleState.None;
            }
            tree.refresh(node);
        }),
        vscode.window.registerTreeDataProvider('simple.view', tree)
    );
}

class TestTree implements vscode.TreeDataProvider<TestNode> {
    protected _onDidChangeTreeData = new vscode.EventEmitter<TestNode>();
    get onDidChangeTreeData(): vscode.Event<TestNode> {
        return this._onDidChangeTreeData.event;
    }

    private _children: TestNode[] = [
        new TestNode('Click to Refresh All', undefined, 'simple.views.refresh'),
        new TestNode('Click to Toggle & Refresh Node', 0, 'simple.views.toggle', [new TestNode('Child')])
    ];

    getTreeItem(element: TestNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: TestNode): vscode.ProviderResult<TestNode[]> {
        return element ? element.getChildren() : this._children;
    }

    refresh(node?: TestNode) {
        this._onDidChangeTreeData.fire(node);
    }
}

class TestNode implements vscode.TreeItem {
    public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;

    constructor(
        public id: string,
        public counter?: number,
        private _command?: string,
        private _children: TestNode[] = []
    ) {}

    get label(): string {
        return this.id;
    }

    get description(): string {
        return this.counter === undefined
            ? ''
            : `${this.counter}, state=${
                  this.collapsibleState === vscode.TreeItemCollapsibleState.None ? 'none' : 'collapsed'
              }`;
    }
    get command(): vscode.Command | undefined {
        if (this._command === undefined) return undefined;

        return {
            title: this._command,
            command: this._command,
            arguments: [this]
        };
    }

    getChildren(): vscode.ProviderResult<TestNode[]> {
        return this._children;
    }
}

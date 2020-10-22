'use strict';
import * as vscode from 'vscode';
import { GitExtension } from './git';

// foo
export function activate(context: vscode.ExtensionContext) {
	// const gitExtension = await vscode.extensions.getExtension<GitExtension>('vscode.git')?.activate();
	// if (gitExtension?.enabled !== true) {
	// 	throw new Error('vscode.git Git extension not enabled');
	// }
	// const gitApi = gitExtension.getAPI(1);
	// gitApi.onDidOpenRepository(async repo => {
	// 	try {
	// 		const log = await repo.log({ maxEntries: 10 });
	// 		console.log(log.length);
	// 	} catch (ex) {
	// 		console.error(ex);
	// 	}
	// });
}

// export async function activate(context: vscode.ExtensionContext) {
// 	context.subscriptions.push(
// 		vscode.workspace.registerTimelineProvider(
// 			{},
// 			{
// 				source: 'my-magical-timeline-provider',
// 				sourceDescription: 'My magical timeline provider',
// 				provideTimeline: (uri: vscode.Uri, token: vscode.CancellationToken) => {
// 					console.log('provide');
// 					const result: vscode.TimelineItem[] = [new vscode.TimelineItem('rawr', Date.now())];
// 					return result;
// 				}
// 			}
// 		)
// 	);
// }

// export async function activate(context: vscode.ExtensionContext) {yarn
// 	vscode.authentication.onDidRegisterAuthenticationProvider(async () => {
// 		console.log('onDidRegisterAuthenticationProvider');
// 		for (const provider of vscode.authentication.providers) {
// 			console.log(provider.displayName, provider.id);

// 			// const sessions = await provider.getSessions();
// 			// for (const session of sessions) {
// 			// 	console.log(session.displayName);
// 			// 	console.log(session.id);
// 			// 	console.log(`scopes: ${session.scopes.join(', ')}`);
// 			// }
// 		}
// 	});

// 	vscode.authentication.onDidUnregisterAuthenticationProvider(async () => {
// 		console.log('onDidUnregisterAuthenticationProvider');
// 		for (const provider of vscode.authentication.providers) {
// 			console.log(provider.displayName, provider.id);

// 			// const sessions = await provider.getSessions();
// 			// for (const session of sessions) {
// 			// 	console.log(session.displayName);
// 			// 	console.log(session.id);
// 			// 	console.log(`scopes: ${session.scopes.join(', ')}`);
// 			// }
// 		}
// 	});

// 	const provider = new (class implements vscode.AuthenticationProvider {
// 		id = 'GitHub';
// 		displayName = 'GitHub';

// 		private _onDidChangeSessions = new vscode.EventEmitter<void>();
// 		onDidChangeSessions: vscode.Event<void> = this._onDidChangeSessions.event;

// 		private _sessions: vscode.Session[] = [];

// 		getSessions(): Promise<readonly vscode.Session[]> {
// 			return Promise.resolve([...this._sessions]);
// 			// throw new Error('Method not implemented.');
// 		}

// 		login(scopes: string[]): Promise<vscode.Session> {
// 			const session = {
// 				id: this._sessions.length.toString(),
// 				displayName: 'foo',
// 				accessToken: 'bar',
// 				scopes: scopes
// 			};
// 			this._sessions.push(session);
// 			this._onDidChangeSessions.fire();
// 			return Promise.resolve({ ...session });
// 		}

// 		logout(sessionId: string): Promise<void> {
// 			const index = this._sessions.findIndex(s => s.id === sessionId);
// 			if (index !== -1) {
// 				this._sessions.splice(index, 1);
// 				this._onDidChangeSessions.fire();
// 			}
// 			return Promise.resolve();
// 		}
// 	})();
// 	const disposable = vscode.authentication.registerAuthenticationProvider(provider);

// 	for (const provider of vscode.authentication.providers) {
// 		console.log(provider.displayName, provider.id);
// 	}

// 	// setTimeout(() => disposable.dispose(), 2000);

// 	const session = await provider.login(['foo', 'bar']);
// 	// session.
// }

// class TestTree implements vscode.TreeDataProvider<TestNode> {
// 	protected _onDidChangeTreeData = new vscode.EventEmitter<TestNode>();
// 	get onDidChangeTreeData(): vscode.Event<TestNode> {
// 		return this._onDidChangeTreeData.event;
// 	}

// 	private _children: TestNode[] = [
// 		new TestNode('Click to Refresh All', undefined, 'simple.views.refresh'),
// 		new TestNode('Click to Toggle & Refresh Node', 0, 'simple.views.toggle', [new TestNode('Child')])
// 	];

// 	getTreeItem(element: TestNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
// 		return element;
// 	}

// 	getChildren(element?: TestNode): vscode.ProviderResult<TestNode[]> {
// 		return element ? element.getChildren() : this._children;
// 	}

// 	refresh(node?: TestNode) {
// 		this._onDidChangeTreeData.fire(node);
// 	}
// }

// class TestNode implements vscode.TreeItem {
// 	public collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;

// 	constructor(
// 		public id: string,
// 		public counter?: number,
// 		private _command?: string,
// 		private _children: TestNode[] = []
// 	) {}

// 	get label(): string {
// 		return this.id;
// 	}

// 	get description(): string {
// 		return this.counter === undefined
// 			? ''
// 			: `${this.counter}, state=${
// 					this.collapsibleState === vscode.TreeItemCollapsibleState.None ? 'none' : 'collapsed'
// 			  }`;
// 	}
// 	get command(): vscode.Command | undefined {
// 		if (this._command === undefined) return undefined;

// 		return {
// 			title: this._command,
// 			command: this._command,
// 			arguments: [this]
// 		};
// 	}

// 	getChildren(): vscode.ProviderResult<TestNode[]> {
// 		return this._children;
// 	}
// }

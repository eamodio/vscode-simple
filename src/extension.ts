import type { Disposable, ExtensionContext, QuickPickItem } from 'vscode';
import { commands, window } from 'vscode';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand('simple.quickpick.open', async () => {
			const items = await showPicker(
				'Simple QuickPick',
				'Select an item',
				getItems(),
				item => Math.random() < 0.5,
			);

			console.log('Selected items:', items);
		}),
	);
}

function getItems(): Promise<SimpleItem[]> {
	const items: SimpleItem[] = [];
	for (let i = 1; i <= 100; i++) {
		items.push({ id: i });
	}
	return Promise.resolve(items);
}

type SimpleItem = { id: number };
type SimpleQuickPickItem = QuickPickItem & { item: SimpleItem };

async function showPicker(
	title: string,
	placeholder: string,
	simpleItems: Promise<SimpleItem[]>,
	picked?: (item: SimpleItem) => boolean,
): Promise<SimpleItem[] | undefined> {
	const deferred = defer<SimpleItem[] | undefined>();
	const disposables: Disposable[] = [];

	try {
		const quickpick = window.createQuickPick<SimpleQuickPickItem>();
		disposables.push(
			quickpick,
			quickpick.onDidHide(() => deferred.fulfill(undefined)),
			quickpick.onDidAccept(() =>
				!quickpick.busy ? deferred.fulfill(quickpick.selectedItems.map(c => c.item)) : undefined,
			),
		);

		quickpick.ignoreFocusOut = true;

		quickpick.title = title;
		quickpick.matchOnDescription = true;
		quickpick.matchOnDetail = true;
		quickpick.placeholder = 'Loading...';

		quickpick.busy = true;
		quickpick.show();

		const items = (await simpleItems).map<SimpleQuickPickItem>(i => ({
			label: `Item ${i.id}`,
			description: `#${i.id}`,
			item: i,
			picked: picked?.(i) ?? false,
		}));

		if (!deferred.pending) return;

		quickpick.busy = false;

		// NOTE
		// If this is here (BEFORE setting items), the picker works fine
		// quickpick.canSelectMany = true;

		quickpick.placeholder = placeholder;
		quickpick.items = items;

		// If this is here (AFTER setting items AND the quick pick is already visible), the picker will be in a bad state
		quickpick.canSelectMany = true;

		if (quickpick.canSelectMany) {
			quickpick.selectedItems = items.filter(i => i.picked);
		} else {
			quickpick.activeItems = items.filter(i => i.picked);
		}

		const picks = await deferred.promise;
		return picks;
	} finally {
		disposables.forEach(d => void d.dispose());
	}
}

interface Deferred<T> {
	readonly pending: boolean;
	readonly promise: Promise<T>;
	fulfill: (value: T) => void;
	cancel(): void;
}
type Mutable<T> = { -readonly [P in keyof T]: T[P] };

function defer<T>(): Deferred<T> {
	const deferred: Mutable<Deferred<T>> = {
		pending: true,
		promise: undefined!,
		fulfill: undefined!,
		cancel: undefined!,
	};
	deferred.promise = new Promise((resolve, reject) => {
		deferred.fulfill = function (value) {
			deferred.pending = false;
			resolve(value);
		};
		deferred.cancel = function () {
			deferred.pending = false;
			reject();
		};
	});
	return deferred;
}

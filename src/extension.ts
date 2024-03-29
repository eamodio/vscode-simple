import type {ExtensionContext} from "vscode";
import { commands,  window } from "vscode";

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand('simple.value', () => {
			const qp = window.createQuickPick();
			qp.items = [
				{ label: '1', description: '1' },
				{ label: '2', description: '2' },
				{ label: '3', description: '3' },
				{ label: '4', description: '4' },
			];

			const timer = setInterval(() => {
				qp.value = Math.floor(Math.random() * qp.items.length).toString();
			}, 2500);

			qp.onDidHide(() => clearInterval(timer));
			qp.onDidChangeActive(e => console.log('onDidChangeActive', e[0].label));
			qp.onDidChangeSelection(e => console.log('onDidChangeSelection', e[0].label));
			qp.onDidChangeValue(e => console.log('onDidChangeValue', e));
			qp.show();
		}),
		commands.registerCommand('simple.active', () => {
			const qp = window.createQuickPick();
			qp.items = [
				{ label: '1', description: '1' },
				{ label: '2', description: '2' },
				{ label: '3', description: '3' },
				{ label: '4', description: '4' },
			];

			const timer = setInterval(() => {
				qp.activeItems = [qp.items[Math.floor(Math.random() * qp.items.length)]];
			}, 2500);

			qp.onDidHide(() => clearInterval(timer));
			qp.onDidChangeActive(e => console.log('onDidChangeActive', e[0].label));
			qp.onDidChangeSelection(e => console.log('onDidChangeSelection', e[0].label));
			qp.onDidChangeValue(e => console.log('onDidChangeValue', e));
			qp.show();
		}),
		commands.registerCommand('simple.selected', () => {
			const qp = window.createQuickPick();
			qp.items = [
				{ label: '1', description: '1' },
				{ label: '2', description: '2' },
				{ label: '3', description: '3' },
				{ label: '4', description: '4' },
			];

			const timer = setInterval(() => {
				qp.selectedItems = [qp.items[Math.floor(Math.random() * qp.items.length)]];
			}, 2500);

			qp.onDidHide(() => clearInterval(timer));
			qp.onDidChangeActive(e => console.log('onDidChangeActive', e[0].label));
			qp.onDidChangeSelection(e => console.log('onDidChangeSelection', e[0].label));
			qp.onDidChangeValue(e => console.log('onDidChangeValue', e));
			qp.show();
		}),
	);
}

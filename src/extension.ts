import type { CancellationToken, Disposable, ExtensionContext, Progress } from 'vscode';
import { commands, ProgressLocation, ViewColumn, window } from 'vscode';

export function activate(context: ExtensionContext) {
	context.subscriptions.push(
		commands.registerCommand('simple.webview.open', () => {
			const panel = window.createWebviewPanel('simple.sample', 'Simple Sample', ViewColumn.Active, {
				enableScripts: true,
				localResourceRoots: [],
				retainContextWhenHidden: true,
			});

			panel.webview.html = `<!doctype html>
<html>
	<head>
		<style type="text/css">
			body, html { width: 100%; height: 100%; }
			section { width: 100%; height: 100%; }
			#console { width: 100%; height: 100%; }
		</style>
		<script type="text/javascript">
			window.addEventListener('message', event => {
				const el = document.getElementById('console');
				el.value = \`\${el.value || ''}\n\${new Date().toISOString()}\t\${event.data.text}\`;
			});
		</script>
	</head>
	<body>
		<section>
			<h1>Simple Webview Sample</h1>
			<textarea id="console"></textarea>
		</section>
	</body>
</html>`;

			function postMessage(text: string) {
				return window.withProgress(
					{ location: ProgressLocation.Notification, cancellable: true },
					async (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => {
						progress.report({ message: `Sending message: ${text}` });

						let timeout: ReturnType<typeof setTimeout> | undefined;

						// It looks like there is a bug where `postMessage` can sometimes just hang infinitely. Not sure why, but ensure we don't hang forever
						const promise = Promise.race<boolean>([
							panel.webview.postMessage({ text: text }).then(
								s => {
									clearTimeout(timeout);
									return s;
								},
								ex => {
									clearTimeout(timeout);
									debugger;
									void window.showErrorMessage(`Error sending message: ${ex}`);
									return false;
								},
							),
							new Promise<boolean>(resolve => {
								token.onCancellationRequested(() => resolve(false));

								timeout = setTimeout(() => {
									debugger;
									void window.showErrorMessage(`Timed out sending message: ${text}`);
									resolve(false);
								}, 15000);
							}),
						]);

						const success = await promise;
						return success;
					},
				);
			}

			const disposables: Disposable[] = [
				panel.onDidDispose(() => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					disposables.forEach(d => d.dispose());
				}),

				// NOTE: Uncomment these lines to see that these `postMessage` calls will hang indefinitely right at the start

				// panel.onDidChangeViewState(e => {
				// 	void postMessage(
				// 		`panel.onDidChangeViewState: active=${e.webviewPanel.active}, visible=${e.webviewPanel.visible}`,
				// 	);
				// }),
				// window.onDidChangeWindowState(e => {
				// 	void postMessage(`window.onDidChangeWindowState: focused=${e.focused}`);
				// }),
			];

			panel.reveal();

			// NOTE: If you uncomment the lines above, comment these out

			// Avoid setting up the event listeners until after reveal as `postMessage`'s called too early will hang indefinitely
			setTimeout(() => {
				disposables.push(
					panel.onDidChangeViewState(e => {
						void postMessage(
							`panel.onDidChangeViewState: active=${e.webviewPanel.active}, visible=${e.webviewPanel.visible}`,
						);
					}),
					window.onDidChangeWindowState(e => {
						void postMessage(`window.onDidChangeWindowState: focused=${e.focused}`);
					}),
				);
			}, 100);
		}),
	);
}

/**
 * chunt — VS Code extension
 *
 * Thin wrapper around the chunt language server (https://github.com/dgethings/chunt),
 * following the pattern of helm-ls-vscode: resolve the server binary, spawn it
 * with `serve` over stdio, and register a LanguageClient for the
 * cisco_ios_jinja2 language.
 *
 * Unlike helm-ls-vscode (which downloads the server on first run), the chunt
 * binary is bundled into platform-specific VSIX targets — there is no runtime
 * download. A `chunt.path` setting overrides the bundled binary for local
 * server development.
 */

import * as vscode from "vscode";

import {
	Executable,
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from "vscode-languageclient/node";
import { getChuntExecutable } from "./util/executable";

let client: LanguageClient | undefined;

export async function activate(context: vscode.ExtensionContext) {
	const chuntExecutable = await getChuntExecutable(context);
	if (!chuntExecutable) {
		// getChuntExecutable has already shown the user an actionable error.
		return;
	}

	const logLevel = vscode.workspace
		.getConfiguration("chunt")
		.get<string>("logLevel", "info");

	// NOTE: do NOT set `transport: TransportKind.stdio` here. For a plain
	// (non-Node) Executable, vscode-languageclient treats an explicit stdio
	// transport as a launcher convention and appends a literal `--stdio` flag
	// to the server args (node/main.js: `if (transport === TransportKind.stdio)
	// args.push("--stdio")`). chunt's cobra CLI rejects that flag and exits,
	// killing the server on every startup. With the field omitted, the client
	// defaults to stdio framing without adding any flag.
	const executable: Executable = {
		command: chuntExecutable,
		args: ["serve", "--log-level", logLevel],
	};

	const serverOptions: ServerOptions = {
		run: executable,
		debug: executable,
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{
				language: "cisco_ios_jinja2",
				scheme: "file",
			},
		],
		outputChannelName: "chunt",
	};

	client = new LanguageClient(
		"chunt",
		"chunt Language Server",
		serverOptions,
		clientOptions,
	);

	try {
		await client.start();
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		void vscode.window.showErrorMessage(`chunt failed to start: ${msg}`);
		client = undefined;
	}
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

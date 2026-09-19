import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";

/**
 * Resolve the chunt server executable.
 *
 * Resolution order:
 *   1. The `chunt.path` setting (explicit override, e.g. a locally built binary)
 *   2. The binary bundled with this platform-specific VSIX: bin/chunt on
 *      darwin/linux, bin/chunt.exe on windows
 *
 * There is deliberately no PATH lookup or runtime download: the binary ships
 * inside each platform VSIX (darwin-x64/arm64, linux-x64/arm64, win32-x64/
 * arm64), which keeps the server version in lockstep with the extension that
 * was tested against it.
 */
export async function getChuntExecutable(
	context: vscode.ExtensionContext,
): Promise<string | null> {
	const configured = vscode.workspace
		.getConfiguration("chunt")
		.get<string>("path");
	if (configured) {
		try {
			if ((await fs.stat(configured)).isFile()) {
				return configured;
			}
		} catch {
			/* fall through to the error below */
		}
		void vscode.window.showErrorMessage(
			`chunt.path is set but is not a file: ${configured}`,
		);
		return null;
	}

	// Windows binaries are bundled (and spawned) as chunt.exe; every other
	// platform uses the extension-less name.
	const bundled = path.join(
		context.extensionPath,
		"bin",
		process.platform === "win32" ? "chunt.exe" : "chunt",
	);
	try {
		if ((await fs.stat(bundled)).isFile()) {
			return bundled;
		}
	} catch {
		/* not bundled */
	}

	void vscode.window.showErrorMessage(
		"No chunt binary found. This extension is published per-platform " +
			"(darwin-x64/arm64, linux-x64/arm64, win32-x64/arm64); make sure you " +
			"installed the build matching your OS, or set chunt.path to a chunt " +
			"binary.",
	);
	return null;
}

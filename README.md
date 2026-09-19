# vscode-chunt

[Visual Studio Code](https://code.visualstudio.com/) extension for [chunt](https://github.com/dgethings/chunt), the language server for **Cisco IOS configuration templates with Jinja2** (`.ios.j2` files).

This is a **thin wrapper**: it registers the `cisco_ios_jinja2` language, contributes a TextMate grammar, and launches the bundled `chunt` binary (`chunt serve --log-level <level>`) as an LSP server over stdio. All intelligence — diagnostics, hover, completion, go-to-definition, references, outlines — lives in chunt.

## Features

| LSP method | What you get |
| --- | --- |
| Diagnostics | Squiggles for parse errors, version mismatches, undefined references, duplicate definitions. |
| Hover | IOS command documentation from chunt's built-in command database. |
| Completion | Section-aware keyword completion (`config` vs `config-if` vs `config-router` vs `config-line`). |
| Go to Definition / Find References | Route-maps, ACLs, class-maps, policy-maps, VLANs, interfaces. |
| Outline | Document symbols for every section header. |
| Syntax highlighting | TextMate grammar ported from the [tree-sitter-cisco-ios-jinja2](https://github.com/dgethings/tree-sitter-cisco-ios-jinja2) highlight queries. |

## Install

Published to the [VS Code Marketplace](https://marketplace.visualstudio.com/) and [Open VSX](https://open-vsx.org/) as **platform-specific builds** — the registry serves the right one for your OS automatically:

| Platform | Build |
| --- | --- |
| macOS (Apple Silicon) | `darwin-arm64` |
| macOS (Intel) | `darwin-x64` |
| Linux (ARM64) | `linux-arm64` |
| Linux (x86-64) | `linux-x64` |
| Windows (ARM64) | `win32-arm64` |
| Windows (x86-64) | `win32-x64` |

The chunt server binary is **bundled inside the VSIX** — no download happens at runtime, and the server version always matches the extension release that was tested against it.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `chunt.path` | `""` | Use a specific chunt binary instead of the bundled one (e.g. a local build for server development). |
| `chunt.logLevel` | `"info"` | Server log level (`debug`, `info`, `warn`, `error`). Output appears in the **chunt** output channel. |

## Development

```bash
npm install
npm run compile        # webpack build to dist/
# optional: bundle a released server binary for local testing
npm run fetch-chunt    # CHUNT_VERSION=v0.14.1 by default
```

Then press **F5** in VS Code to launch an Extension Development Host, and open any `*.ios.j2` file.

To run against your own chunt build:

```bash
cd ../chunt/main && make     # builds bin/chunt
```

then set `chunt.path` to that binary (or leave `bin/` empty and rely on the setting).

Package locally:

```bash
npx @vscode/vsce package --no-dependencies --target darwin-arm64 -o chunt.vsix
code --install-extension chunt.vsix
```

### Release process

1. Bump `version` in `package.json`, update `CHANGELOG.md`.
2. Bump `CHUNT_VERSION` in `scripts/fetch-chunt.sh` **and** `.github/workflows/publish.yml` to the chunt release to bundle.
3. Tag `vX.Y.Z` and push — the [publish workflow](.github/workflows/publish.yml) fetches the pinned chunt binaries (checksum-verified), builds the six platform VSIXs, and publishes to Marketplace + Open VSX.

### Relationship to chunt

This repo is part of the [nos-lsp](https://github.com/dgethings) workspace: `chunt` (Go LSP server), `tree-sitter-cisco-ios-jinja2` (grammar), `cisco-ios-scraper` (command database pipeline), and this editor integration. The pattern follows [helm-ls](https://github.com/mrjosh/helm-ls) / [helm-ls-vscode](https://github.com/qvalentin/helm-ls-vscode): server and extension are separately versioned, coupled only at release time.

## License

[MIT](LICENSE)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.4] - 2026-10-31

### Added

- Extension icon: four network nodes in a square, fully linked, framed by Jinja2 braces.

## [0.1.3]

- (no changelog entry; release-only)

## [0.1.2] - 2026-10-30

### Fixed

- CI: Open VSX publish passed all six VSIXs as positional arguments, but `ovsx publish` accepts a single extension — publish via `--packagePath` instead.

## [0.1.1] - 2026-10-29

### Changed

- CI now publishes to the VS Code Marketplace and Open VSX via Trusted Publishing (OIDC); no access-token secrets are stored.

## [0.1.0] - 2026-09-27

### Added

- Initial release: thin LSP wrapper around `chunt serve` over stdio.
- `cisco_ios_jinja2` language registration for `*.ios.j2` files.
- TextMate grammar ported from the tree-sitter-cisco-ios-jinja2 highlight queries.
- `chunt.path` and `chunt.logLevel` settings.
- Platform-specific VSIX builds (`darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`) bundling the pinned chunt release binary (v0.15.0), assembled in CI with checksum verification.

[Unreleased]: https://github.com/dgethings/vscode-chunt/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/dgethings/vscode-chunt/compare/v0.1.3...v0.1.4
[0.1.2]: https://github.com/dgethings/vscode-chunt/releases/tag/v0.1.2
[0.1.1]: https://github.com/dgethings/vscode-chunt/releases/tag/v0.1.1
[0.1.0]: https://github.com/dgethings/vscode-chunt/releases/tag/v0.1.0

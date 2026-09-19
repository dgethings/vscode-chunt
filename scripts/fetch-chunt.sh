#!/usr/bin/env bash
# Fetch a chunt release binary for the current platform into bin/chunt
# (bin/chunt.exe on Windows).
#
# Used by CI to build platform VSIXs, and by developers who want to run the
# extension against a released server (npm run fetch-chunt) without building
# chunt locally.
#
# The bundled binary is NOT committed (bin/ is gitignored): platform VSIXs are
# assembled at package time.
#
# Keep CHUNT_VERSION in sync with .github/workflows/publish.yml.
set -euo pipefail

CHUNT_VERSION="${CHUNT_VERSION:-v0.15.0}"
CHUNT_REPO="${CHUNT_REPO:-dgethings/chunt}"

# Map this machine onto goreleaser's os/arch naming.
case "$(uname -s)" in
  Darwin)                GOOS=darwin ;;
  Linux)                 GOOS=linux ;;
  MINGW*|MSYS*|CYGWIN*)  GOOS=windows ;;
  *) echo "unsupported OS: $(uname -s) (chunt builds darwin/linux/windows only)" >&2; exit 1 ;;
esac
case "$(uname -m)" in
  arm64|aarch64) GOARCH=arm64 ;;
  x86_64|amd64)  GOARCH=amd64 ;;
  *) echo "unsupported arch: $(uname -m)" >&2; exit 1 ;;
esac

VER="${CHUNT_VERSION#v}"  # release assets strip the leading 'v'
EXT=""
if [ "${GOOS}" = windows ]; then EXT=".exe"; fi  # goreleaser suffixes windows binaries
ASSET="chunt_${VER}_${GOOS}_${GOARCH}${EXT}"
CHECKSUMS="chunt_${VER}_checksums.txt"
BASE="https://github.com/${CHUNT_REPO}/releases/download/${CHUNT_VERSION}"

# The extension resolves bin/chunt on darwin/linux and bin/chunt.exe on
# windows (src/util/executable.ts); keep the destination name in sync.
DEST="${1:-bin/chunt${EXT}}"

mkdir -p "$(dirname "$DEST")"
echo "Fetching ${ASSET} from ${CHUNT_VERSION}..."
curl -fsSL -o "$DEST"        "${BASE}/${ASSET}"
curl -fsSL -o /tmp/chunt-checksums.txt "${BASE}/${CHECKSUMS}"

expected="$(grep " ${ASSET}\$" /tmp/chunt-checksums.txt | awk '{print $1}')"
if [ -z "$expected" ]; then
  echo "no checksum entry for ${ASSET}" >&2; exit 1
fi
# shasum ships with macOS; sha256sum with git-bash/MSYS2 on Windows.
if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "$DEST" | awk '{print $1}')"
else
  actual="$(shasum -a 256 "$DEST" | awk '{print $1}')"
fi
if [ "$expected" != "$actual" ]; then
  echo "checksum mismatch for $DEST" >&2; exit 1
fi

chmod +x "$DEST"
echo "OK: $DEST (${CHUNT_VERSION}, sha256 verified)"

#!/usr/bin/env bash
set -Eeuo pipefail

REPO_DEFAULT="lgkangno1-svg/Kang-s-brain"
LABELS_DEFAULT="minipc,video,ffmpeg"
RUNNER_ROOT_DEFAULT="/opt/github-runners"
NODE_MAJOR_REQUIRED=22

REPO="$REPO_DEFAULT"
LABELS="$LABELS_DEFAULT"
RUNNER_ROOT="$RUNNER_ROOT_DEFAULT"
REG_TOKEN="${RUNNER_REGISTRATION_TOKEN:-}"
RUNNER_NAME=""
SKIP_PACKAGES=0

usage() {
  cat <<USAGE
Usage: $0 [options]

Options:
  --repo OWNER/REPO       GitHub repository (default: $REPO_DEFAULT)
  --token TOKEN           One-hour GitHub runner registration token
  --name NAME             Runner name (default: <hostname>-shopping-shorts)
  --labels CSV            Extra labels (default: $LABELS_DEFAULT)
  --runner-root PATH      Runner install root (default: $RUNNER_ROOT_DEFAULT)
  --skip-packages         Do not apt-install prerequisites/Node/FFmpeg
  -h, --help              Show this help

Security:
  Prefer omitting --token so the token is entered with hidden terminal input.
  The token is never written to repository files by this script.
USAGE
}

while (($#)); do
  case "$1" in
    --repo) REPO="${2:?missing value for --repo}"; shift 2 ;;
    --token) REG_TOKEN="${2:?missing value for --token}"; shift 2 ;;
    --name) RUNNER_NAME="${2:?missing value for --name}"; shift 2 ;;
    --labels) LABELS="${2:?missing value for --labels}"; shift 2 ;;
    --runner-root) RUNNER_ROOT="${2:?missing value for --runner-root}"; shift 2 ;;
    --skip-packages) SKIP_PACKAGES=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ "$REPO" != */* ]]; then
  echo "--repo must be OWNER/REPO, got: $REPO" >&2
  exit 2
fi

if [[ ${EUID:-$(id -u)} -eq 0 ]]; then
  echo "Run this script as your normal Mini PC user, not root. It uses sudo only where needed." >&2
  exit 2
fi

for cmd in curl tar python3; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Missing prerequisite: $cmd" >&2
    echo "Run: sudo apt-get update && sudo apt-get install -y curl tar python3 ca-certificates" >&2
    exit 2
  }
done

if [[ $SKIP_PACKAGES -eq 0 ]]; then
  sudo apt-get update
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates curl git ffmpeg python3 tar gzip libicu-dev
fi

node_major=0
if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "Number(process.versions.node.split('.')[0])" 2>/dev/null || echo 0)"
fi
if (( node_major < NODE_MAJOR_REQUIRED )); then
  if [[ $SKIP_PACKAGES -eq 1 ]]; then
    echo "Node.js $NODE_MAJOR_REQUIRED+ is required; current major: $node_major" >&2
    exit 2
  fi
  echo "Installing Node.js ${NODE_MAJOR_REQUIRED}.x system-wide via NodeSource..."
  tmp_setup="$(mktemp)"
  trap 'rm -f "$tmp_setup"' EXIT
  curl -fsSL --retry 3 "https://deb.nodesource.com/setup_${NODE_MAJOR_REQUIRED}.x" -o "$tmp_setup"
  sudo -E bash "$tmp_setup"
  rm -f "$tmp_setup"
  trap - EXIT
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
fi

command -v node >/dev/null || { echo "node missing after setup" >&2; exit 1; }
command -v npm >/dev/null || { echo "npm missing after setup" >&2; exit 1; }
command -v ffmpeg >/dev/null || { echo "ffmpeg missing after setup" >&2; exit 1; }
command -v ffprobe >/dev/null || { echo "ffprobe missing after setup" >&2; exit 1; }

node_major="$(node -p "Number(process.versions.node.split('.')[0])")"
if (( node_major < NODE_MAJOR_REQUIRED )); then
  echo "Node.js $NODE_MAJOR_REQUIRED+ required, got $(node --version)" >&2
  exit 1
fi

arch_raw="$(uname -m)"
case "$arch_raw" in
  x86_64|amd64) runner_arch="x64" ;;
  aarch64|arm64) runner_arch="arm64" ;;
  *) echo "Unsupported architecture: $arch_raw" >&2; exit 2 ;;
esac

repo_slug="${REPO//\//__}"
runner_dir="$RUNNER_ROOT/$repo_slug"
RUNNER_NAME="${RUNNER_NAME:-$(hostname)-shopping-shorts}"

release_json="$(curl -fsSL --retry 3 https://api.github.com/repos/actions/runner/releases/latest)"
runner_version="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["tag_name"].lstrip("v"))' <<<"$release_json")"
if [[ -z "$runner_version" ]]; then
  echo "Unable to determine latest GitHub Actions runner version" >&2
  exit 1
fi

asset="actions-runner-linux-${runner_arch}-${runner_version}.tar.gz"
asset_url="https://github.com/actions/runner/releases/download/v${runner_version}/${asset}"

if [[ -z "$REG_TOKEN" ]]; then
  echo
  echo "GitHub에서 다음 위치의 registration token을 복사하세요:"
  echo "  https://github.com/${REPO}/settings/actions/runners/new"
  echo "토큰은 보통 약 1시간 동안 유효합니다."
  read -r -s -p "Runner registration token: " REG_TOKEN
  echo
fi
if [[ -z "$REG_TOKEN" ]]; then
  echo "Registration token is required." >&2
  exit 2
fi

sudo mkdir -p "$runner_dir"
sudo chown -R "$USER":"$(id -gn)" "$runner_dir"
cd "$runner_dir"

if [[ -f .runner && -x ./config.sh ]]; then
  echo "Runner is already configured in $runner_dir."
  echo "Keeping the existing registration to avoid creating an orphaned GitHub runner."
  if [[ -x ./svc.sh ]]; then sudo ./svc.sh status || true; fi
  echo "Use tools/minipc-runner/remove.sh with a fresh removal token before reinstalling."
  exit 0
fi

find "$runner_dir" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +

tmp_archive="$(mktemp --suffix=.tar.gz)"
trap 'rm -f "$tmp_archive"' EXIT
curl -fL --retry 3 --retry-delay 2 "$asset_url" -o "$tmp_archive"
tar -xzf "$tmp_archive" -C "$runner_dir"
rm -f "$tmp_archive"
trap - EXIT

./config.sh \
  --url "https://github.com/$REPO" \
  --token "$REG_TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "$LABELS" \
  --work "_work" \
  --unattended \
  --replace

sudo ./svc.sh install "$USER"
sudo ./svc.sh start
sleep 2
sudo ./svc.sh status

echo
echo "Mini PC runner setup complete."
echo "Repository : $REPO"
echo "Runner     : $RUNNER_NAME"
echo "Directory  : $runner_dir"
echo "Labels     : self-hosted, linux, $runner_arch, $LABELS"
echo "Node       : $(node --version)"
echo "FFmpeg     : $(ffmpeg -version | head -n 1)"
echo
echo "Next: open GitHub -> Settings -> Actions -> Runners and confirm this runner is Idle/Online."

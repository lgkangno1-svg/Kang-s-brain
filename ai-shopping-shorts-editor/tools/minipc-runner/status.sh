#!/usr/bin/env bash
set -Eeuo pipefail
REPO="${1:-lgkangno1-svg/Kang-s-brain}"
RUNNER_ROOT="${RUNNER_ROOT:-/opt/github-runners}"
runner_dir="$RUNNER_ROOT/${REPO//\//__}"

if [[ ! -d "$runner_dir" || ! -x "$runner_dir/svc.sh" ]]; then
  echo "Runner not installed at $runner_dir" >&2
  exit 1
fi

cd "$runner_dir"
echo "== GitHub runner service =="
sudo ./svc.sh status

echo
echo "== Toolchain =="
node --version
npm --version
ffmpeg -version | head -n 1
ffprobe -version | head -n 1

echo
echo "== Disk =="
df -h "$runner_dir" | tail -n 1

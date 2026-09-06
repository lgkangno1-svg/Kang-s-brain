#!/usr/bin/env bash
set -Eeuo pipefail
REPO="${1:-lgkangno1-svg/Kang-s-brain}"
RUNNER_ROOT="${RUNNER_ROOT:-/opt/github-runners}"
runner_dir="$RUNNER_ROOT/${REPO//\//__}"

if [[ ! -d "$runner_dir" || ! -x "$runner_dir/config.sh" ]]; then
  echo "Runner not installed at $runner_dir" >&2
  exit 1
fi

cat <<EOF
To remove this runner safely, GitHub requires a fresh removal token.
Open:
  https://github.com/${REPO}/settings/actions/runners
Select this Mini PC runner -> Remove, then copy the token from GitHub's removal command.
EOF
read -r -s -p "Fresh removal token: " TOKEN
echo
[[ -n "$TOKEN" ]] || { echo "Token required" >&2; exit 2; }

cd "$runner_dir"
if [[ -x ./svc.sh ]]; then
  sudo ./svc.sh stop || true
  sudo ./svc.sh uninstall || true
fi
./config.sh remove --token "$TOKEN"
echo "Runner registration removed. Files remain at $runner_dir for inspection/reinstall."

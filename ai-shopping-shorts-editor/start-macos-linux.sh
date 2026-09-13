#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
command -v node >/dev/null || { echo "Node.js 20+ is required."; exit 1; }
command -v ffmpeg >/dev/null || { echo "FFmpeg is required."; exit 1; }
command -v ffprobe >/dev/null || { echo "FFprobe is required."; exit 1; }
( sleep 1; (command -v open >/dev/null && open http://127.0.0.1:4317) || (command -v xdg-open >/dev/null && xdg-open http://127.0.0.1:4317) || true ) &
node src/server.mjs

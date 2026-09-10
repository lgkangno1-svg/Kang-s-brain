#!/usr/bin/env bash
set -euo pipefail

ORIGIN="${QA_ORIGIN:-http://127.0.0.1:4173}"
SESSION="${QA_SESSION:-korea-functional-qa}"
ARTIFACT_DIR="${QA_ARTIFACT_DIR:-artifacts/agent-browser}"
MODE="${QA_MODE:-local}"
mkdir -p "$ARTIFACT_DIR"

ab(){ agent-browser --session "$SESSION" "$@"; }
cleanup(){ ab close >/dev/null 2>&1 || true; }
trap cleanup EXIT
pass(){ printf 'AGENT_BROWSER_QA|PASS|%s|%s\n' "$MODE" "$*"; }
fail(){ printf 'AGENT_BROWSER_QA|FAIL|%s|%s\n' "$MODE" "$*" >&2; exit 1; }
body(){ ab get text body 2>/dev/null || ab eval 'document.body.innerText'; }
expect_text(){
  local needle="$1" label="$2" text
  text="$(body)"
  grep -Fq "$needle" <<<"$text" || fail "$label: missing text [$needle]"
  pass "$label"
}
open_page(){
  local path="$1"
  ab open "${ORIGIN}${path}" >/dev/null
  ab wait --load networkidle >/dev/null 2>&1 || ab wait 1200 >/dev/null
  ab snapshot -i >/dev/null
}
assert_no_horizontal_scroll(){
  local label="$1" result
  result="$(ab eval 'document.documentElement.scrollWidth <= window.innerWidth')"
  grep -Fq 'true' <<<"$result" || fail "$label: horizontal overflow"
  pass "$label no-horizontal-scroll"
}

# Home: navigation and free product surface.
ab set viewport 1440 900 >/dev/null
open_page /en
expect_text 'Korea' 'home loads'
ab screenshot "$ARTIFACT_DIR/${MODE}-home-desktop.png" >/dev/null

# Saju: fill real inputs and require a generated deterministic result.
open_page /en/culture/saju
ab find label 'Birth date' fill '1990-05-15' >/dev/null
ab find label 'Birthplace timezone' fill 'Asia/Seoul' >/dev/null
ab snapshot -i >/dev/null
ab find role button click --name 'Read my Saju' >/dev/null
ab wait --text 'Your Saju reading' >/dev/null
expect_text 'Five-year practical outlook' 'Saju generates five-year reading'
expect_text 'Work / direction' 'Saju renders practical domain reading'
ab screenshot "$ARTIFACT_DIR/${MODE}-saju-result.png" --full >/dev/null

# Naming Studio: generated candidates must be visible, not only a static page.
open_page /en/culture/naming
ab find role button click --name 'Create name ideas' >/dev/null
ab wait --text 'Your name ideas' >/dev/null
expect_text 'Pronunciation' 'Naming generates candidate details'
expect_text 'My shortlist' 'Naming exposes shortlist workflow'
ab screenshot "$ARTIFACT_DIR/${MODE}-naming-result.png" --full >/dev/null

# Palace: official cutoff helper and route builder must both work.
open_page /en/explore/gyeongbokgung
expect_text 'Last admission' 'Palace official admission cutoff visible'
# First date input belongs to the official visit helper; second belongs to route planner.
ab find nth 1 'input[type="date"]' fill '2026-09-10' >/dev/null
ab find nth 1 'input[type="time"]' fill '10:00' >/dev/null 2>&1 || true
ab find role button click --name 'Build route' >/dev/null
ab wait --text 'Your timed route' >/dev/null
expect_text 'Your timed route' 'Palace route generates'
ab screenshot "$ARTIFACT_DIR/${MODE}-palace-route.png" --full >/dev/null

# My Korea Look: require live ranked output and test that an input can change.
open_page /en/style
expect_text 'Your free 3-look plan' 'My Korea Look renders ranked plan'
expect_text 'Korean rental request' 'My Korea Look includes field-use rental card'
ab find label 'Trip priority' select 'Walking comfort' >/dev/null
ab snapshot -i >/dev/null
expect_text 'Practical trade-off' 'My Korea Look updates after preference change'
ab screenshot "$ARTIFACT_DIR/${MODE}-style-plan.png" --full >/dev/null

# Hanbok / Food / Nearby smoke checks.
open_page /en/hanbok
expect_text 'Hanbok' 'Hanbok experience loads'
open_page /en/explore/food
expect_text 'food' 'Food finder loads'
open_page /en/explore/nearby
expect_text 'route' 'Nearby route experience loads'

# Mobile core-surface overflow and interaction smoke.
ab set viewport 390 844 >/dev/null
open_page /en
assert_no_horizontal_scroll 'mobile home'
ab screenshot "$ARTIFACT_DIR/${MODE}-home-mobile.png" --full >/dev/null
open_page /en/style
assert_no_horizontal_scroll 'mobile My Korea Look'
expect_text 'Your free 3-look plan' 'mobile My Korea Look remains usable'
ab screenshot "$ARTIFACT_DIR/${MODE}-style-mobile.png" --full >/dev/null

pass 'core functional browser journey complete'

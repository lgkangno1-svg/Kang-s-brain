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
step(){ printf 'AGENT_BROWSER_QA|STEP|%s|%s\n' "$MODE" "$*"; }
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
  step "open ${path}"
  ab open "${ORIGIN}${path}" >/dev/null
  # Fixed settle time is more reliable than network-idle because public image sources can stay busy.
  ab wait 900 >/dev/null
  ab snapshot -i >/dev/null
}
assert_no_horizontal_scroll(){
  local label="$1" result
  result="$(ab eval 'document.documentElement.scrollWidth <= window.innerWidth')"
  grep -Fq 'true' <<<"$result" || fail "$label: horizontal overflow"
  pass "$label no-horizontal-scroll"
}

ab set viewport 1440 900 >/dev/null
open_page /en
expect_text 'Korea' 'home loads'
ab screenshot "$ARTIFACT_DIR/${MODE}-home-desktop.png" >/dev/null

open_page /en/culture/saju
step 'Saju fill birth date'
ab find label 'Birth date' fill '1990-05-15' >/dev/null
step 'Saju fill birthplace timezone'
ab find label 'Birthplace timezone' fill 'Asia/Seoul' >/dev/null
step 'Saju submit'
ab find role button click --name 'Read my Saju' >/dev/null
ab wait 700 >/dev/null
expect_text 'Your Saju reading' 'Saju result appears'
expect_text 'Five-year practical outlook' 'Saju generates five-year reading'
expect_text 'Work / direction' 'Saju renders practical domain reading'
ab screenshot "$ARTIFACT_DIR/${MODE}-saju-result.png" --full >/dev/null

open_page /en/culture/naming
step 'Naming generate'
ab find role button click --name 'Create name ideas' >/dev/null
ab wait 500 >/dev/null
expect_text 'Your name ideas' 'Naming generates results'
expect_text 'Pronunciation' 'Naming generates candidate details'
expect_text 'My shortlist' 'Naming exposes shortlist workflow'
ab screenshot "$ARTIFACT_DIR/${MODE}-naming-result.png" --full >/dev/null

open_page /en/explore/gyeongbokgung
expect_text 'Last admission' 'Palace official admission cutoff visible'
step 'Palace set route date/time'
ab find nth 1 'input[type="date"]' fill '2026-09-10' >/dev/null
ab find first 'input[type="time"]' fill '10:00' >/dev/null
step 'Palace build route'
ab find role button click --name 'Build route' >/dev/null
ab wait 500 >/dev/null
expect_text 'Your timed route' 'Palace route generates'
ab screenshot "$ARTIFACT_DIR/${MODE}-palace-route.png" --full >/dev/null

open_page /en/style
expect_text 'Your 3-look plan' 'My Korea Look renders ranked plan'
expect_text 'Korean rental request' 'My Korea Look includes field-use rental card'
step 'My Korea Look change comfort preference'
ab find label 'Comfort' select 'Walking first' >/dev/null
ab wait 350 >/dev/null
expect_text 'Trade-off' 'My Korea Look updates after preference change'
ab screenshot "$ARTIFACT_DIR/${MODE}-style-plan.png" --full >/dev/null

open_page /en/hanbok
expect_text 'Hanbok' 'Hanbok experience loads'
open_page /en/explore/food
expect_text 'Food & café finder' 'Food finder loads'
open_page /en/explore/nearby
expect_text 'Your nearby route' 'Nearby route experience loads'

ab set viewport 390 844 >/dev/null
open_page /en
assert_no_horizontal_scroll 'mobile home'
ab screenshot "$ARTIFACT_DIR/${MODE}-home-mobile.png" --full >/dev/null
open_page /en/style
assert_no_horizontal_scroll 'mobile My Korea Look'
expect_text 'Your 3-look plan' 'mobile My Korea Look remains usable'
ab screenshot "$ARTIFACT_DIR/${MODE}-style-mobile.png" --full >/dev/null

pass 'core functional browser journey complete'

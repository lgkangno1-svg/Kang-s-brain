# Mini PC self-hosted GitHub Actions runner

이 프로젝트의 CI/FFmpeg E2E 검증을 GitHub-hosted runner가 아니라 집의 Ubuntu Mini PC에서 실행하는 운영 방법이다.

## 목표

- GitHub-hosted Actions minutes에 의존하지 않는다.
- Node.js 22+, FFmpeg, FFprobe가 설치된 실제 Linux 환경에서 검증한다.
- `npm run check` 뒤에 `npm run demo`까지 실행해 synthetic 9:16 FFmpeg E2E를 확인한다.
- runner는 repo 전용 디렉터리 `/opt/github-runners/lgkangno1-svg__Kang-s-brain`에 격리한다.
- extra labels: `minipc,video,ffmpeg`.

## 사용자가 한 번 해야 하는 일

1. Mini PC에 SSH 접속한다.
2. 이 branch/repository를 clone 또는 pull한다.
3. GitHub에서 이 repository의 runner registration token을 하나 만든다.
   - Repository -> Settings -> Actions -> Runners -> New self-hosted runner
   - Linux / x64 선택
   - 화면의 짧은 registration token만 복사한다. 토큰은 만료되므로 저장하거나 commit하지 않는다.
4. 아래 installer를 일반 사용자 계정으로 실행한다. `sudo bash`로 실행하지 않는다.

```bash
cd ~/Kang-s-brain/ai-shopping-shorts-editor
chmod +x tools/minipc-runner/*.sh
./tools/minipc-runner/bootstrap.sh
```

설치 도중 token 입력창이 나타나면 방금 복사한 token을 붙여넣는다. 입력은 화면에 표시되지 않는다.

installer가 자동으로 하는 일:

- Ubuntu prerequisites 설치
- FFmpeg/FFprobe 설치/확인
- Node.js 22+ 설치/확인
- GitHub Actions runner 최신 release 조회 및 다운로드
- repo runner 등록
- `minipc,video,ffmpeg` label 추가
- systemd service 설치 및 시작
- 최종 service/toolchain 상태 출력

## 설치 완료 확인

```bash
./tools/minipc-runner/status.sh
```

GitHub 웹에서도 Repository -> Settings -> Actions -> Runners에서 runner가 `Idle` 또는 실행 중이면 된다.

## Workflow

`.github/workflows/ai-shopping-shorts-editor.yml`은 다음 runner만 사용한다.

```yaml
runs-on: [self-hosted, linux, x64, minipc]
```

실행 순서:

1. checkout
2. Node/npm/FFmpeg/FFprobe preflight
3. `npm run check`
4. `npm run demo`

`concurrency.cancel-in-progress`가 켜져 있어 Loop Engineering 중 여러 commit이 빠르게 쌓이면 오래된 동일 ref 작업을 취소하고 최신 작업을 우선한다.

## Mini PC가 꺼져 있을 때

코드 push/commit은 정상적으로 계속 가능하다. self-hosted job은 runner가 온라인이 될 때까지 queued 상태가 될 수 있다. 자동 개선 작업은 Actions 결과가 없다는 이유만으로 patch/commit을 중단하지 않는다.

## 제거/재등록

GitHub에서 runner 제거 화면을 열고 fresh removal token을 받은 뒤:

```bash
./tools/minipc-runner/remove.sh
```

그 후 다시 `bootstrap.sh`를 실행한다. 기존 registration을 임의로 지워 GitHub에 orphan runner를 남기지 않는다.

## 보안 원칙

- OpenCode Go API key, GitHub PAT, runner token을 repository에 저장하지 않는다.
- public repository runner에서 신뢰하지 않는 임의 PR 코드를 자동 실행하지 않는다. 이 repo는 개인 개발용이므로 외부 contribution을 받을 경우 self-hosted workflow trigger 정책을 별도로 제한해야 한다.
- Mini PC runner user에게 불필요한 root 상시 권한을 주지 않는다. system package/service 단계만 `sudo`를 사용한다.
- 원본 상품 영상이나 사용자 프로젝트 workspace를 Git repository 또는 Actions artifact로 업로드하지 않는다.

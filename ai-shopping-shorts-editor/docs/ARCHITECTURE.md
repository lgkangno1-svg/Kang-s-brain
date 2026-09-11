# Architecture

```text
Browser UI
  -> local Node HTTP server
    -> streaming uploads
    -> FFprobe metadata
    -> FFmpeg scene scoring
    -> normalized 1~5s semantic segment candidates
    -> representative JPEG cache
      -> OpenCode Go Vision metadata
    -> Script/SRT/TTS Beat builder
      -> OpenCode Go text Edit Director
    -> repaired + validated EDL
      -> optional Vision Judge
    -> FFmpeg deterministic renderer
    -> QA JSON + MP4
```

## Why no heavy Python semantic pipeline
Python itself is not considered a quality problem, but the product requirement is to avoid relying on local classical CV as the semantic understanding layer. Semantic scene understanding is delegated to a multimodal model. Node/FFmpeg remain the deterministic media engine.

## Model integration
Default:
- Vision: `deepseek-v4-flash-vision-exp`
- Planner: `deepseek-v4-flash`
- Endpoint: OpenCode Go OpenAI-compatible chat completions

Model IDs are configuration, not editing logic. A future adapter may swap models without changing EDL/rendering.

## Cache
Each source gets SHA-256. Vision cache fingerprint includes:
- source hashes
- vision model
- analysis width
- scene threshold
- segment settings

This prevents stale AI metadata from being reused after a source is replaced.

## EDL
Every output clip stores:
- beatId / narration text
- programStart/programEnd
- sourceId / sourcePath
- segmentId
- sourceStart/sourceEnd
- score/reason
- alternatives

Rendering never consumes free-form AI prose; only validated EDL data.

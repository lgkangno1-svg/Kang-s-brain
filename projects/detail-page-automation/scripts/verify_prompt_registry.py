#!/usr/bin/env python3
from __future__ import annotations

from prompt_registry import PROMPTS, resolve_prompt, sha256_file


def main() -> None:
    for prompt_id, spec in PROMPTS.items():
        path = resolve_prompt(prompt_id, require_owner_version=True)
        print(f"OK {prompt_id} {sha256_file(path)} {path.name}")


if __name__ == "__main__":
    main()

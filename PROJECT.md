# PROJECT.md — This repository

> Fill this file for **this** project. Agents treat it as ground truth.  
> Examples: `kits/local-ai-dropin/examples/PROJECT.web.example.md` and `PROJECT.unreal.example.md` (or bundle `examples/` after unzip).

## Fingerprint completeness (required before serious agent work)

- [ ] Identity filled (name, pillar, goal)
- [ ] Stack or Unreal fingerprint filled (no `_` placeholders in active sections)
- [ ] Verify commands filled and tested once by a human
- [ ] Human-only gates checked
- [ ] Bridge flags set honestly (`no` unless tools really exist)

## Identity

| Field | Value |
|-------|-------|
| Name | AICheatCheets |
| Pillar | `hybrid` |
| One-line goal | _(what we are building)_ |
| Primary language(s) | _(e.g. TypeScript, C++ UE5.4)_ |

## Stack

### Web (delete if unused)

- Framework: _(Next / Laravel / ASP.NET / …)_
- Package manager: _(npm / pnpm / composer / …)_
- Node / runtime version: _
- DB: _
- Important env files: _(names only — never paste secrets)_

### Game / Unreal fingerprint (delete section if unused)

> Agents: treat this block as **law**. Do not invent folders, parents, or plugins not listed here.

| Field | Value |
|-------|-------|
| Engine version | _(e.g. UE 5.4)_ |
| `.uproject` path | _(e.g. `MyGame.uproject`)_ |
| Target platform(s) | _(Win64, …)_ |
| Build config default | _(Development Editor / Shipping)_ |
| Compile style | _(Live Coding / full UBT / both)_ |
| Code modules | _(e.g. `MyGame`, `MyGameEditor`)_ |
| Enabled plugins (important) | _(Enhanced Input, CommonUI, Chaos, GAS, …)_ |
| Framework anchors | GameMode: _ / PlayerController: _ / ASC: _ _(paths or N/A)_ |
| Default map / Editor startup map | _ |
| Content roots | `/Game/Characters` _ · `/Game/FX` _ · `/Game/UI` _ · `/Game/Mats` _ · _(add)_ |
| Naming | Epic-style `A`/`U`/`F` / BP_ / M_ / NS_ / _(project rules)_ |
| Perf budgets | GPU ms: _ · Niagara particles: _ · draw calls: _ |
| Live Unreal bridge? | `no` / `partial` / `yes` — if yes/partial, how: _ |
| DCC bridge (Blender/etc.)? | `no` / `yes` — if yes, how: _ |
| Mutation policy | `read_only` / `lift_per_task` / `agent_may_edit` |
| MCP URL | _(http://127.0.0.1:8000/mcp or N/A)_ |
| Preferred non-synced path | _(optional)_ |

**Verify commands (fill exact cmdlines used on this machine):**

```text
# C++ compile / Live Coding
_

# Editor / Automation (optional)
_

# Cook
_

# Package / BuildCookRun
_
```

**Human-only gates (Unreal):**

- [ ] PIE / visual / audio feel
- [ ] New architecture (GameMode, net, GAS)
- [ ] Shipping / cert package sign-off
- [ ] Art direction (materials, Niagara look)
- [ ] _(add more)_

## How to run / verify (web + general)

```text
# Dev
_

# Test / typecheck
_

# Build
_
```

## Layout (key paths)

| Path | Meaning |
|------|---------|
| `_` | `_` |
| `docs/agent/unreal/` | Unreal domain playbooks + recipes |

## Conventions

- Naming: _
- PR / commit style: _
- Branching: _

## Do not touch

- _

## Human validation required (all pillars)

- [ ] Production deploy
- [ ] Unreal visual / PIE feel
- [ ] Schema / architecture changes
- [ ] _(add more)_

## Local model notes

- Preferred Ollama model: `qwen3.5:9b-q8_0` (or whatever this PC uses)
- Fallback Ollama model: `qwen3.5:4b` (optional)
- max_retries per task: `3`
- Hardware guide: `docs/agent/HARDWARE_LOCAL.md`
- Long runs: `docs/agent/LONGEVITY.md`
- Extra project recipes: `docs/agent/`

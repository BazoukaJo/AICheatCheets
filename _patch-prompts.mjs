import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const templates = {
  1: `**Task:** Debug [C++/C#/TypeScript/JavaScript/Python] for [web app / game — specify].

**Code**
[paste code here]

**Symptom**
[error, crash, or wrong behavior]

**Environment (known facts)**
[OS, runtime, engine/framework, browser/platform — omit unknowns; you must flag gaps]

**Deliver in Markdown**
1. ## Diagnosis — root cause(s) with evidence from my text/code; label **confirmed** vs **hypothesis**.
2. ## Fix — minimal production-minded change (full snippets or patch-style).
3. ## Verify — concrete steps: tests, traces, profiler, repro.
4. ## Watchlist — regressions and similar failure modes.

Use deep domain checks only when they apply (e.g. render/physics/net vs async/DOM/API/state). No generic textbook lists.`,

  2: `**Task:** Explain [C++/C#/TypeScript/JavaScript/Python/HTML/CSS] at [beginner | intermediate | advanced] depth.

**Code**
[paste code]

**Optional context**
[purpose, engine/framework]

**Deliver in Markdown**
- ## TL;DR — observable behavior and contracts
- ## Flow — control/data path for the important cases (not line noise)
- ## Complexity — Big-O / hot paths where it matters
- ## Structure — patterns, boundaries, extension points actually in this code
- ## Diagram — Mermaid or ASCII only if it clarifies non-trivial structure
- ## Risks — edge cases, misuse, perf/security footguns
- ## Optional deeper dive — only if I chose advanced`,

  3: `**Task:** Add [feature description] to this codebase in [C++/C#/TypeScript/JavaScript/Python].

**Existing code / entry points**
[paste code or repo map summary]

**Constraints**
[framework/engine, style, deadlines, must-not-break behaviors, auth/privacy]

**Deliver**
1. ## Design — API boundaries, data model touchpoints, failure modes (brief).
2. ## Implementation — complete code organized as idiomatic for this stack.
3. ## Tests — focused unit/integration tests for the risky paths (quality over a coverage number).
4. ## Integration — how to wire, configure, and roll back.
5. ## Follow-ups — deferred polish explicitly listed.

Infer standard patterns (web vs game) from context; state assumptions.`,

  4: `**Task:** Generate production-grade [C++/C#/TypeScript/JavaScript/Python/HTML/CSS] for: [what to build].

**Stack & constraints**
[frameworks, hosting, perf, compliance, team conventions]

**Deliver**
- ## Layout — file/folder layout and responsibilities
- ## Code — complete implementation (types, validation, errors, logging hooks as appropriate)
- ## Runbook — env vars, install, run, test commands
- ## Tests — core paths + one failure-mode suite
- ## Deploy / ops — only what applies (Docker, CI snippet, health checks)

Skip boilerplate lectures; use defaults where I was silent and list them under ## Assumptions.`,

  5: `**Task:** Optimize [C++/C#/TypeScript/JavaScript/Python] for [target: e.g. 60 FPS, p95 latency, memory cap].

**Code**
[paste code]

**Current signal**
[profiler snapshot, metrics, or “unknown” — if unknown, propose the smallest measurement to run first]

**Deliver**
1. ## Bottleneck — what dominates (with reasoning tied to this code)
2. ## Change — optimized code + why it works
3. ## Metrics — before/after (or predicted + how to measure)
4. ## Trade-offs — readability, correctness, platform limits`,

  6: `**Task:** Refactor [C++/C#/TypeScript/JavaScript/Python] toward [testability | clarity | scalability | patterns: name].

**Code**
[paste code]

**Non-goals**
[what must not change externally, e.g. public API]

**Deliver**
1. ## Plan — incremental steps (safe ordering)
2. ## Result — refactored code
3. ## Rationale — only non-obvious design choices
4. ## Metrics — complexity/coupling notes if meaningful (lightweight table OK)
5. ## Tests — updates or new tests locking behavior

Apply SOLID/DRY/KISS only where they earn their keep; avoid pattern bingo.`,

  7: `**Task:** Add tests for [C++/C#/TypeScript/JavaScript/Python].

**Code under test**
[paste code]

**Stack**
[test runner / framework — or infer and say you inferred]

**Deliver**
- ## Strategy — what must not break; risk-ranked test list
- ## Code — tests grouped (unit vs integration); realistic mocks
- ## Data — factories/fixtures if non-trivial
- ## CI — minimal snippet or commands to run in pipeline
- ## Coverage gaps — honest list of what remains untested and why`,

  8: `**Task:** Clean up [C++/C#/TypeScript/JavaScript/Python/HTML/CSS] without changing behavior.

**Code**
[paste code]

**Style target**
[project standard, or “idiomatic for language X”]

**Deliver**
1. ## Cleaned code
2. ## Changelog — bullet list of substantive edits (not formatting-only noise)
3. ## Optional — suggested lint/format commands

Preserve behavior; call out any suspected semantic risk before editing.`,

  9: `**Task:** Document [C++/C#/TypeScript/JavaScript/Python] [codebase | module | API].

**Inputs**
[paste code, tree, or endpoint list]

**Audience**
[internal devs | OSS | game team | operators]

**Deliver (only what applies)**
- Inline / docstrings / XML docs for non-obvious surfaces
- README section(s): quickstart, config, troubleshooting
- OpenAPI or equivalent for HTTP APIs
- Architecture sketch (Mermaid) if boundaries are unclear
- Changelog-style **Breaking** callouts if relevant

Keep docs scannable; prefer examples over theory.`,

  10: `**Task:** Review [C++/C#/TypeScript/JavaScript/Python] [code | diff].

**Context**
[goal of change, risk tolerance, game vs web]

**Deliver in Markdown**
- ## Verdict — approve / request changes / reject (with why)
- ## Blockers — must fix before merge
- ## Should fix — important
- ## Nice to have
- ## Strengths
- ## Score — 1–10 with one-paragraph rubric

Prioritize security, correctness, concurrency, and perf where relevant; skip generic smell lectures unless tied to this diff.`,

  11: `**Task:** Prototype [app/game/feature] using [stack] to validate [hypothesis] fast.

**Deliver**
1. ## Scope — in/out for this slice (time-box honest)
2. ## Code — runnable skeleton
3. ## Run — commands
4. ## Demo script — what to click/try
5. ## Learnings — what this proves or falsifies
6. ## Next — highest-value follow-up experiments

Deliberately defer polish; list accepted shortcuts under ## Assumptions.`,

  12: `**Task:** Fix deployment/build/runtime in prod: [symptom].

**Evidence**
[logs, errors, versions, platform]

**Configs (paste redacted secrets)**
[Dockerfile, compose, K8s, CI YAML, .env names only, etc.]

**Deliver**
1. ## Root cause — evidence-linked
2. ## Fix — exact file edits or settings
3. ## Verify — rollout/health checks
4. ## Prevent — guardrails (CI check, canary, alerting)
5. ## Rollback

Cover game storefront/build pipelines or web infra as applicable; no platform essay.`,

  13: `**Task:** Fix runtime failure: [crash | leak | hang | etc.].

**Code**
[paste]

**Signals**
[stack trace, repro, profiler, “intermittent” notes]

**Environment**
[OS, runtime, engine, hardware if relevant]

**Deliver**
1. ## Diagnosis — memory lifecycle / concurrency / platform angle as needed
2. ## Fix — code + rationale
3. ## Repro test or minimal harness
4. ## Monitoring — what to watch next

Separate facts from guesses; propose the smallest next measurement when data is thin.`,

  14: `**Task:** Design and implement a [REST | GraphQL] API for [domain] in [runtime/framework].

**Requirements**
[auth model, SLAs, data stores, idempotency, rate limits, versioning]

**Deliver**
1. ## Resource model & error contract
2. ## Implementation — handlers, validation, authz hooks
3. ## OpenAPI / schema artifact
4. ## Tests — authz, validation, happy path, failure modes
5. ## Security notes — injection, SSRF, upload, secrets (only what applies)

Game-specific (leaderboards, saves, matchmaking) or web SaaS patterns only if relevant to my domain.`,

  15: `**Task:** Architect [system type] for [scale / constraints].

**Context**
[latency, consistency, budget, team size, compliance]

**Deliver in Markdown**
- ## C4-style overview — diagram (Mermaid) + narrative
- ## Components — responsibilities & interfaces
- ## Data — storage, caching, migration, consistency model
- ## Ops — deploy, observability, DR as applicable
- ## Trade-offs — explicit alternatives you rejected
- ## Cost / complexity — rough drivers (no fiction; mark estimates as estimates)`,

  16: `**Task:** Optimize game performance for [Unity C# | Unreal C++ | Godot | custom]: [target frame budget / platform].

**Code or scene description**
[paste]

**Deliver**
1. ## Profile plan — what to capture first
2. ## Findings — CPU vs GPU vs memory vs sync
3. ## Changes — concrete engine-level or code fixes
4. ## Validation — before/after metrics methodology
5. ## Quality presets — if applicable

Stay engine-specific; avoid generic rendering lecture.`,

  17: `**Task:** Implement game feature [name] in [engine/language].

**Design intent**
[mechanics, UX, multiplayer/single-player]

**Integration points**
[existing systems]

**Platform**
[PC/console/mobile]

**Deliver**
- ## Implementation — code
- ## Test / playtest checklist
- ## Perf impact — expected cost + how to measure
- ## Docs — short “how to extend” note`,

  18: `**Task:** Debug game issue: [symptom].

**Code**
[paste]

**Engine / platform**
[name + version]

**Repro**
[steps]

**Deliver**
- ## Root cause
- ## Fix
- ## Regression tests or editor checks
- ## Prevention — config or workflow guard

Tie checks to engine systems actually involved.`,

  19: `**Task:** Build [web app description] with [stack].

**Features & constraints**
[list]

**Deliver**
- ## Repo layout
- ## Implementation — frontend + backend as needed
- ## API contract summary
- ## Local dev & test commands
- ## Deploy notes
- ## Security review — short targeted list

Use modern defaults; declare assumptions.`,

  20: `**Task:** Port [C++/C#/TypeScript/JavaScript/Python] → [target language].

**Code**
[paste]

**Constraints**
[perf, std lib, async model, interop]

**Deliver**
1. ## Mapped idioms — only where non-obvious
2. ## Translated code
3. ## Tests — equivalence on critical behaviors
4. ## Migration notes — incremental path if large`,

  21: `**Task:** Profile [C++/C#/TypeScript/JavaScript/Python] for [CPU | GPU | memory | I/O] issues.

**Code**
[paste]

**Deliver**
1. ## Methodology — tool choice for this stack
2. ## Hotspots — ranked with evidence
3. ## Patch — targeted optimizations
4. ## Before/after measurement plan
5. ## Monitoring — lightweight ongoing signals`,

  22: `**Task:** CI/CD for [game | web] on [GitHub Actions | GitLab CI | Jenkins]: [platforms/environments].

**Repo reality**
[engines, monorepo?, secret names]

**Deliver**
- ## Pipeline YAML (complete)
- ## Caching / artifact strategy
- ## Test gates & deploy stages
- ## Secrets handling pattern (names only)
- ## Failure playbook

Skip vendor-generic filler; match my stack.`,

  23: `**Task:** Testing strategy for [project].

**Context**
[release cadence, risk areas, stack]

**Deliver**
1. ## Test pyramid — what runs where (unit/integration/e2e/perf)
2. ## Priority matrix — risk × effort
3. ## Tooling & data strategy
4. ## CI integration
5. ## Quality gates & flake policy
6. ## Maintenance — ownership and review cadence`,

  24: `**Task:** Security review of [game | web] [code | architecture description].

**Deliver in Markdown**
- ## Executive risk summary
- ## Findings table — severity | likelihood | impact | fix | retest
- ## Threat model — only the slices grounded in what I shared
- ## Hardening roadmap

Map to OWASP or engine-specific cheat classes when relevant; no vague fear lists.`,

  25: `**Task:** Technical debt assessment for: [codebase description or key paths].

**Deliver**
- ## Inventory table — item | symptom | impact | effort | suggested priority
- ## Root causes — systemic themes
- ## Phased plan — quick wins vs structural work
- ## Prevention — engineering practices that stop recurrence

Quantify only with evidence or label estimates clearly.`,

  26: `**Task:** Migration from [current stack/version] → [target].

**Code or manifest**
[paste]

**Deliver**
1. ## Breaking-change inventory
2. ## Step-by-step migration (incremental)
3. ## Automated codemods/tests where possible
4. ## Rollback
5. ## Validation checklist`,

  27: `**Task:** Debug configuration/build: [symptom].

**Configs (redacted)**
[paste files]

**Environment**
[tool versions]

**Deliver**
1. ## Root cause
2. ## Fixed snippets
3. ## Guardrails — scripts or CI checks
4. ## Minimal repro of the misconfig

Game engine + web bundler specifics when applicable.`,

  28: `**Task:** Concurrency / async review for [C++/C#/TypeScript/JavaScript/Python].

**Code**
[paste]

**Deliver**
1. ## Hazard list — races, deadlocks, ordering, visibility
2. ## Fixes — smallest correct synchronization/async model
3. ## Tests — stress/repro ideas
4. ## Perf note — contention or allocation impact

Tie to language memory model; avoid abstract threading essay.`,

  29: `**Task:** Scale architecture from [current load] → [target] for: [system].

**Deliver**
1. ## Bottleneck forecast — data, compute, fan-out
2. ## Architecture deltas — services, DB, cache, queues
3. ## Migration phases — risk-managed
4. ## Cost / operability trade-offs (estimate labels)
5. ## Game vs web specifics only if this is that domain`,

  30: `**Task:** Project documentation for: [describe].

**Deliver (choose what fits)**
- README / onboarding
- Architecture + diagrams
- Runbooks / troubleshooting
- API reference
- Glossary of domain terms

Optimize for someone joining in one day; deep dives only where ambiguity is costly.`,

  31: `**Task:** Produce API docs for: [paste routes/handlers or OpenAPI draft].

**Framework**
[name]

**Deliver**
1. OpenAPI 3.x YAML (or equivalent) — complete schemas & examples
2. ## Auth & error envelope
3. ## Versioning & deprecation notes
4. ## Postman/Insomnia export guidance (if trivial)

Keep examples copy-pasteable.`,

  32: `**Task:** Enforce [style guide / formatter rules] on: [paste code].

**Target standard**
[Airbnb | Google | PEP8 | engine conventions | custom]

**Deliver**
1. ## Reformatted code
2. ## Config files — eslint/prettier/ruff/clang-format/etc. as needed
3. ## CI one-liner to enforce

Do not change behavior unless a rule requires it—then call it out.`,

  33: `**Task:** MVP prototype: [feature] in [stack].

**Hypothesis to test**
[one sentence]

**Deliver**
- ## Smallest demo that falsifies/validates the hypothesis
- ## Code + run steps
- ## What we learned + next experiment

Optimize for hours, not days; list cuts under ## Scope limits.`,

  34: `**Task:** Compare approaches for this [language] code: [paste].

**Alternatives to judge**
[name A vs B, or propose if open-ended]

**Deliver**
- ## Comparison table — dimensions that matter for *this* problem
- ## Recommendation — decisive, with trade-offs
- ## Migration cost sketch

No generic framework marketing; ground everything in my snippet.`,

  35: `**Task:** Integrate [library/service] to add [feature] in this codebase.

**Code**
[paste]

**Deliver**
1. ## Fit check — version, license, alternatives (one paragraph)
2. ## Implementation — wiring + error paths
3. ## Config & secrets pattern
4. ## Tests — integration-focused
5. ## Operational notes — rate limits, retries, observability`,

  36: `**Task:** Remove [dependency/API/module] safely from: [describe repo or paste code].

**Deliver**
1. ## Impact map — direct + transitive
2. ## Stepwise removal plan with checkpoints
3. ## Patched code
4. ## Tests proving no hidden references
5. ## Rollback / feature-flag strategy`,

  37: `**Task:** Modernize deprecated APIs in [C++/C#/TypeScript/JavaScript/Python].

**Code**
[paste]

**Deliver**
1. ## Deprecation → replacement map
2. ## Updated code
3. ## Changelog-style notes for reviewers
4. ## Tests touching behavioral edges`,

  38: `**Task:** Enumerate edge-case tests for: [paste code].

**Deliver**
1. ## Matrix — case | intent | priority | expected
2. ## Test code implementing the high-priority slice
3. ## Residual risk — what you would test with more time/tools

Quality over hitting an arbitrary case count.`,

  39: `**Task:** PR review: [paste diff or summary + key files].

**Context**
[goal, reviewers’ bar]

**Deliver in Markdown**
- ## Summary verdict
- ## Blockers / should-fix / nice-to-have
- ## Test gaps
- ## Security quick scan if applicable
- ## Score 1–10 + rubric

Tone: direct, kind, specific line-level references when possible.`,

  40: `**Task:** Refactor for readability only: [language].

**Code**
[paste]

**Deliver**
1. ## Clarified code (same external behavior)
2. ## Naming/structure rationale — short
3. ## Complexity before/after — only if materially changed

Avoid speculative abstraction; prefer obvious data flow.`,

  41: `**Task:** Holistic project evaluation: [describe or paste entrypoints].

**Deliver in Markdown**
- ## Scores — 10 axes × /10 with evidence-based justification (total /100)
- ## Top risks
- ## 30/60/90-day roadmap

No vanity metrics; tie scores to observable project facts or mark as unknown.`,

  42: `**Task:** UX/UI evaluation for [game UI | web | mobile]: [screenshots/description/code].

**Deliver**
- ## Heuristic review — IA, flow, affordance, copy
- ## Accessibility — concrete WCAG-oriented fixes
- ## Responsiveness / input modes
- ## Prioritized redesign backlog

Scores optional; prefer actionable issues tied to what I showed.`,

  43: `**Task:** Performance & scalability review for [game | web]: [artifacts/description].

**Deliver**
- ## Scorecard — only dimensions you can ground (or mark N/A)
- ## Bottleneck hypotheses + validation steps
- ## Optimization backlog — impact vs effort
- ## Observability — metrics/traces/logs to add

Avoid benchmark fiction; separate measured vs estimated.`,
};

function replaceTemplateById(html, id, newBody) {
  const idStr = `"id": ${id},`;
  const pos = html.indexOf(idStr);
  if (pos === -1) throw new Error('Missing id ' + id);
  const key = '\n    "template": "';
  const tStart = html.indexOf(key, pos);
  if (tStart === -1) throw new Error('Missing template for id ' + id);
  const contentStart = tStart + key.length;
  let i = contentStart;
  let end = -1;
  while (i < html.length) {
    const ch = html[i];
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === '"') {
      end = i;
      break;
    }
    i++;
  }
  if (end === -1) throw new Error('Unclosed template string id ' + id);
  const before = html.slice(0, tStart);
  const after = html.slice(end + 1);
  const safeBody = newBody.replace(/\\/g, '\\\\').replace(/`/g, '\\`');
  return before + '\n    "template": `' + safeBody + '`' + after;
}

for (const id of Object.keys(templates).map(Number).sort((a, b) => a - b)) {
  html = replaceTemplateById(html, id, templates[id]);
}

fs.writeFileSync(htmlPath, html);
console.log('Patched', Object.keys(templates).length, 'templates');

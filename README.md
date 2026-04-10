# AI Prompt Templates

Single-file, offline-friendly HTML app with **43** curated prompts for coding assistants (Claude, Copilot, ChatGPT, etc.). Open `index.html` in a browser—no build step or server.

## Highlights

- **Structured prompts** — Each template uses XML-style sections (`<materials>`, `<context>`, `<task>`, `<output_spec>`) aligned with [Anthropic’s Claude prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
- **Smart copy** — **Copy** prepends a short capability header (tuned for Claude Opus–class models) and appends a `<verification>` checklist. The card shows only the task body.
- **Search & categories** — Fuzzy search; **6 grouped filters** (plus **All** / **Favorites**) so the nav stays compact. Each button covers several former tags (e.g. **Fix** = debug + repair).
- **Edit in session** — **Edit** updates `AppState.prompts` in memory; reload restores defaults from `fullPrompts` (edits are **not** persisted to `localStorage`).
- **Persisted in the browser** — Favorites, usage stats, per-card collapse state, compact/full view, and **light/dark theme** (`clineFavorites`, `clineUsageStats`, `clineCollapseStates`, `clineViewMode`, `clineTheme`). Default theme is **dark**.

## Quick start

1. Clone or download this repo.
2. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
3. Search or filter, click **Copy**, paste into your assistant.
4. Replace bracketed placeholders (e.g. `[paste code here]`) with your details.

### Filter groups

| Filter | Former tags (examples) |
|--------|-------------------------|
| **Create** | generate, feature, prototype, API |
| **Improve** | refactor, cleanup, optimize, performance, convert, remove |
| **Understand** | explain, review, analysis, eval, architecture |
| **Fix** | debug, repair |
| **Quality** | test, security, concurrency |
| **Ship** | document, devops |

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + K | Focus search |
| Ctrl/Cmd + F | Toggle favorites view |
| Ctrl/Cmd + Enter | Copy first visible prompt |
| Escape | Clear search / close modals |
| **1–7** | All, Create, Improve, Understand, Fix, Quality, Ship |
| **c i u x q s** | Same six filters (single key, when not typing in a field) |

## Customizing prompts

Edit the `fullPrompts` array in `index.html`. Each entry:

```javascript
{
  id: 44,                    // unique integer
  title: "Short Title",
  category: "fix",           // one of: create, improve, understand, fix, quality, ship
  description: "One line for the card.",
  template: `<materials>
[paste code]
</materials>
<context>...</context>
<task>...</task>
<output_spec>...</output_spec>`,
  icon: "fas fa-bug"         // Font Awesome 6 class
}
```

Use a **template literal** (backticks) for `template` if you need multiple lines.

## Technical notes

- **CDN**: Font Awesome 6, Google Fonts (Roboto), DOMPurify 3.x — first load needs network; then mostly offline.
- **CSP**: Declared in `<meta http-equiv="Content-Security-Policy" …>`.
- **Sanitization**: Titles, descriptions, icons, and generated card HTML go through DOMPurify where configured.

## Repo layout

```
AICheatCheets/
├── index.html # App + styles + scripts + fullPrompts
├── README.md                  # This file
└── .github/
    └── copilot-instructions.md # Maintainer / agent notes
```

## License

MIT — use and modify freely; attribution appreciated.

# Copilot / agent instructions — AI Prompt Templates

Single-file app: **`index.html` only**. **43** prompts in `fullPrompts`; zero build tooling.

## Copy pipeline (important)

- **`PROMPT_COPY_PREFIX`** — Short system-style header (Claude Opus–class, XML discipline, grounding rules). See [Anthropic prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices).
- **`PROMPT_COPY_SUFFIX`** — `<verification>` block: confirm `<output_spec>`, list unknowns, use `## Assumptions`.
- **`getPromptTextForCopy(templateBody)`** — Returns `PREFIX + body + SUFFIX`.
- **Copy / Edit buttons** — Use **`data-prompt-id` only** (no `data-template`). Handlers resolve `AppState.prompts.find(p => p.id === id)` so multiline templates work.

## Prompt shape

Each item in `fullPrompts`:

```javascript
{
  id: number, // unique (currently 1–43)
  title: string,
  category: string,     // must match a `.category-btn[data-category="..."]`
  description: string,
  template: string,     // multiline template literal OK; XML sections + [placeholders]
  icon: string          // Font Awesome 6, e.g. "fas fa-bug"
}
```

Templates use **XML-style sections**: `<materials>`, `<context>`, `<task>`, `<output_spec>`, plus **`[bracket]`** placeholders rendered as clickable spans.

**Adding a prompt:** next `id` after max existing; keep `category` aligned with nav buttons.

## State & storage

**`AppState`:** `selectedCategories` (Set), `searchTerm`, `favorites`, `usageStats`, `collapseStates`, `isCompactView`, `prompts` (working copy from `fullPrompts`).

**localStorage keys:**

| Key | Purpose |
|-----|---------|
| `clineFavorites` | Favorite prompt IDs |
| `clineUsageStats` | Copy counts by date string |
| `clineCollapseStates` | Per-prompt card collapsed/expanded |
| `clineViewMode` | Compact grid vs full cards |
| `clineTheme` | `"dark"` (default) or `"light"` — applied via `html[data-theme="light"]` |

**Edited prompts (Edit modal):** update **`AppState.prompts` in memory only** — not written to localStorage. Reload restores from `fullPrompts`.

## Categories

Special: **`all`**, **`favorites`** (exclusive when clicked). Others: multi-select; if none left, default back to `all`.

Nav filters (must match `category` on each prompt): **`create`**, **`improve`**, **`understand`**, **`fix`**, **`quality`**, **`ship`** — each groups multiple former tags (see README “Filter groups”). Special: **`all`**, **`favorites`**.

## Main code paths

- **`filterPrompts`** — Category + fuzzy search on title, description, template.
- **`generatePromptCardHTML`** — DOMPurify on title/description/icon; placeholder regex `\[([^\]]+)\]`.
- **`renderPrompts`** — `requestAnimationFrame` + `DocumentFragment`.
- **`toggleFavoritesView`** — Clicks `favorites` or `all` category button (Ctrl/Cmd+F).

## Security

- DOMPurify on dynamic card fields; CSP meta in `<head>`.
- Sanitized `ALLOWED_TAGS` / `ALLOWED_ATTR` when building cards from HTML strings.

## Keyboard shortcuts

- **Ctrl/Cmd+K** — focus search  
- **Ctrl/Cmd+F** — favorites ↔ all  
- **Ctrl/Cmd+Enter** — copy first visible card  
- **Escape** — clear search (modal Escape handled separately)  
- **1–7** — All + six filters; **c i u x q s** — Create, Improve, Understand, Fix, Quality, Ship (`categoryShortcuts` in `index.html`)

## Performance smoke test (console)

```javascript
for (let i = 1000; i < 1100; i++) {
  AppState.prompts.push({
    id: i,
    title: `Test ${i}`,
    category: 'quality',
    description: 'x',
    template: 't',
    icon: 'fas fa-vial'
  });
}
renderPrompts();
```

## Troubleshooting

| Issue | Check |
|-------|--------|
| Copy fails | HTTPS/localhost clipboard permission; `execCommand` fallback |
| Filter broken | `data-category` === `category` (case-sensitive) |
| Syntax error in prompts | Backticks in `template` must be escaped; no unclosed literals |

**Reset persisted UI state:** `localStorage.clear(); location.reload();`

## Philosophy

Keep the project **one file**, **no npm**, **no bundler**. Prefer small, readable changes over new dependencies.

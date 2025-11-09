# Copilot Instructions for AI Prompt Templates

## Project Overview
Single-file, offline-first AI prompt template application (`index.html` only). Provides 50+ curated coding prompts with real-time search, category filtering, favorites, and edit capabilities - all client-side with zero build tooling.

## Architecture & Core Philosophy

### Single-File Design Pattern
- **Everything embedded**: CSS (Material Design dark theme), JavaScript (vanilla), HTML - one file for maximum portability
- **Zero build process**: Open `index.html` directly in browser - no Node.js, webpack, Babel, or transpilation
- **CDN-only dependencies**: Font Awesome 6.0.0 (icons), Google Fonts Roboto (typography), DOMPurify 3.0.6 (XSS protection)
- **localStorage persistence**: Favorites (`clineFavorites`) and edited prompts saved client-side, survives browser restart

### Data Flow Architecture
```
User Input → AppState (search/filters) → filterPrompts() → generatePromptCardHTML()
→ DocumentFragment (batch DOM) → requestAnimationFrame → render → Event Listeners
```

### Key Components
1. **Prompt data**: `fullPrompts` array (52 objects) - immutable source of truth, copied to `AppState.prompts`
2. **State management**: `AppState` singleton object
   - `currentCategory`: legacy field, not actively used
   - `selectedCategories`: Set of active category filters (supports multi-select)
   - `searchTerm`: fuzzy search query string
   - `favorites`: Array of prompt IDs (persisted to localStorage)
   - `usageStats`: Object mapping dates to copy counts (persisted to localStorage)
   - `prompts`: Working copy of fullPrompts array
3. **Rendering engine**: Vanilla JS DOM manipulation with performance optimizations (DocumentFragment, requestAnimationFrame)
4. **Event system**: Event delegation on grid container + direct listeners on category buttons

## Critical Patterns & Conventions

### Prompt Object Structure (STRICT SCHEMA)
```javascript
{
  id: number,              // Sequential, unique identifier (1-52, no gaps)
  title: string,           // Concise, action-oriented (e.g., "Debug Code", "Security Audit")
  category: string,        // MUST match category button data-category attribute exactly
  description: string,     // Brief explanation (1-2 sentences, under 150 chars)
  template: string,        // Actual prompt text with [placeholder] syntax for user input
  icon: string            // Font Awesome 6.0 class (e.g., "fas fa-bug", "fas fa-shield-alt")
}
```

**Example from codebase:**
```javascript
{
  id: 3,
  title: "Debug Code",
  category: "debug",
  description: "Find and fix issues with systematic debugging methodology",
  template: "Act as a senior debugger with expertise in [language] runtime issues. Debug this [language] code: [paste code here]...",
  icon: "fas fa-bug"
}
```

### Category System (26 Categories + 2 Special)
**Predefined categories** (must match HTML button `data-category` values):
```
cleanup, document, repair, explain, feature, remove, refactor, beautify,
generate, optimize, debug, convert, test, security, architecture, review,
eval, testing, performance, database, api, devops, analysis, concurrency,
prototype, documentation
```

**Special categories:**
- `"all"` - Default view, shows all prompts (clears other selections)
- `"favorites"` - Dynamic, shows only prompts in `AppState.favorites` array

**Category selection logic** (multi-select for regular, exclusive for special):
```javascript
// Clicking "all" or "favorites" → exclusive selection (clears others)
if (category === 'all' || category === 'favorites') {
  AppState.selectedCategories.clear();
  AppState.selectedCategories.add(category);
}
// Clicking regular category → multi-select toggle
else {
  // If "all"/"favorites" active, clear them first
  if (AppState.selectedCategories.has('all') || AppState.selectedCategories.has('favorites')) {
    AppState.selectedCategories.clear();
  }
  // Toggle clicked category
  AppState.selectedCategories.has(category)
    ? AppState.selectedCategories.delete(category)
    : AppState.selectedCategories.add(category);
  // If nothing selected, default to "all"
  if (AppState.selectedCategories.size === 0) {
    AppState.selectedCategories.add('all');
  }
}
```

### Placeholder Pattern (Interactive Template Variables)
- **Syntax**: `[placeholder_name]` in prompt templates
- **Rendering**: Converted to `<span class="placeholder" onclick="fillPlaceholder('placeholder_name')">` during HTML generation
- **User interaction**: Click triggers `prompt()` dialog for value input
- **Common examples**: `[language]`, `[code]`, `[paste code here]`, `[describe issue]`, `[feature description]`

**Implementation detail:**
```javascript
const templateWithPlaceholders = prompt.template.replace(
  /\[([^\]]+)\]/g,
  '<span class="placeholder" onclick="fillPlaceholder(\'$1\')">[$1]</span>'
);
```

### Search Algorithm (Fuzzy Match)
```javascript
function fuzzyMatch(text, query) {
  if (!query) return true;
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // 1. Exact substring match (highest priority)
  if (textLower.includes(queryLower)) return true;

  // 2. Fuzzy match: all query chars appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) queryIndex++;
  }
  return queryIndex === queryLower.length;
}
```
Searches across: `prompt.title`, `prompt.description`, `prompt.template` (debounced 300ms)

## Development Workflows

### Adding New Prompts (Step-by-Step)
1. **Find highest ID**: Search `fullPrompts` for highest `id` value (currently 52)
2. **Add to array**: Insert new object into `fullPrompts` array (maintain readability, group by category optional)
3. **Choose category**: Use existing category OR add new button to HTML:
   ```html
   <button class="category-btn" data-category="yourcategory">Your Category</button>
   ```
4. **Icon selection**: Browse Font Awesome 6.0 free icons, use format `"fas fa-icon-name"`
5. **Template writing**: Use clear instructions, include `[placeholder]` syntax for user inputs
6. **Test immediately**: Open `index.html` in browser, verify:
   - Prompt appears in grid
   - Category filter works
   - Search finds it (test title, description, template text)
   - Copy button works
   - Edit modal opens and saves changes

**Common mistake**: Category mismatch between prompt object and HTML button causes filter failure

### Modifying Existing Prompts
**Two modification paths:**
1. **Browser-based** (temporary, localStorage):
   - Click "Edit" button on prompt card
   - Modify template in modal textarea
   - Changes saved to localStorage (key: not explicitly defined, merged into prompts)
   - Overrides `fullPrompts` array until localStorage cleared
   - Use for quick testing or user customization

2. **Code-based** (permanent, source):
   - Edit `fullPrompts` array directly in `<script>` section
   - Find prompt by ID or title
   - Modify any property (id, title, category, description, template, icon)
   - Reload browser to see changes
   - **Note**: localStorage edits take precedence

**To clear localStorage edits:**
```javascript
// Run in browser console
localStorage.removeItem('clineFavorites');
localStorage.removeItem('clineUsageStats');
// Or clear all: localStorage.clear();
```

### Adding New Categories
1. **Add HTML button** in `<nav class="categories">` section:
   ```html
   <button class="category-btn" data-category="newcat">New Category</button>
   ```
2. **Add prompts** with matching `category: "newcat"`
3. **Optional styling**: Category buttons inherit default styles, no additional CSS needed
4. **Filtering**: Automatic - `filterPrompts()` uses `AppState.selectedCategories.has(prompt.category)`

### Performance Testing
**Test with large datasets:**
```javascript
// Add 500 test prompts (run in browser console after page load)
for (let i = 53; i <= 553; i++) {
  AppState.prompts.push({
    id: i,
    title: `Test Prompt ${i}`,
    category: 'test',
    description: `Test description ${i}`,
    template: `Test template ${i}`,
    icon: 'fas fa-vial'
  });
}
renderPrompts(); // Should remain smooth with DocumentFragment optimization
```

### Debugging Common Issues

**Issue**: Prompts not appearing after adding to `fullPrompts`
- **Check**: Browser cache - hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- **Check**: JavaScript console for syntax errors
- **Check**: ID is unique and sequential

**Issue**: Category filter not working for new category
- **Check**: HTML button `data-category` exactly matches prompt `category` property (case-sensitive)
- **Check**: Browser console for event listener errors

**Issue**: Copy button not working
- **Check**: Browser clipboard permissions (HTTPS or localhost required for Clipboard API)
- **Check**: Fallback `execCommand` triggers if modern API fails
- **Check**: Template string escaping (quotes properly escaped in `data-template` attribute)

**Issue**: Edit modal not saving changes
- **Check**: `window.currentEditingPromptId` is set (should be number)
- **Check**: Textarea has content (non-empty validation)
- **Check**: Console for localStorage errors (quota exceeded, private browsing mode)

## Performance Considerations

### Client-Side Optimization Patterns
1. **Debounced search** (300ms delay):
   ```javascript
   document.getElementById('searchInput').addEventListener('input', debounce((e) => {
     AppState.searchTerm = e.target.value;
     renderPrompts();
   }, 300));
   ```

2. **DocumentFragment for batch DOM updates**:
   ```javascript
   const fragment = document.createDocumentFragment();
   filteredPrompts.forEach((prompt, index) => {
     const cardHTML = generatePromptCardHTML(prompt);
     // ... create element
     fragment.appendChild(card);
   });
   grid.innerHTML = '';
   grid.appendChild(fragment); // Single reflow
   ```

3. **RequestAnimationFrame for smooth rendering**:
   ```javascript
   function renderPrompts() {
     requestAnimationFrame(() => {
       // DOM updates here
     });
   }
   ```

4. **Fuzzy search optimization**: Simple character matching, not Levenshtein distance or complex algorithms
5. **Event delegation**: Click handlers on grid container, not individual cards (reduces memory)

### Memory Management
- **No memory leaks**: Event listeners cleaned up during re-render (cards completely replaced)
- **Minimal localStorage**: Only favorites array and usage stats object (typically < 10KB)
- **No global scope pollution**: Functions scoped within `<script>` tag, only necessary functions exposed to `window`

### Performance Benchmarks (Typical)
- **Initial render**: < 100ms for 52 prompts
- **Search filter**: < 50ms with debouncing
- **Category switch**: < 30ms (instant feel)
- **Edit modal open**: < 20ms

## Security & Best Practices

### XSS Prevention (Multi-Layer)
1. **DOMPurify sanitization**: All user inputs and dynamic HTML sanitized before insertion
   ```javascript
   const safeTitle = typeof DOMPurify !== 'undefined'
     ? DOMPurify.sanitize(prompt.title)
     : prompt.title;
   ```

2. **Content Security Policy**: Restrictive CSP in `<meta>` tag:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self';
     script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
     style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
     font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com;
     img-src 'self' data:; connect-src 'self';">
   ```

3. **Safe innerHTML usage**: Always sanitize before setting innerHTML
4. **Data attribute escaping**: Template strings properly escaped in `data-template` attributes

### Accessibility Features
1. **ARIA labels**: All interactive elements have proper labels
   ```html
   <input aria-label="Search prompts" aria-describedby="search-help">
   ```

2. **Keyboard shortcuts** (extensive):
   - `Ctrl/Cmd + K`: Focus search
   - `Ctrl/Cmd + F`: Toggle favorites
   - `Ctrl/Cmd + Enter`: Copy first visible prompt
   - `Escape`: Clear search / close modals
   - `1-0, Q-P, A-G`: Category shortcuts

3. **Focus management**: Modal open/close properly manages focus
4. **Semantic HTML**: Proper `<nav>`, `<main>`, `<section>` usage
5. **Screen reader support**: Live regions for dynamic content updates

### Browser Compatibility
- **Modern browsers only**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Required APIs**: localStorage, Clipboard API (with fallback), ES6 features
- **Graceful degradation**: Fallback for Clipboard API using `execCommand`

## Integration Points

### External Dependencies (CDN-based)
- **Font Awesome 6.0.0**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`
- **Google Fonts (Roboto)**: `https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap`
- **DOMPurify 3.0.6**: `https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js`
- **Offline functionality**: Requires initial internet connection, then fully offline

### Browser Storage Schema
```javascript
// localStorage keys and data structures
{
  "clineFavorites": [1, 5, 10, 23],          // Array of prompt IDs
  "clineUsageStats": {                        // Object mapping dates to copy counts
    "Fri Nov 08 2025": 15,
    "Thu Nov 07 2025": 23
  }
}
```

### Global Functions (exposed to window)
```javascript
window.saveEditedPrompt = saveEditedPrompt;  // Modal save handler
window.closeModal = closeModal;              // Modal close handler
window.fillPlaceholder = fillPlaceholder;    // Placeholder click handler
```
**Why exposed**: Used by `onclick` attributes in dynamically generated HTML

## UI/UX Patterns

### Material Design Dark Theme
- **CSS variables**: All colors defined as CSS custom properties in `:root`
- **Primary color**: `#2196F3` (Material Blue)
- **Surface colors**: `#121212` (background), `#1E1E1E` (surface), `#2D2D2D` (cards)
- **Elevation shadows**: 8 levels (01-08) for depth perception
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` for Material motion

### Toast Notifications
```javascript
showToast(message, type); // type: 'success' | 'error' | 'warning' | 'info'
// Auto-dismisses after 3 seconds
// Positioned fixed top-right
```

### Modal Management
```javascript
openModal('editPromptModal');   // Shows modal with fade-in
closeModal('editPromptModal');  // Hides modal with fade-out
// State tracked via window.currentEditingPromptId
```

### Card Interaction States
- **Default**: Elevation 01 shadow
- **Hover**: Elevation 04 shadow + translateY(-2px)
- **Favorite**: Gold border glow effect
- **Edit mode**: Modal overlay with textarea

## Quick Reference

### File Structure
```
index.html          # Single file containing everything
├── <head>
│   ├── Meta tags (CSP, viewport)
│   ├── CDN links (Font Awesome, Google Fonts, DOMPurify)
│   └── <style> (Material Design CSS, ~900 lines)
├── <body>
│   ├── Header (title, subtitle)
│   ├── Search container (input + category buttons)
│   ├── Prompts grid (dynamically rendered)
│   └── Modals (edit prompt modal)
└── <script>
    ├── Utility functions (debounce, fuzzyMatch, copyToClipboard)
    ├── State management (AppState, localStorage handlers)
    ├── Prompt data (fullPrompts array - 52 objects)
    ├── Rendering functions (generatePromptCardHTML, renderPrompts)
    ├── Event listeners (search, category, keyboard shortcuts)
    └── Initialization (initializeApp)
```

### Common Tasks Quick Guide

**Add a new prompt:**
1. Find highest ID in `fullPrompts` array
2. Add new object with sequential ID
3. Refresh browser and test

**Change theme color:**
1. Find `:root` in `<style>` section
2. Modify `--md-primary` or other CSS variables
3. Refresh to see changes

**Debug search not working:**
1. Open console (F12)
2. Check `AppState.searchTerm` value
3. Test `fuzzyMatch()` function manually
4. Verify debounce is not blocking (wait 300ms)

**Clear all user data:**
```javascript
localStorage.clear(); // Run in console
location.reload();    // Reload page
```

Remember: This is a **single-file application** optimized for **simplicity and portability**. Maintain this philosophy when making changes - avoid introducing build complexity or external dependencies.

## Project Overview
Single-file, offline-first AI prompt template application (`index.html` only). Provides 50+ curated coding prompts with real-time search, category filtering, favorites, and edit capabilities - all client-side with zero build tooling.

## Architecture & Core Philosophy

### Single-File Design Pattern
- **Everything embedded**: CSS (Material Design dark theme), JavaScript (vanilla), HTML - one file for maximum portability
- **Zero build process**: Open `index.html` directly in browser - no Node.js, webpack, Babel, or transpilation
- **CDN-only dependencies**: Font Awesome 6.0.0 (icons), Google Fonts Roboto (typography), DOMPurify 3.0.6 (XSS protection)
- **localStorage persistence**: Favorites (`clineFavorites`) and edited prompts saved client-side, survives browser restart

### Data Flow Architecture
```
User Input → AppState (search/filters) → filterPrompts() → generatePromptCardHTML()
→ DocumentFragment (batch DOM) → requestAnimationFrame → render → Event Listeners
```

### Key Components
1. **Prompt data**: `fullPrompts` array (52 objects) - immutable source of truth, copied to `AppState.prompts`
2. **State management**: `AppState` singleton object
   - `currentCategory`: legacy field, not actively used
   - `selectedCategories`: Set of active category filters (supports multi-select)
   - `searchTerm`: fuzzy search query string
   - `favorites`: Array of prompt IDs (persisted to localStorage)
   - `usageStats`: Object mapping dates to copy counts (persisted to localStorage)
   - `prompts`: Working copy of fullPrompts array
3. **Rendering engine**: Vanilla JS DOM manipulation with performance optimizations (DocumentFragment, requestAnimationFrame)
4. **Event system**: Event delegation on grid container + direct listeners on category buttons

## Critical Patterns & Conventions

### Prompt Object Structure (STRICT SCHEMA)
```javascript
{
  id: number,              // Sequential, unique identifier (1-52, no gaps)
  title: string,           // Concise, action-oriented (e.g., "Debug Code", "Security Audit")
  category: string,        // MUST match category button data-category attribute exactly
  description: string,     // Brief explanation (1-2 sentences, under 150 chars)
  template: string,        // Actual prompt text with [placeholder] syntax for user input
  icon: string            // Font Awesome 6.0 class (e.g., "fas fa-bug", "fas fa-shield-alt")
}
```

**Example from codebase:**
```javascript
{
  id: 3,
  title: "Debug Code",
  category: "debug",
  description: "Find and fix issues with systematic debugging methodology",
  template: "Act as a senior debugger with expertise in [language] runtime issues. Debug this [language] code: [paste code here]...",
  icon: "fas fa-bug"
}
```

### Category System (26 Categories + 2 Special)
**Predefined categories** (must match HTML button `data-category` values):
```
cleanup, document, repair, explain, feature, remove, refactor, beautify,
generate, optimize, debug, convert, test, security, architecture, review,
eval, testing, performance, database, api, devops, analysis, concurrency,
prototype, documentation
```

**Special categories:**
- `"all"` - Default view, shows all prompts (clears other selections)
- `"favorites"` - Dynamic, shows only prompts in `AppState.favorites` array

**Category selection logic** (multi-select for regular, exclusive for special):
```javascript
// Clicking "all" or "favorites" → exclusive selection (clears others)
if (category === 'all' || category === 'favorites') {
  AppState.selectedCategories.clear();
  AppState.selectedCategories.add(category);
}
// Clicking regular category → multi-select toggle
else {
  // If "all"/"favorites" active, clear them first
  if (AppState.selectedCategories.has('all') || AppState.selectedCategories.has('favorites')) {
    AppState.selectedCategories.clear();
  }
  // Toggle clicked category
  AppState.selectedCategories.has(category)
    ? AppState.selectedCategories.delete(category)
    : AppState.selectedCategories.add(category);
  // If nothing selected, default to "all"
  if (AppState.selectedCategories.size === 0) {
    AppState.selectedCategories.add('all');
  }
}
```

### Placeholder Pattern (Interactive Template Variables)
- **Syntax**: `[placeholder_name]` in prompt templates
- **Rendering**: Converted to `<span class="placeholder" onclick="fillPlaceholder('placeholder_name')">` during HTML generation
- **User interaction**: Click triggers `prompt()` dialog for value input
- **Common examples**: `[language]`, `[code]`, `[paste code here]`, `[describe issue]`, `[feature description]`

**Implementation detail:**
```javascript
const templateWithPlaceholders = prompt.template.replace(
  /\[([^\]]+)\]/g,
  '<span class="placeholder" onclick="fillPlaceholder(\'$1\')">[$1]</span>'
);
```

### Search Algorithm (Fuzzy Match)
```javascript
function fuzzyMatch(text, query) {
  if (!query) return true;
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // 1. Exact substring match (highest priority)
  if (textLower.includes(queryLower)) return true;

  // 2. Fuzzy match: all query chars appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) queryIndex++;
  }
  return queryIndex === queryLower.length;
}
```
Searches across: `prompt.title`, `prompt.description`, `prompt.template` (debounced 300ms)

## Development Workflows

### Adding New Prompts (Step-by-Step)
1. **Find highest ID**: Search `fullPrompts` for highest `id` value (currently 52)
2. **Add to array**: Insert new object into `fullPrompts` array (maintain readability, group by category optional)
3. **Choose category**: Use existing category OR add new button to HTML:
   ```html
   <button class="category-btn" data-category="yourcategory">Your Category</button>
   ```
4. **Icon selection**: Browse Font Awesome 6.0 free icons, use format `"fas fa-icon-name"`
5. **Template writing**: Use clear instructions, include `[placeholder]` syntax for user inputs
6. **Test immediately**: Open `index.html` in browser, verify:
   - Prompt appears in grid
   - Category filter works
   - Search finds it (test title, description, template text)
   - Copy button works
   - Edit modal opens and saves changes

**Common mistake**: Category mismatch between prompt object and HTML button causes filter failure

### Modifying Existing Prompts
**Two modification paths:**
1. **Browser-based** (temporary, localStorage):
   - Click "Edit" button on prompt card
   - Modify template in modal textarea
   - Changes saved to localStorage (key: not explicitly defined, merged into prompts)
   - Overrides `fullPrompts` array until localStorage cleared
   - Use for quick testing or user customization

2. **Code-based** (permanent, source):
   - Edit `fullPrompts` array directly in `<script>` section
   - Find prompt by ID or title
   - Modify any property (id, title, category, description, template, icon)
   - Reload browser to see changes
   - **Note**: localStorage edits take precedence

**To clear localStorage edits:**
```javascript
// Run in browser console
localStorage.removeItem('clineFavorites');
localStorage.removeItem('clineUsageStats');
// Or clear all: localStorage.clear();
```

### Adding New Categories
1. **Add HTML button** in `<nav class="categories">` section:
   ```html
   <button class="category-btn" data-category="newcat">New Category</button>
   ```
2. **Add prompts** with matching `category: "newcat"`
3. **Optional styling**: Category buttons inherit default styles, no additional CSS needed
4. **Filtering**: Automatic - `filterPrompts()` uses `AppState.selectedCategories.has(prompt.category)`

### Performance Testing
**Test with large datasets:**
```javascript
// Add 500 test prompts (run in browser console after page load)
for (let i = 53; i <= 553; i++) {
  AppState.prompts.push({
    id: i,
    title: `Test Prompt ${i}`,
    category: 'test',
    description: `Test description ${i}`,
    template: `Test template ${i}`,
    icon: 'fas fa-vial'
  });
}
renderPrompts(); // Should remain smooth with DocumentFragment optimization
```

### Debugging Common Issues

**Issue**: Prompts not appearing after adding to `fullPrompts`
- **Check**: Browser cache - hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- **Check**: JavaScript console for syntax errors
- **Check**: ID is unique and sequential

**Issue**: Category filter not working for new category
- **Check**: HTML button `data-category` exactly matches prompt `category` property (case-sensitive)
- **Check**: Browser console for event listener errors

**Issue**: Copy button not working
- **Check**: Browser clipboard permissions (HTTPS or localhost required for Clipboard API)
- **Check**: Fallback `execCommand` triggers if modern API fails
- **Check**: Template string escaping (quotes properly escaped in `data-template` attribute)

**Issue**: Edit modal not saving changes
- **Check**: `window.currentEditingPromptId` is set (should be number)
- **Check**: Textarea has content (non-empty validation)
- **Check**: Console for localStorage errors (quota exceeded, private browsing mode)

## Performance Considerations

### Client-Side Optimization Patterns
1. **Debounced search** (300ms delay):
   ```javascript
   document.getElementById('searchInput').addEventListener('input', debounce((e) => {
     AppState.searchTerm = e.target.value;
     renderPrompts();
   }, 300));
   ```

2. **DocumentFragment for batch DOM updates**:
   ```javascript
   const fragment = document.createDocumentFragment();
   filteredPrompts.forEach((prompt, index) => {
     const cardHTML = generatePromptCardHTML(prompt);
     // ... create element
     fragment.appendChild(card);
   });
   grid.innerHTML = '';
   grid.appendChild(fragment); // Single reflow
   ```

3. **RequestAnimationFrame for smooth rendering**:
   ```javascript
   function renderPrompts() {
     requestAnimationFrame(() => {
       // DOM updates here
     });
   }
   ```

4. **Fuzzy search optimization**: Simple character matching, not Levenshtein distance or complex algorithms
5. **Event delegation**: Click handlers on grid container, not individual cards (reduces memory)

### Memory Management
- **No memory leaks**: Event listeners cleaned up during re-render (cards completely replaced)
- **Minimal localStorage**: Only favorites array and usage stats object (typically < 10KB)
- **No global scope pollution**: Functions scoped within `<script>` tag, only necessary functions exposed to `window`

### Performance Benchmarks (Typical)
- **Initial render**: < 100ms for 52 prompts
- **Search filter**: < 50ms with debouncing
- **Category switch**: < 30ms (instant feel)
- **Edit modal open**: < 20ms

## Security & Best Practices

### XSS Prevention (Multi-Layer)
1. **DOMPurify sanitization**: All user inputs and dynamic HTML sanitized before insertion
   ```javascript
   const safeTitle = typeof DOMPurify !== 'undefined'
     ? DOMPurify.sanitize(prompt.title)
     : prompt.title;
   ```

2. **Content Security Policy**: Restrictive CSP in `<meta>` tag:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self';
     script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
     style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
     font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com;
     img-src 'self' data:; connect-src 'self';">
   ```

3. **Safe innerHTML usage**: Always sanitize before setting innerHTML
4. **Data attribute escaping**: Template strings properly escaped in `data-template` attributes

### Accessibility Features
1. **ARIA labels**: All interactive elements have proper labels
   ```html
   <input aria-label="Search prompts" aria-describedby="search-help">
   ```

2. **Keyboard shortcuts** (extensive):
   - `Ctrl/Cmd + K`: Focus search
   - `Ctrl/Cmd + F`: Toggle favorites
   - `Ctrl/Cmd + Enter`: Copy first visible prompt
   - `Escape`: Clear search / close modals
   - `1-0, Q-P, A-G`: Category shortcuts

3. **Focus management**: Modal open/close properly manages focus
4. **Semantic HTML**: Proper `<nav>`, `<main>`, `<section>` usage
5. **Screen reader support**: Live regions for dynamic content updates

### Browser Compatibility
- **Modern browsers only**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Required APIs**: localStorage, Clipboard API (with fallback), ES6 features
- **Graceful degradation**: Fallback for Clipboard API using `execCommand`

## Integration Points

### External Dependencies (CDN-based)
- **Font Awesome 6.0.0**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`
- **Google Fonts (Roboto)**: `https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap`
- **DOMPurify 3.0.6**: `https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js`
- **Offline functionality**: Requires initial internet connection, then fully offline

### Browser Storage Schema
```javascript
// localStorage keys and data structures
{
  "clineFavorites": [1, 5, 10, 23],          // Array of prompt IDs
  "clineUsageStats": {                        // Object mapping dates to copy counts
    "Fri Nov 08 2025": 15,
    "Thu Nov 07 2025": 23
  }
}
```

### Global Functions (exposed to window)
```javascript
window.saveEditedPrompt = saveEditedPrompt;  // Modal save handler
window.closeModal = closeModal;              // Modal close handler
window.fillPlaceholder = fillPlaceholder;    // Placeholder click handler
```
**Why exposed**: Used by `onclick` attributes in dynamically generated HTML

## UI/UX Patterns

### Material Design Dark Theme
- **CSS variables**: All colors defined as CSS custom properties in `:root`
- **Primary color**: `#2196F3` (Material Blue)
- **Surface colors**: `#121212` (background), `#1E1E1E` (surface), `#2D2D2D` (cards)
- **Elevation shadows**: 8 levels (01-08) for depth perception
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)` for Material motion

### Toast Notifications
```javascript
showToast(message, type); // type: 'success' | 'error' | 'warning' | 'info'
// Auto-dismisses after 3 seconds
// Positioned fixed top-right
```

### Modal Management
```javascript
openModal('editPromptModal');   // Shows modal with fade-in
closeModal('editPromptModal');  // Hides modal with fade-out
// State tracked via window.currentEditingPromptId
```

### Card Interaction States
- **Default**: Elevation 01 shadow
- **Hover**: Elevation 04 shadow + translateY(-2px)
- **Favorite**: Gold border glow effect
- **Edit mode**: Modal overlay with textarea

## Debugging & Troubleshooting

### Common Issues & Solutions

**Issue**: Prompts not appearing after adding to `fullPrompts`
- **Check**: Browser cache - hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- **Check**: JavaScript console for syntax errors
- **Check**: ID is unique and sequential

**Issue**: Category filter not working for new category
- **Check**: HTML button `data-category` exactly matches prompt `category` property (case-sensitive)
- **Check**: Browser console for event listener errors

**Issue**: Copy button not working
- **Check**: Browser clipboard permissions (HTTPS or localhost required for Clipboard API)
- **Check**: Fallback `execCommand` triggers if modern API fails
- **Check**: Template string escaping (quotes properly escaped in `data-template` attribute)

**Issue**: Edit modal not saving changes
- **Check**: `window.currentEditingPromptId` is set (should be number)
- **Check**: Textarea has content (non-empty validation)
- **Check**: Console for localStorage errors (quota exceeded, private browsing mode)

### Development Tools
- **Browser DevTools**: Primary debugging environment (F12)
- **Console logging**: App logs prompt loading and state changes
- **Performance tab**: Monitor rendering performance with large prompt sets
- **Network tab**: Verify CDN resources load successfully
- **Application tab**: Inspect localStorage data structure

### Testing Checklist
```javascript
// Quick test suite (run in console)
// 1. Test search
AppState.searchTerm = 'debug'; renderPrompts();
// 2. Test category filter
AppState.selectedCategories.clear();
AppState.selectedCategories.add('security');
renderPrompts();
// 3. Test favorites
toggleFavorite(1); // Should add/remove from favorites
// 4. Verify localStorage
console.log(localStorage.getItem('clineFavorites'));
```

## Customization Guidelines

### Theme & Styling
- **CSS variables**: Material Design dark theme via CSS custom properties in `:root`
- **Responsive design**: Mobile-first approach with breakpoints at 768px and 480px
- **Color scheme**: Consistent with VSCode dark theme by default
- **Customization**: Modify CSS variables to change entire theme:
  ```css
  :root {
    --md-primary: #2196F3;      /* Change primary color */
    --md-background: #121212;    /* Change background */
    --md-surface: #1E1E1E;       /* Change surface color */
  }
  ```

### Feature Extensions (Examples)

**Adding prompt export/import:**
```javascript
// Export prompts to JSON
function exportPrompts() {
  const json = JSON.stringify(AppState.prompts, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  // Create download link...
}
```

**Adding search history:**
```javascript
// Track search history in localStorage
const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
searchHistory.push(AppState.searchTerm);
localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(-10)));
```

**Adding prompt rating system:**
```javascript
// Add rating to prompt object
{
  id: 1,
  // ... existing fields
  rating: 4.5,
  ratingCount: 23
}
```

### Keyboard Shortcuts (Complete Mapping)
```javascript
// Category shortcuts (1-0, Q-P, A-G)
'1': 'all', '2': 'cleanup', '3': 'document', '4': 'repair', '5': 'explain',
'6': 'feature', '7': 'remove', '8': 'refactor', '9': 'generate', '0': 'optimize',
'q': 'debug', 'w': 'convert', 'e': 'test', 'r': 'security', 't': 'architecture',
'y': 'review', 'u': 'testing', 'i': 'performance', 'o': 'database', 'p': 'api',
'a': 'devops', 's': 'analysis', 'd': 'concurrency', 'f': 'prototype', 'g': 'documentation'

// Global shortcuts
'Ctrl/Cmd + K': 'Focus search',
'Ctrl/Cmd + F': 'Toggle favorites',
'Ctrl/Cmd + Enter': 'Copy first visible prompt',
'Escape': 'Clear search / Close modal'
```

## Quick Reference

### File Structure
```
index.html          # Single file containing everything
├── <head>
│   ├── Meta tags (CSP, viewport)
│   ├── CDN links (Font Awesome, Google Fonts, DOMPurify)
│   └── <style> (Material Design CSS, ~900 lines)
├── <body>
│   ├── Header (title, subtitle)
│   ├── Search container (input + category buttons)
│   ├── Prompts grid (dynamically rendered)
│   └── Modals (edit prompt modal)
└── <script>
    ├── Utility functions (debounce, fuzzyMatch, copyToClipboard)
    ├── State management (AppState, localStorage handlers)
    ├── Prompt data (fullPrompts array - 52 objects)
    ├── Rendering functions (generatePromptCardHTML, renderPrompts)
    ├── Event listeners (search, category, keyboard shortcuts)
    └── Initialization (initializeApp)
```

### Common Tasks Quick Guide

**Add a new prompt:**
1. Find highest ID in `fullPrompts` array
2. Add new object with sequential ID
3. Refresh browser and test

**Change theme color:**
1. Find `:root` in `<style>` section
2. Modify `--md-primary` or other CSS variables
3. Refresh to see changes

**Debug search not working:**
1. Open console (F12)
2. Check `AppState.searchTerm` value
3. Test `fuzzyMatch()` function manually
4. Verify debounce is not blocking (wait 300ms)

**Clear all user data:**
```javascript
localStorage.clear(); // Run in console
location.reload();    // Reload page
```

Remember: This is a **single-file application** optimized for **simplicity and portability**. Maintain this philosophy when making changes - avoid introducing build complexity or external dependencies.
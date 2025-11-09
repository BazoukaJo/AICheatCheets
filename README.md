# AI Prompt Templates - Single File Version 🚀# AI Prompt Templates - Single File Version



> A curated collection of 50+ production-ready AI coding prompts for developers, delivered as a single offline-first HTML file.## Overview



## OverviewThis is a standalone, single-file version of the AI Prompt Templates application. All functionality has been consolidated into `index.html`, making it easy to use offline without any build tools or server setup.



**AI Prompt Templates** is a zero-dependency, single-file web application that provides instant access to expertly crafted prompts for AI coding assistants (GitHub Copilot, ChatGPT, Claude, etc.). Designed for developers working on web apps, games, APIs, and DevOps - all without any build tools or server setup.## Features



### Why This Tool?- **Browse Prompts**: Explore 45+ pre-built prompts for various coding tasks like debugging, refactoring, documentation, and more.

- **Search**: Quickly find prompts by keyword in title, description, or content.

- **🎯 Production-Ready Prompts**: 52 carefully crafted prompts covering debugging, optimization, testing, documentation, and more- **Category Filtering**: Filter prompts by categories such as Cleanup, Debug, Security, Performance, etc.

- **⚡ Zero Setup**: Open `index.html` in any browser - no Node.js, npm, or build process required- **Copy to Clipboard**: One-click copy of prompt templates to your clipboard.

- **🔍 Smart Search**: Fuzzy search with 300ms debouncing finds prompts by title, description, or content- **Edit Prompts**: Modify existing prompts and save changes locally (persists via browser localStorage).

- **🎨 Material Design**: Beautiful dark theme with smooth animations and accessibility features- **Favorites**: Mark favorite prompts for quick access.

- **💾 Offline-First**: Works completely offline after initial load (CDN resources cached)- **Keyboard Shortcuts**:

- **🔒 Secure**: Multi-layer XSS protection with DOMPurify and Content Security Policy  - Ctrl/Cmd + K: Focus search

- **⌨️ Keyboard-Driven**: Extensive shortcuts for power users (see below)  - Ctrl/Cmd + F: Toggle favorites view

  - Ctrl/Cmd + Enter: Copy first visible prompt

## Features  - Escape: Clear search and close modals

- **Offline Support**: Works completely offline after loading (requires internet only for initial CDN loads of fonts and icons).

### Core Functionality

## Usage

- **📚 Browse 52 Prompts**: Categories include Debug, Optimize, Refactor, Test, Security, DevOps, and 20+ more

- **🔎 Real-Time Search**: Fuzzy matching across title, description, and template content1. Open `index.html` directly in any modern web browser (e.g., Chrome, Firefox, Edge).

- **🏷️ Multi-Select Categories**: Filter by one or multiple categories simultaneously2. The app loads with all prompts visible.

- **📋 One-Click Copy**: Clipboard API with fallback for older browsers3. Use the search bar to find specific prompts.

- **✏️ Edit & Customize**: Modify prompts inline with localStorage persistence4. Click on category buttons to filter.

- **⭐ Favorites System**: Star your most-used prompts for quick access5. Click "Copy" on a prompt card to copy the template to your clipboard.

- **🎛️ Compact/Full View**: Toggle between detailed cards and compact list view6. Click "Edit" to modify a prompt (changes are saved locally in your browser).

- **🔗 Interactive Placeholders**: Click `[placeholder]` in templates to fill in values dynamically7. Favorites are marked with a star and persist across sessions.



### Keyboard Shortcuts## Technical Notes



**Global Shortcuts:**- **No Server Required**: Pure client-side JavaScript and CSS.

- `Ctrl/Cmd + K` - Focus search bar- **Dependencies**:

- `Ctrl/Cmd + F` - Toggle favorites view  - Font Awesome (icons) via CDN

- `Ctrl/Cmd + Enter` - Copy first visible prompt  - Google Fonts (Roboto) via CDN

- `Escape` - Clear search / close modals  - DOMPurify (sanitization) via CDN

- **Storage**: Uses browser localStorage for favorites and edited prompts.

**Category Quick Access (Number/Letter Keys):**- **Customization**: Edit the `fullPrompts` array in the `<script>` tag to add or modify prompts.

- `1` All, `2` Cleanup, `3` Document, `4` Repair, `5` Explain, `6` Feature, `7` Remove, `8` Refactor, `9` Generate, `0` Optimize

- `Q` Debug, `W` Convert, `E` Test, `R` Security, `T` Architecture, `Y` Review, `U` Testing, `I` Performance, `O` Database, `P` APIThis version eliminates the need for Node.js, npm, or any build process. Simply open the file and start using it!

- `A` DevOps, `S` Analysis, `D` Concurrency, `F` Prototype, `G` Documentation

## Original Project

## Quick Start

This is derived from the original AI Prompt Templates project. For the full source with build tools and more features, refer to the GitHub repository (if available).

### Option 1: Direct Use
1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
3. Start using prompts immediately!

### Option 2: GitHub Pages (Live Demo)
Visit the live version at: `https://[your-username].github.io/AICheatCheets/`

### Option 3: Local Development
```bash
# Clone the repository
git clone https://github.com/BazoukaJo/AICheatCheets.git
cd AICheatCheets

# Open in browser (Windows)
start index.html

# Open in browser (macOS)
open index.html

# Open in browser (Linux)
xdg-open index.html
```

## Usage Guide

### Basic Workflow
1. **Browse**: Scroll through prompts or click category buttons to filter
2. **Search**: Type keywords to find specific prompts (e.g., "debug", "optimize", "test")
3. **Copy**: Click the "Copy" button on any prompt card
4. **Paste**: Paste into your AI assistant (ChatGPT, Claude, Copilot Chat, etc.)
5. **Fill Placeholders**: Replace `[bracketed text]` with your specific details
6. **Get Results**: AI generates targeted code, fixes, or documentation

### Example: Using the "Debug Code" Prompt
1. Search for "debug" or press `Q` key
2. Click "Copy" button
3. Paste into ChatGPT/Claude
4. Replace `[language]` with "TypeScript"
5. Replace `[paste code here]` with your buggy code
6. Replace `[describe error]` with "TypeError: Cannot read property 'map' of undefined"
7. Get detailed debugging analysis with fix

### Customizing Prompts
1. Click "Edit" button on any prompt card
2. Modify the template in the modal textarea
3. Click "Save" - changes persist in browser localStorage
4. To revert: Clear browser data or use console: `localStorage.clear()`

### Adding Your Own Prompts
Edit the `fullPrompts` array in `index.html` (around line 1594):

```javascript
{
  id: 53,  // Next sequential ID
  title: "Your Prompt Title",
  category: "debug",  // Must match existing category button
  description: "Brief description under 150 chars",
  template: "Your detailed prompt with [placeholders]...",
  icon: "fas fa-icon-name"  // Font Awesome 6.0 icon
}
```

## Technical Architecture

### Single-File Design Philosophy
- **Everything Embedded**: HTML, CSS (Material Design), JavaScript (vanilla ES6+)
- **Zero Build Tools**: No webpack, Babel, npm, or Node.js required
- **CDN Dependencies**: Font Awesome 6.0.0, Google Fonts (Roboto), DOMPurify 3.0.6
- **localStorage Persistence**: Favorites and edits survive browser restarts

### Performance Optimizations
- **Debounced Search**: 300ms delay prevents excessive re-renders
- **DocumentFragment**: Batch DOM updates for smooth 60 FPS rendering
- **RequestAnimationFrame**: Butter-smooth animations and transitions
- **Event Delegation**: Efficient memory usage with single event listeners
- **Fuzzy Search**: O(n) character matching, not expensive Levenshtein distance

### Browser Storage Schema
```javascript
// localStorage keys
{
  "clineFavorites": [1, 5, 10, 23],  // Array of prompt IDs
  "clineUsageStats": {                // Copy count per day
    "Sat Nov 09 2025": 15,
    "Fri Nov 08 2025": 23
  },
  "clineViewMode": false              // Compact view toggle
}
```

### Security Features
- **DOMPurify Sanitization**: All user inputs cleaned before DOM insertion
- **Content Security Policy**: Restrictive CSP headers prevent XSS attacks
- **Clipboard API**: Secure copy with execCommand fallback
- **No Eval**: Zero use of `eval()` or `Function()` constructors

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support, recommended |
| Firefox | 88+ | Full support |
| Edge | 90+ | Full support |
| Safari | 14+ | Full support |
| Opera | 76+ | Full support |

**Required APIs**: localStorage, Clipboard API (with fallback), ES6+ features (arrow functions, template literals, destructuring, Set, Map)

## Project Structure

```
AICheatCheets/
├── index.html              # Everything in one file!
│   ├── <head>
│   │   ├── CSP meta tags
│   │   ├── CDN links (Font Awesome, Roboto, DOMPurify)
│   │   └── <style> (~900 lines Material Design CSS)
│   ├── <body>
│   │   ├── Header & subtitle
│   │   ├── Search bar & category buttons
│   │   ├── Prompts grid (dynamically rendered)
│   │   └── Edit modal
│   └── <script> (~900 lines vanilla JavaScript)
│       ├── State management (AppState singleton)
│       ├── Prompt data (fullPrompts array - 52 objects)
│       ├── Rendering functions (generatePromptCardHTML)
│       ├── Event listeners & keyboard shortcuts
│       └── localStorage persistence
├── README.md               # This file
└── .github/
    └── copilot-instructions.md  # AI agent development guide
```

## Development Guide

### Adding New Categories
1. Add HTML button in `<nav class="categories">`:
   ```html
   <button class="category-btn" data-category="yourcat">Your Category</button>
   ```
2. Add prompts with matching `category: "yourcat"`
3. Update keyboard shortcut mapping (optional)

### Modifying Styles
All CSS uses CSS custom properties for easy theming:
```css
:root {
  --md-primary: #2196F3;      /* Primary color */
  --md-background: #121212;   /* Background */
  --md-surface: #1E1E1E;      /* Card surface */
}
```

### Debugging Tips
- **Open Browser Console** (F12) to see state and errors
- **Check AppState**: `console.log(AppState)`
- **Test fuzzy search**: `fuzzyMatch("debug code", "dbg")` returns `true`
- **Clear storage**: `localStorage.clear(); location.reload()`
- **Performance testing**: Add 500 test prompts (see `.github/copilot-instructions.md`)

## Contributing

Contributions are welcome! To add prompts or improve functionality:

1. Fork this repository
2. Edit `index.html` (prompts in `fullPrompts` array, line ~1594)
3. Test in multiple browsers
4. Submit a Pull Request with:
   - Description of changes
   - Before/after screenshots (if UI changes)
   - Browser compatibility notes

### Contribution Guidelines
- **Prompts**: Must be actionable, specific, and tested with AI assistants
- **Code**: Follow existing patterns (vanilla JS, no external dependencies)
- **Performance**: Maintain <100ms render times for 52 prompts
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Security**: Sanitize all user inputs with DOMPurify

## FAQ

**Q: Can I use this offline?**
A: Yes! After the first load (which downloads CDN resources), it works completely offline.

**Q: How do I export my favorites and edits?**
A: Use browser DevTools console: `console.log(localStorage.getItem('clineFavorites'))`
Copy the output. To import later: `localStorage.setItem('clineFavorites', '[paste here]')`

**Q: Can I customize the theme?**
A: Yes! Edit CSS variables in `:root` section (line ~14). Change `--md-primary` for accent color.

**Q: Why single file instead of separate JS/CSS?**
A: Maximum portability. Share via email, USB drive, or air-gapped systems without dependency issues.

**Q: What AI assistants work best with these prompts?**
A: All major ones: ChatGPT (GPT-4), Claude (3.5 Sonnet), GitHub Copilot, Google Gemini, Perplexity.

**Q: Can I add my own categories?**
A: Absolutely! See "Adding New Categories" in Development Guide section above.

## License

MIT License - feel free to use, modify, and distribute. Attribution appreciated but not required.

## Acknowledgments

- **Material Design**: Google's design system for dark theme
- **Font Awesome**: Icon library (6.0.0)
- **DOMPurify**: XSS sanitization library
- **Community**: Prompt contributions and feedback

---

**Made with ❤️ for developers who want better AI coding results**

💡 **Tip**: Bookmark `index.html` in your browser for instant access to prompts while coding!

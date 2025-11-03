# AI Prompt Templates - Single File Version

## Overview

This is a standalone, single-file version of the AI Prompt Templates application. All functionality has been consolidated into `index.html`, making it easy to use offline without any build tools or server setup.

## Features

- **Browse Prompts**: Explore 45+ pre-built prompts for various coding tasks like debugging, refactoring, documentation, and more.
- **Search**: Quickly find prompts by keyword in title, description, or content.
- **Category Filtering**: Filter prompts by categories such as Cleanup, Debug, Security, Performance, etc.
- **Copy to Clipboard**: One-click copy of prompt templates to your clipboard.
- **Edit Prompts**: Modify existing prompts and save changes locally (persists via browser localStorage).
- **Favorites**: Mark favorite prompts for quick access.
- **Keyboard Shortcuts**:
  - Ctrl/Cmd + K: Focus search
  - Ctrl/Cmd + F: Toggle favorites view
  - Ctrl/Cmd + Enter: Copy first visible prompt
  - Escape: Clear search and close modals
- **Offline Support**: Works completely offline after loading (requires internet only for initial CDN loads of fonts and icons).

## Usage

1. Open `index.html` directly in any modern web browser (e.g., Chrome, Firefox, Edge).
2. The app loads with all prompts visible.
3. Use the search bar to find specific prompts.
4. Click on category buttons to filter.
5. Click "Copy" on a prompt card to copy the template to your clipboard.
6. Click "Edit" to modify a prompt (changes are saved locally in your browser).
7. Favorites are marked with a star and persist across sessions.

## Technical Notes

- **No Server Required**: Pure client-side JavaScript and CSS.
- **Dependencies**:
  - Font Awesome (icons) via CDN
  - Google Fonts (Roboto) via CDN
  - DOMPurify (sanitization) via CDN
- **Storage**: Uses browser localStorage for favorites and edited prompts.
- **Customization**: Edit the `fullPrompts` array in the `<script>` tag to add or modify prompts.

This version eliminates the need for Node.js, npm, or any build process. Simply open the file and start using it!

## Original Project

This is derived from the original AI Prompt Templates project. For the full source with build tools and more features, refer to the GitHub repository (if available).

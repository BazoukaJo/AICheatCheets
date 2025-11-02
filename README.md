# 🚀 AI Prompt Assistant

**Vibe Coding Made Easy - Quick Copy-Paste Queries for Faster AI Communication!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Categories](#categories)
- [License](#license)

## 🎯 Overview

The **AI Prompt Assistant** is a web-based tool designed to supercharge your workflow when communicating with AI coding assistants. Instead of crafting prompts from scratch, browse through our curated collection of professionally written prompt templates covering everything from code cleanup to complex debugging scenarios.

Whether you're a seasoned developer looking to optimize your AI interactions or a newcomer learning to communicate effectively with coding assistants, this tool provides ready-to-use prompts that you can copy-paste and customize for your specific needs.

## ✨ Features

### 🔍 Smart Search & Filtering
- **Fuzzy Search**: Find prompts instantly with intelligent text matching
- **Category Filtering**: Browse prompts by type (Debug, Clean Up, Add Feature, etc.)
- **Multi-Select Categories**: Combine multiple categories for targeted searches

### ⭐ Favorites System
- **Save Favorites**: Mark frequently used prompts for quick access
- **Persistent Storage**: Your favorites are saved locally in your browser
- **Quick Navigation**: Jump directly to favorite prompts

### ⚡ Quick Actions
- **One-Click Prompts**: Pre-built buttons for common tasks
- **Error Handling**: Add comprehensive error handling to your code
- **Performance Optimization**: Optimize code for speed, memory, or CPU usage
- **Code Refactoring**: Improve code structure and maintainability
- **Documentation**: Generate detailed code documentation

### 🎨 Interactive Features
- **AI Prompt Builder**: Generate custom prompts based on your specific needs
- **Template Customizer**: Create and save your own prompt templates
- **Export Collection**: Download all prompts as JSON for offline use
- **Usage Analytics**: View detailed statistics about your prompt usage patterns

### ⌨️ Power User Features
- **Keyboard Shortcuts**: Master power-user shortcuts for lightning-fast workflow
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **VSCode Dark Theme**: Familiar interface matching your development environment

## 🚀 Quick Start

### Option 1: Live Demo
Visit the live demo at: [Your deployment URL here]

### Option 2: Local Development

1. **Clone or Download** the project files:
   ```bash
   git clone https://github.com/yourusername/ai-prompt-assistant.git
   cd ai-prompt-assistant
   ```

2. **Install Dependencies** (optional, for development):
   ```bash
   npm install
   ```

3. **Development Server**:
   ```bash
   # Start development server with live reload
   npm run dev

   # Or use simple HTTP server
   npm start
   ```
   The app will be available at `http://localhost:3000`

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

6. **Code Quality**:
   ```bash
   # Lint and fix code
   npm run lint

   # Minify JavaScript
   npm run minify
   ```

### Alternative: Open Directly
- Simply open `index.html` in your web browser
- No server required - it's a static web application!

### Start Using:
- Browse categories or use the search bar
- Click "Copy" on any prompt to copy it to your clipboard
- Paste into your AI coding assistant

## 📖 Usage

### Basic Workflow

1. **Find a Prompt**:
   - Use the search bar to find specific prompts
   - Browse by categories using the filter buttons
   - Check your favorites for frequently used prompts

2. **Customize**:
   - Replace `[paste code here]` with your actual code
   - Fill in placeholders like `[describe symptom]` with your specific details
   - Adjust the prompt to match your exact needs

3. **Copy & Use**:
   - Click the "Copy" button to copy the prompt to clipboard
   - Paste into your AI coding assistant (Cline, GitHub Copilot, etc.)
   - Get instant, professional-quality assistance

### Advanced Features

#### AI Prompt Builder
Create custom prompts tailored to your specific needs:
- Select the type of task (cleanup, debug, feature, etc.)
- Specify the programming language
- Add detailed requirements
- Generate a personalized prompt

#### Template Editor
Design your own reusable prompt templates:
- Use `[placeholder]` syntax for customizable fields
- Save templates for future use
- Build a personal prompt library

#### Analytics Dashboard
Track your usage patterns:
- View total prompts used
- See your most popular categories
- Monitor favorite prompt usage
- Export usage data for analysis

## ⌨️ Keyboard Shortcuts

### Navigation
- `Ctrl/Cmd + K`: Focus search bar
- `Ctrl/Cmd + F`: Toggle favorites view
- `Ctrl/Cmd + E`: Export prompts
- `Ctrl/Cmd + Enter`: Copy first result
- `Escape`: Clear search

### Category Shortcuts
- `1`: All categories
- `2`: Clean Up
- `3`: Document
- `4`: Repair
- `5`: Explain
- `6`: Add Feature
- `7`: Remove
- `8`: Refactor
- `9`: Generate
- `0`: Optimize
- `Q`: Debug
- `W`: Convert
- `E`: Test
- `R`: Security
- `T`: Architecture
- `Y`: Review
- `U`: Testing
- `I`: Performance
- `O`: Database
- `P`: API
- `A`: DevOps
- `S`: Analysis
- `D`: Concurrency
- `F`: Prototype
- `G`: Documentation

## 📂 Categories

### 🔥 High Priority (Daily Use)
- **Clean Up**: Remove redundancies, format code, suggest improvements
- **Debug**: Find and fix issues with step-by-step reasoning
- **Explain**: Break down code with detailed analysis
- **Add Feature**: Integrate new functionality seamlessly
- **Generate Tests**: Create comprehensive unit tests

### 🟡 Medium Priority (Common Tasks)
- **Optimize**: Improve performance, memory usage, or speed
- **Document**: Add detailed comments and documentation
- **Refactor**: Apply specific refactoring changes
- **Security Audit**: Identify and fix security vulnerabilities
- **API Development**: Build robust RESTful APIs

### 🔵 Standard Priority (Regular Tasks)
- **Repair**: Fix bugs and explain changes made
- **Code Review**: Comprehensive code review and feedback
- **Testing Strategy**: Complete testing strategies and plans
- **System Architecture**: Design scalable system architectures
- **Database Design**: Design optimized database structures

### 🟢 Specialized Tasks
- **Convert**: Translate code between programming languages
- **Migration**: Migrate code between frameworks/libraries
- **Configuration**: Debug and fix configuration problems
- **Deployment**: Troubleshoot and fix deployment issues
- **Concurrency**: Thread safety and concurrent programming

### 📚 Documentation & Cleanup
- **Code Documentation**: Comprehensive documentation generation
- **API Documentation**: Document APIs with request/response formats
- **Style Guide**: Follow specific coding standards
- **Technical Debt**: Identify and prioritize technical debt

### Adding New Prompts
1. Fork the repository
2. Add your prompt to the `prompts` array in `index.html`
3. Follow the existing prompt structure:
   ```javascript
   {
       id: [unique_number],
       title: "Your Prompt Title",
       category: "category_name",
       description: "Brief description of what the prompt does",
       template: "Your detailed prompt template with [placeholders]",
       icon: "fas fa-icon-name"
   }
   ```
4. Test your prompt works correctly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

**Permissions:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

**Limitations:**
- ❌ Liability
- ❌ Warranty

**Conditions:**
- ℹ️ License and copyright notice

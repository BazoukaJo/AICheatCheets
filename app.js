// Cline AI Prompt Assistant - Main Application Logic
// State management with error handling
const AppState = {
  currentCategory: 'all',
  selectedCategories: new Set(['all']),
  searchTerm: '',
  favorites: [],
  usageStats: {},
  prompts: []
};

// Embedded prompts data for static app compatibility
const embeddedPrompts = [
  {
    'id': 1,
    'title': 'Evaluate Completed App',
    'category': 'review',
    'description': 'Comprehensive assessment of finished applications',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a senior software architect. Evaluate this completed application: [paste app code/details]. Assess: overall functionality and user experience. Identify performance bottlenecks and scalability potential. Check for security vulnerabilities and code quality issues. Evaluate maintainability. Provide detailed feedback with prioritized improvement recommendations and implementation suggestions.',
    'icon': 'fas fa-clipboard-check'
  },
  {
    'id': 2,
    'title': 'Clean Up Code',
    'category': 'cleanup',
    'description': 'Remove redundancies, format properly, and suggest improvements',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code style expert. Clean up this [language] code for better readability and efficiency: [paste code here]. Focus on: removing unused imports/variables. Improving naming conventions. Fixing formatting and indentation. Eliminating redundancies. Adding comments where needed. Preserve all functionality. Output: cleaned code in a code block, followed by suggestions for further improvements.',
    'icon': 'fas fa-broom'
  },
  {
    'id': 3,
    'title': 'Debug Code',
    'category': 'debug',
    'description': 'Find and fix issues with step-by-step reasoning',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a senior debugger. Debug this [language] code: [paste code here]. It\'s not working as expected—[describe symptom, e.g., \'throws error X\' or \'returns wrong value\']. Provide step-by-step reasoning: check inputs, examine logic flow, identify potential causes, and suggest targeted fixes with explanations.',
    'icon': 'fas fa-bug'
  },
  {
    'id': 4,
    'title': 'Explain Code',
    'category': 'explain',
    'description': 'Break down code step by step with analysis',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code educator. Explain this [language] code step by step: [paste code here]. Break down what each part does, why it\'s structured this way, and any potential issues.',
    'icon': 'fas fa-search'
  },
  {
    'id': 5,
    'title': 'Add Specific Feature',
    'category': 'feature',
    'description': 'Integrate new functionality seamlessly',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a feature engineer. Add [describe feature, e.g., user authentication] to this existing [language] code: [paste code here]. Integrate it seamlessly and handle any dependencies.',
    'icon': 'fas fa-plus-circle'
  },
  {
    'id': 6,
    'title': 'Generate Tests',
    'category': 'test',
    'description': 'Create comprehensive unit tests',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a QA engineer. Write unit tests for this [language] function/code: [paste code here]. Cover edge cases and use [framework, e.g., Jest].',
    'icon': 'fas fa-vial'
  },
  {
    'id': 7,
    'title': 'Optimize Code',
    'category': 'optimize',
    'description': 'Improve performance, memory usage, or speed',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a performance optimizer. Optimize this [language] code for [aspect, e.g., speed/memory/CPU usage]: [paste code here]. Focus on: algorithmic improvements, memory management, reducing complexity, and eliminating bottlenecks. Provide before/after performance comparisons.',
    'icon': 'fas fa-tachometer-alt'
  },
  {
    'id': 8,
    'title': 'Document Features',
    'category': 'document',
    'description': 'Add detailed comments and documentation',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a technical writer. Add detailed documentation to this code or feature: [paste code or describe feature]. Include comments explaining each section, inputs, outputs, and usage examples.',
    'icon': 'fas fa-book'
  },
  {
    'id': 9,
    'title': 'Refactor with Changes',
    'category': 'refactor',
    'description': 'Apply specific refactoring changes',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a refactoring specialist. Refactor this [language] code with these specific changes: [list changes, e.g., make it asynchronous and optimize loops]: [paste code here]. Maintain original behavior.',
    'icon': 'fas fa-code-branch'
  },
  {
    'id': 10,
    'title': 'Security Audit',
    'category': 'security',
    'description': 'Identify and fix security vulnerabilities',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a security expert. Perform a security audit on this [language] code: [paste code here]. Identify vulnerabilities like [specific concerns, e.g., SQL injection] and suggest fixes.',
    'icon': 'fas fa-shield-alt'
  },
  {
    'id': 11,
    'title': 'API Development',
    'category': 'api',
    'description': 'Build robust RESTful APIs',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a backend developer. Create a RESTful API for [resource] with CRUD operations, input validation, error handling, rate limiting, caching, and comprehensive OpenAPI documentation.',
    'icon': 'fas fa-plug'
  },
  {
    'id': 12,
    'title': 'Repair Code',
    'category': 'repair',
    'description': 'Fix bugs and explain the changes made',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code repair specialist. Repair this broken [language] code: [paste code here]. It\'s producing [describe error or issue]. Fix the bugs and explain the changes.',
    'icon': 'fas fa-tools'
  },
  {
    'id': 13,
    'title': 'Generate New Code',
    'category': 'generate',
    'description': 'Create new scripts or applications from scratch',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code generator. Generate a [language] script that [full description, e.g., fetches weather data via API and displays it in a CLI]. Include error handling.',
    'icon': 'fas fa-magic'
  },
  {
    'id': 14,
    'title': 'Code Review Analysis',
    'category': 'review',
    'description': 'Comprehensive code review and feedback',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code reviewer. Perform a comprehensive code review of [paste code] focusing on: maintainability, performance bottlenecks, security vulnerabilities, and best practices. Provide actionable recommendations.',
    'icon': 'fas fa-search-plus'
  },
  {
    'id': 15,
    'title': 'Testing Strategy',
    'category': 'testing',
    'description': 'Complete testing strategies and plans',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a test strategist. Generate a complete testing strategy for [application/feature] including: unit tests, integration tests, E2E tests, performance benchmarks, and test automation setup.',
    'icon': 'fas fa-vial'
  },
  {
    'id': 16,
    'title': 'Create Full App Prototype',
    'category': 'generate',
    'description': 'Build complete application prototypes',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a full-stack developer. Build a simple [app type, e.g., task manager] app in [stack, e.g., React with Node backend]. Include [key features, e.g., user login, CRUD operations].',
    'icon': 'fas fa-rocket'
  },
  {
    'id': 17,
    'title': 'System Architecture Design',
    'category': 'architecture',
    'description': 'Design scalable system architectures',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a system architect. Design a scalable microservices architecture for [app type] with [specific requirements]. Include service boundaries, API contracts, data flow diagrams, and deployment strategy.',
    'icon': 'fas fa-sitemap'
  },
  {
    'id': 18,
    'title': 'Database Schema Design',
    'category': 'database',
    'description': 'Design optimized database structures',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a database designer. Design a normalized database schema for [application] with proper relationships, indexes, and constraints. Include migration scripts and performance optimization strategies.',
    'icon': 'fas fa-database'
  },
  {
    'id': 19,
    'title': 'Performance Profiling',
    'category': 'performance',
    'description': 'Identify and fix performance bottlenecks',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a performance profiler. Profile and optimize this [language] code for [specific metric: speed/memory/CPU]. Identify bottlenecks, suggest algorithmic improvements, and provide benchmarking code.',
    'icon': 'fas fa-tachometer-alt'
  },
  {
    'id': 20,
    'title': 'CI/CD Pipeline',
    'category': 'devops',
    'description': 'Automated deployment pipelines',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a DevOps engineer. Generate a complete CI/CD pipeline for [tech stack] including: automated testing, security scanning, deployment to [platform], monitoring setup, and rollback strategies.',
    'icon': 'fas fa-cogs'
  },
  {
    'id': 21,
    'title': 'Technical Debt Analysis',
    'category': 'analysis',
    'description': 'Identify and prioritize technical debt',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a technical debt analyst. Analyze this codebase for technical debt and provide a prioritized refactoring plan with effort estimates, risk assessments, and business impact analysis.',
    'icon': 'fas fa-chart-line'
  },
  {
    'id': 22,
    'title': 'Convert Code Languages',
    'category': 'convert',
    'description': 'Translate code between programming languages',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code translator. Convert this [source language] code to [target language]: [paste code here]. Preserve all functionality and add comments.',
    'icon': 'fas fa-exchange-alt'
  },
  {
    'id': 23,
    'title': 'Migration Guide',
    'category': 'convert',
    'description': 'Migrate code between frameworks, libraries, or versions',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a migration expert. Help migrate this [current tech/library] code to [target tech/library]: [paste code here]. Include: breaking changes to handle, new patterns to adopt, testing strategy, and rollback plan.',
    'icon': 'fas fa-arrows-alt'
  },
  {
    'id': 24,
    'title': 'Configuration Issues',
    'category': 'debug',
    'description': 'Debug and fix configuration problems',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a config troubleshooter. Debug this configuration issue: [describe problem, e.g., \'app won\'t start\' or \'feature not working\']. Configuration files: [paste relevant configs]. Environment: [describe setup]. Identify root cause and provide solution.',
    'icon': 'fas fa-cogs'
  },
  {
    'id': 25,
    'title': 'Deployment Issues',
    'category': 'devops',
    'description': 'Troubleshoot and fix deployment problems',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a deployment specialist. Fix this deployment issue: [describe problem, e.g., \'build fails in CI\' or \'app crashes in production\']. Environment: [dev/staging/prod]. Logs: [paste relevant logs]. Deployment config: [paste config]. Provide root cause and fix.',
    'icon': 'fas fa-server'
  },
  {
    'id': 26,
    'title': 'Concurrency Analysis',
    'category': 'concurrency',
    'description': 'Thread safety and concurrent programming',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a concurrency expert. Review this [language] code for concurrency issues, race conditions, deadlocks, and thread safety problems. Suggest proper synchronization patterns and testing strategies.',
    'icon': 'fas fa-sync'
  },
  {
    'id': 27,
    'title': 'Code Documentation',
    'category': 'documentation',
    'description': 'Comprehensive documentation generation',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a documentation engineer. Generate comprehensive documentation for [code/project] including: API references, usage examples, architecture diagrams, setup instructions, and troubleshooting guides.',
    'icon': 'fas fa-book-open'
  },
  {
    'id': 28,
    'title': 'Document API Endpoint',
    'category': 'document',
    'description': 'Document APIs with request/response formats',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as an API documenter. Document this API endpoint: [paste code or describe]. Include request/response formats, error handling, and example calls.',
    'icon': 'fas fa-plug'
  },
  {
    'id': 29,
    'title': 'Clean Up with Style Guide',
    'category': 'cleanup',
    'description': 'Follow specific coding standards and style guides',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a style enforcer. Clean up this [language] code to follow [style guide, e.g., PEP 8 for Python]: [paste code here]. Focus on indentation, variable naming, and removing unused imports.',
    'icon': 'fas fa-palette'
  },
  {
    'id': 30,
    'title': 'Refactor for Scalability',
    'category': 'refactor',
    'description': 'Optimize code for production scalability',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a scalability engineer. Refactor this [language] code for scalability [changes, e.g., add caching and parallel processing]: [paste code here]. Test for performance gains.',
    'icon': 'fas fa-chart-line'
  },
  {
    'id': 31,
    'title': 'Rapid Prototyping',
    'category': 'prototype',
    'description': 'Quick working prototypes',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a prototyper. Build a working prototype of [feature] using [tech stack] with authentication, database integration, basic UI, error handling, and input validation. Focus on core functionality.',
    'icon': 'fas fa-rocket'
  },
  {
    'id': 32,
    'title': 'Repair Runtime Issues',
    'category': 'repair',
    'description': 'Fix crashing code with stack trace analysis',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a runtime fixer. Repair this [language] code that\'s crashing at runtime: [paste code here]. The stack trace is [paste trace]. Suggest preventive measures.',
    'icon': 'fas fa-exclamation-triangle'
  },
  {
    'id': 33,
    'title': 'Explain with Comparison',
    'category': 'explain',
    'description': 'Compare code approaches and their trade-offs',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code comparator. Explain this [language] code and compare it to [alternative approach]: [paste code here]. Highlight pros, cons, and when to use each.',
    'icon': 'fas fa-balance-scale'
  },
  {
    'id': 34,
    'title': 'Add Feature with Library',
    'category': 'feature',
    'description': 'Add features using specific libraries or frameworks',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a library integrator. Add [feature, e.g., email notifications] using [library, e.g., SendGrid] to this [language] code: [paste code here]. Ensure it\'s secure and testable.',
    'icon': 'fas fa-cubes'
  },
  {
    'id': 35,
    'title': 'Remove References',
    'category': 'remove',
    'description': 'Remove libraries, variables, or deprecated elements',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a cleanup specialist. Remove all references to [specify what to remove, e.g., a library or variable] from this [language] code: [paste code here]. Replace with alternatives if needed to keep it functional.',
    'icon': 'fas fa-trash'
  },
  {
    'id': 36,
    'title': 'Remove Deprecated Elements',
    'category': 'remove',
    'description': 'Update deprecated code to modern equivalents',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a modernization expert. Remove deprecated [element, e.g., API calls] from this [language] code and update to modern equivalents: [paste code here].',
    'icon': 'fas fa-recycle'
  },
  {
    'id': 37,
    'title': 'Edge Case Testing',
    'category': 'test',
    'description': 'Identify and test edge cases thoroughly',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as an edge case tester. Analyze this [language] function/code for edge cases: [paste code here]. Identify: boundary conditions, error inputs, race conditions, and unusual but valid scenarios. Write tests covering all edge cases.',
    'icon': 'fas fa-exclamation-circle'
  },
  {
    'id': 38,
    'title': 'Code Review Feedback',
    'category': 'review',
    'description': 'Provide constructive feedback on code changes',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a peer reviewer. Review this code change/diff: [paste code or diff]. Provide constructive feedback on: code quality, potential bugs, performance implications, security concerns, and best practices. Suggest specific improvements.',
    'icon': 'fas fa-comments'
  }
];

// Load prompts from external JSON file (optional enhancement)
async function loadPrompts() {
  try {
    // Only attempt to load if we're running on a server (not file:// protocol)
    if (window.location.protocol !== 'file:') {
      const response = await fetch('prompts.json');
      if (response.ok) {
        const externalPrompts = await response.json();
        if (externalPrompts && externalPrompts.length > 0) {
          AppState.prompts = externalPrompts;
          console.log(`Loaded ${AppState.prompts.length} prompts from external file`);
          return;
        }
      }
    }
    // Fallback to embedded prompts
    AppState.prompts = embeddedPrompts;
    console.log('Using embedded prompts (fetch not available or failed)');
  } catch (error) {
    console.log('Error loading prompts:', error.message);
    AppState.prompts = embeddedPrompts;
  }
}

// Initialize state with error handling
async function initializeState() {
  await loadPrompts();

  try {
    const storedFavorites = localStorage.getItem('clineFavorites');
    AppState.favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.warn('Failed to load favorites from localStorage:', error);
    AppState.favorites = [];
  }

  try {
    const storedStats = localStorage.getItem('clineUsageStats');
    AppState.usageStats = storedStats ? JSON.parse(storedStats) : {};
  } catch (error) {
    console.warn('Failed to load usage stats from localStorage:', error);
    AppState.usageStats = {};
  }
}

// Utility functions
function saveToStorage() {
  try {
    localStorage.setItem('clineFavorites', JSON.stringify(AppState.favorites));
    localStorage.setItem('clineUsageStats', JSON.stringify(AppState.usageStats));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    showToast('Failed to save preferences', 'error');
  }
}

// Debounce utility for performance optimization
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Fuzzy search implementation
function fuzzyMatch(text, query) {
  if (!query) return true;
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match gets highest priority
  if (textLower.includes(queryLower)) return true;

  // Simple fuzzy matching - check if all query characters appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === queryLower.length;
}

// Highlight search matches
function highlightMatches(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function trackUsage(promptId) {
  const today = new Date().toDateString();
  AppState.usageStats[today] = (AppState.usageStats[today] || 0) + 1;
  saveToStorage();
}

function toggleFavorite(promptId) {
  const index = AppState.favorites.indexOf(promptId);
  if (index > -1) {
    AppState.favorites.splice(index, 1);
  } else {
    AppState.favorites.push(promptId);
  }
  saveToStorage();
  renderPrompts();
  renderFavorites();
}

function isFavorite(promptId) {
  return AppState.favorites.includes(promptId);
}

function renderPrompts() {
  const grid = document.getElementById('promptsGrid');
  const filteredPrompts = AppState.prompts.filter(prompt => {
    const matchesCategory = AppState.selectedCategories.has('all') || AppState.selectedCategories.has(prompt.category);
    const matchesSearch = fuzzyMatch(prompt.title, AppState.searchTerm) ||
                          fuzzyMatch(prompt.description, AppState.searchTerm) ||
                          fuzzyMatch(prompt.template, AppState.searchTerm);
    return matchesCategory && matchesSearch;
  });

  const sanitizedHTML = filteredPrompts.map(prompt => {
    // Sanitize user inputs
    const safeTitle = DOMPurify.sanitize(prompt.title);
    const safeDescription = DOMPurify.sanitize(prompt.description);
    const safeIcon = DOMPurify.sanitize(prompt.icon);

    const templateWithPlaceholders = prompt.template.replace(/\[([^\]]+)\]/g, '<span class="placeholder" onclick="fillPlaceholder(\'$1\')">[$1]</span>');
    const highlightedTitle = highlightMatches(safeTitle, AppState.searchTerm);
    const highlightedDescription = highlightMatches(safeDescription, AppState.searchTerm);
    const highlightedTemplate = highlightMatches(templateWithPlaceholders, AppState.searchTerm);
    const isFav = isFavorite(prompt.id);

    return `
            <div class="prompt-card ${isFav ? 'favorite' : ''}">
                <div class="prompt-header">
                    <div class="prompt-title">
                        <i class="${safeIcon}"></i> ${highlightedTitle}
                    </div>
                    <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${prompt.id})" title="Add to favorites">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
                <div class="prompt-description">${highlightedDescription}</div>
                <div class="prompt-template">${highlightedTemplate}</div>
                <div class="prompt-actions">
                    <button class="btn btn-primary copy-btn" data-template="${JSON.stringify(prompt.template).slice(1, -1)}" data-prompt-id="${prompt.id}">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="btn btn-secondary edit-btn" data-template="${JSON.stringify(prompt.template).slice(1, -1)}" data-prompt-id="${prompt.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;
  }).join('');

  grid.innerHTML = DOMPurify.sanitize(sanitizedHTML, { ALLOWED_TAGS: ['div', 'span', 'button', 'i', 'mark'], ALLOWED_ATTR: ['class', 'onclick', 'title', 'data-template', 'data-prompt-id'] });

  // Add animation delay to cards
  const cards = grid.querySelectorAll('.prompt-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('pulse');
  });

  // Add event listeners for copy and edit buttons
  const copyButtons = grid.querySelectorAll('.copy-btn');
  const editButtons = grid.querySelectorAll('.edit-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const template = e.target.closest('.copy-btn').dataset.template;
      const promptId = parseInt(e.target.closest('.copy-btn').dataset.promptId);
      copyToClipboard(template, promptId);
    });
  });

  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const template = e.target.closest('.edit-btn').dataset.template;
      const promptId = parseInt(e.target.closest('.edit-btn').dataset.promptId);
      editPrompt(template, promptId);
    });
  });
}

function renderFavorites() {
  const favoritesSection = document.getElementById('favoritesSection');
  const favoritesGrid = document.getElementById('favoritesGrid');

  if (AppState.favorites.length === 0) {
    favoritesSection.style.display = 'none';
    return;
  }

  favoritesSection.style.display = 'block';
  const favoritePrompts = AppState.prompts.filter(prompt => AppState.favorites.includes(prompt.id));

  favoritesGrid.innerHTML = favoritePrompts.map(prompt => `
        <div class="favorite-chip" onclick="scrollToPrompt(${prompt.id})">
            <i class="${prompt.icon}"></i> ${prompt.title}
        </div>
    `).join('');
}

function scrollToPrompt(promptId) {
  const promptCard = document.querySelector(`[onclick*="toggleFavorite(${promptId})"]`).closest('.prompt-card');
  promptCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  promptCard.classList.add('pulse');
  setTimeout(() => promptCard.classList.remove('pulse'), 1000);
}

function copyToClipboard(text, promptId) {
  // Enhanced clipboard handling with better error feedback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard! 📋', 'success');
      if (promptId) trackUsage(promptId);
    }).catch((error) => {
      console.warn('Clipboard API failed:', error);
      fallbackCopyToClipboard(text, promptId);
    });
  } else {
    fallbackCopyToClipboard(text, promptId);
  }
}

function fallbackCopyToClipboard(text, promptId) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      showToast('Copied to clipboard! 📋', 'success');
      if (promptId) trackUsage(promptId);
    } else {
      throw new Error('execCommand failed');
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    showToast('Copy failed. Please select and copy manually.', 'error');
    // Fallback: Select the text in a temporary element for manual copy
    const tempDiv = document.createElement('div');
    tempDiv.textContent = text;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-999999px';
    tempDiv.style.opacity = '0';
    document.body.appendChild(tempDiv);
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    showToast('Text selected for manual copy.', 'info');
    setTimeout(() => {
      document.body.removeChild(tempDiv);
      selection.removeAllRanges();
    }, 5000);
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function fillPlaceholder(placeholder) {
  const value = prompt(`Enter value for "${placeholder}":`);
  if (value) {
    // In a real implementation, this would update the template
    showToast(`Placeholder filled: ${value}`, 'success');
  }
}

function editPrompt(template, promptId) {
  const newTemplate = prompt('Edit the prompt template:', template);
  if (newTemplate && newTemplate !== template) {
    showToast('Template editing coming soon! 💡', 'warning');
  }
}

function quickAction(type) {
  const templates = {
    'error-handling': 'Add comprehensive error handling to this code: [paste code here]. Include try-catch blocks, input validation, and graceful error messages.',
    'optimize': 'Optimize this code for better performance: [paste code here]. Focus on [speed/memory/CPU usage] and suggest algorithmic improvements.',
    'refactor': 'Refactor this code for better maintainability: [paste code here]. Improve structure, naming, and remove code smells while preserving functionality.',
    'document': 'Add comprehensive documentation to this code: [paste code here]. Include function descriptions, parameter explanations, and usage examples.'
  };

  if (templates[type]) {
    copyToClipboard(templates[type]);
  }
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

function openPromptBuilder() {
  const content = document.getElementById('promptBuilderContent');
  content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">What do you want to do?</label>
            <select id="actionType" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary);">
                <option value="cleanup">Clean up code</option>
                <option value="debug">Debug an issue</option>
                <option value="feature">Add a feature</option>
                <option value="optimize">Optimize performance</option>
                <option value="document">Add documentation</option>
                <option value="refactor">Refactor code</option>
            </select>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Programming language:</label>
            <input type="text" id="language" placeholder="e.g., JavaScript, Python, Java" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary);">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Specific details:</label>
            <textarea id="details" placeholder="Describe what you need help with..." rows="4" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); resize: vertical;"></textarea>
        </div>
        <button class="btn btn-primary" onclick="generateCustomPrompt()" style="width: 100%;">
            <i class="fas fa-magic"></i> Generate Custom Prompt
        </button>
    `;
  openModal('promptBuilderModal');
}

function generateCustomPrompt() {
  const action = document.getElementById('actionType').value;
  const language = document.getElementById('language').value;
  const details = document.getElementById('details').value;

  const customPrompt = `Please ${action} this ${language || 'code'}: [paste code here]. ${details ? 'Additional details: ' + details : ''}. Provide a complete solution with explanations.`;

  copyToClipboard(customPrompt);
  closeModal('promptBuilderModal');
}

function openTemplateEditor() {
  const content = document.getElementById('templateEditorContent');
  content.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p>Create your own custom prompt template. Use [placeholder] syntax for fillable fields.</p>
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Template Title:</label>
            <input type="text" id="templateTitle" placeholder="My Custom Prompt" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary);">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500;">Prompt Template:</label>
            <textarea id="customTemplate" placeholder="Please [action] this [language] code: [paste code here]. [additional instructions]" rows="6" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); resize: vertical; font-family: 'JetBrains Mono', monospace;"></textarea>
        </div>
        <button class="btn btn-success" onclick="saveCustomTemplate()" style="width: 100%;">
            <i class="fas fa-save"></i> Save Template
        </button>
    `;
  openModal('templateEditorModal');
}

function saveCustomTemplate() {
  const title = document.getElementById('templateTitle').value;
  const template = document.getElementById('customTemplate').value;

  if (!title || !template) {
    showToast('Please fill in both title and template', 'error');
    return;
  }

  showToast('Custom template saved! (Feature coming soon)', 'success');
  closeModal('templateEditorModal');
}

function exportPrompts() {
  const data = {
    prompts: AppState.prompts,
    favorites: AppState.favorites,
    usageStats: AppState.usageStats,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cline-prompts-backup.json';
  a.click();
  URL.revokeObjectURL(url);

  showToast('Prompts exported successfully! 📁', 'success');
}

function showAnalytics() {
  const content = document.getElementById('analyticsContent');
  const totalUsage = Object.values(AppState.usageStats).reduce((a, b) => a + b, 0);
  const favoriteCategories = AppState.favorites.map(id => AppState.prompts.find(p => p.id === id)?.category)
    .reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

  // Sanitize category names
  const safeCategoriesHTML = Object.entries(favoriteCategories).map(([cat, count]) => {
    const safeCat = DOMPurify.sanitize(cat);
    return `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="text-transform: capitalize;">${safeCat}</span>
                    <span style="font-weight: bold;">${count}</span>
                </div>`;
  }).join('') || '<p style="color: var(--text-secondary);">No favorites yet</p>';

  const analyticsHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; padding: 20px; background: var(--bg-card); border-radius: 12px;">
                <div style="font-size: 2em; font-weight: bold; color: var(--primary-gradient);">${totalUsage}</div>
                <div style="color: var(--text-secondary);">Total Uses</div>
            </div>
            <div style="text-align: center; padding: 20px; background: var(--bg-card); border-radius: 12px;">
                <div style="font-size: 2em; font-weight: bold; color: #ffd700;">${AppState.favorites.length}</div>
                <div style="color: var(--text-secondary);">Favorites</div>
            </div>
            <div style="text-align: center; padding: 20px; background: var(--bg-card); border-radius: 12px;">
                <div style="font-size: 2em; font-weight: bold; color: var(--success-color);">${AppState.prompts.length}</div>
                <div style="color: var(--text-secondary);">Prompts</div>
            </div>
        </div>
        <div style="background: var(--bg-card); padding: 20px; border-radius: 12px;">
            <h4 style="margin-bottom: 15px; color: var(--text-primary);">Favorite Categories</h4>
            ${safeCategoriesHTML}
        </div>
    `;

  content.innerHTML = DOMPurify.sanitize(analyticsHTML, { ALLOWED_TAGS: ['div', 'span', 'h4', 'p'], ALLOWED_ATTR: ['style'] });
  openModal('analyticsModal');
}

function openKeyboardShortcuts() {
  openModal('shortcutsModal');
}

function sharePrompt() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('App URL copied to clipboard! 🔗', 'success');
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const isCtrlOrCmd = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();

  // Category shortcuts (numbers and letters)
  const categoryShortcuts = {
    '1': 'all', '2': 'cleanup', '3': 'document', '4': 'repair', '5': 'explain',
    '6': 'feature', '7': 'remove', '8': 'refactor', '9': 'generate', '0': 'optimize',
    'q': 'debug', 'w': 'convert', 'e': 'test', 'r': 'security', 't': 'architecture',
    'y': 'review', 'u': 'testing', 'i': 'performance', 'o': 'database', 'p': 'api',
    'a': 'devops', 's': 'analysis', 'd': 'concurrency', 'f': 'prototype', 'g': 'documentation'
  };

  if (categoryShortcuts[key]) {
    e.preventDefault();
    const categoryBtn = document.querySelector(`[data-shortcut="${key.toUpperCase()}"]`) ||
                           document.querySelector(`[data-shortcut="${key}"]`);
    if (categoryBtn) {
      categoryBtn.click();
      showToast(`Selected ${categoryBtn.textContent.trim()}`, 'success');
    }
    return;
  }

  switch(key) {
  case 'k':
    if (isCtrlOrCmd) {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    break;
  case 'f':
    if (isCtrlOrCmd) {
      e.preventDefault();
      toggleFavoritesView();
    }
    break;
  case 'e':
    if (isCtrlOrCmd) {
      e.preventDefault();
      exportPrompts();
    }
    break;
  case 'escape':
    document.getElementById('searchInput').value = '';
    AppState.searchTerm = '';
    renderPrompts();
    break;
  case 'enter':
    if (isCtrlOrCmd) {
      e.preventDefault();
      const firstCard = document.querySelector('.prompt-card');
      if (firstCard) {
        const copyBtn = firstCard.querySelector('.btn-primary');
        copyBtn.click();
      }
    }
    break;
  }
});

function toggleFavoritesView() {
  const favoritesSection = document.getElementById('favoritesSection');
  if (favoritesSection.style.display === 'none' || !favoritesSection.style.display) {
    favoritesSection.style.display = 'block';
    showToast('Showing favorites', 'success');
  } else {
    favoritesSection.style.display = 'none';
    showToast('Hiding favorites', 'warning');
  }
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', debounce((e) => {
  AppState.searchTerm = e.target.value;
  renderPrompts();
}, 300));

document.getElementById('categories').addEventListener('click', (e) => {
  if (e.target.classList.contains('category-btn')) {
    const category = e.target.dataset.category;

    if (category === 'all') {
      // "All" category is special - clicking it selects only "all"
      AppState.selectedCategories.clear();
      AppState.selectedCategories.add('all');
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    } else {
      // Multi-select for other categories
      if (AppState.selectedCategories.has('all')) {
        AppState.selectedCategories.clear();
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      }

      if (AppState.selectedCategories.has(category)) {
        AppState.selectedCategories.delete(category);
        e.target.classList.remove('active');
        // If no categories selected, default to "all"
        if (AppState.selectedCategories.size === 0) {
          AppState.selectedCategories.add('all');
          document.querySelector('[data-category="all"]').classList.add('active');
        }
      } else {
        AppState.selectedCategories.add(category);
        e.target.classList.add('active');
      }
    }

    renderPrompts();
  }
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});

// Initialize application
async function initializeApp() {
  await initializeState();
  renderPrompts();
  renderFavorites();
}

// Start the application
initializeApp();

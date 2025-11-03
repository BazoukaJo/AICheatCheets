/**
 * Cline AI Prompt Assistant - Main Application Logic
 * A web application for managing and using AI coding prompts
 *
 * @fileoverview Main application logic for the Cline AI Prompt Assistant
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * Global application state management
 * @typedef {Object} AppState
 * @property {string} currentCategory - Currently selected category
 * @property {Set<string>} selectedCategories - Set of selected category filters
 * @property {string} searchTerm - Current search query
 * @property {number[]} favorites - Array of favorite prompt IDs
 * @property {Object.<string, number>} usageStats - Usage statistics by date
 * @property {Prompt[]} prompts - Array of available prompts
 */

/** @type {AppState} */
const AppState = {
  currentCategory: 'all',
  selectedCategories: new Set(['all']),
  searchTerm: '',
  favorites: [],
  usageStats: {},
  prompts: []
};

// Embedded prompts data for static app compatibility - Sorted by priority/usefulness
const embeddedPrompts = [
  // HIGH PRIORITY - Most frequently used and critical tasks
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
    'id': 2,
    'title': 'Clean Up Code',
    'category': 'cleanup',
    'description': 'Remove redundancies, format properly, and suggest improvements',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code style expert. Clean up this [language] code for better readability and efficiency: [paste code here]. Focus on: removing unused imports/variables. Improving naming conventions. Fixing formatting and indentation. Eliminating redundancies. Adding comments where needed. Preserve all functionality. Output: cleaned code in a code block, followed by suggestions for further improvements.',
    'icon': 'fas fa-broom'
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
    'id': 10,
    'title': 'Security Audit',
    'category': 'security',
    'description': 'Identify and fix security vulnerabilities',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a security expert. Perform a security audit on this [language] code: [paste code here]. Identify vulnerabilities like [specific concerns, e.g., SQL injection] and suggest fixes.',
    'icon': 'fas fa-shield-alt'
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
    'id': 12,
    'title': 'Repair Code',
    'category': 'repair',
    'description': 'Fix bugs and explain the changes made',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code repair specialist. Repair this broken [language] code: [paste code here]. It\'s producing [describe error or issue]. Fix the bugs and explain the changes.',
    'icon': 'fas fa-tools'
  },
  {
    'id': 9,
    'title': 'Refactor with Changes',
    'category': 'refactor',
    'description': 'Apply specific refactoring changes',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a refactoring specialist. Refactor this [language] code with these specific changes: [list changes, e.g., make it asynchronous and optimize loops]: [paste code here]. Maintain original behavior.',
    'icon': 'fas fa-code-branch'
  },

  // MEDIUM PRIORITY - Useful but less frequently used
  {
    'id': 13,
    'title': 'Generate New Code',
    'category': 'generate',
    'description': 'Create new scripts or applications from scratch',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code generator. Generate a [language] script that [full description, e.g., fetches weather data via API and displays it in a CLI]. Include error handling.',
    'icon': 'fas fa-magic'
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
    'id': 11,
    'title': 'API Development',
    'category': 'api',
    'description': 'Build robust RESTful APIs',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a backend developer. Create a RESTful API for [resource] with CRUD operations, input validation, error handling, rate limiting, caching, and comprehensive OpenAPI documentation.',
    'icon': 'fas fa-plug'
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
    'id': 17,
    'title': 'System Architecture Design',
    'category': 'architecture',
    'description': 'Design scalable system architectures',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a system architect. Design a scalable microservices architecture for [app type] with [specific requirements]. Include service boundaries, API contracts, data flow diagrams, and deployment strategy.',
    'icon': 'fas fa-sitemap'
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

  // LOWER PRIORITY - Specialized or less common tasks
  {
    'id': 1,
    'title': 'Evaluate Completed App',
    'category': 'review',
    'description': 'Comprehensive assessment of finished applications',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a senior software architect. Evaluate this completed application: [paste app code/details]. Assess: overall functionality and user experience. Identify performance bottlenecks and scalability potential. Check for security vulnerabilities and code quality issues. Evaluate maintainability. Provide detailed feedback with prioritized improvement recommendations and implementation suggestions.',
    'icon': 'fas fa-clipboard-check'
  },
  {
    'id': 41,
    'title': 'Evaluate Partially Completed App',
    'category': 'review',
    'description': 'Assessment of work-in-progress applications with guidance for completion',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a senior software architect and mentor. Evaluate this partially completed application: [paste current app code/details]. Assess: current progress and completion status. Identify missing features and incomplete implementations. Evaluate code quality and architecture decisions so far. Provide guidance on next steps and priorities. Suggest improvements to existing code. Help prioritize remaining work and estimate completion effort. Offer specific recommendations for finishing the application successfully.',
    'icon': 'fas fa-tasks'
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
    'id': 42,
    'title': 'Create New React App',
    'category': 'generate',
    'description': 'Generate a complete React application with modern best practices',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a senior React developer. Create a new React application with the following specifications: [describe app requirements, e.g., e-commerce site, dashboard, blog]. Include: modern React patterns (hooks, functional components), responsive design with [CSS framework, e.g., Tailwind, Material-UI], state management with [Redux/Context/Zustand], routing with React Router, proper folder structure, TypeScript support, testing setup with Jest/React Testing Library, and deployment configuration. Provide complete code with explanations.',
    'icon': 'fab fa-react'
  },
  {
    'id': 43,
    'title': 'REST API Integration',
    'category': 'api',
    'description': 'Integrate and consume REST APIs in your application',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a backend integration specialist. Integrate a REST API into this [language/framework] application: [describe API purpose, e.g., weather data, user management]. API details: Base URL: [API endpoint], Authentication: [Bearer token/API key/Basic auth], Endpoints needed: [list required endpoints]. Include: proper error handling, loading states, data transformation, caching strategy, and TypeScript interfaces if applicable. Provide complete integration code with usage examples.',
    'icon': 'fas fa-plug'
  },
  {
    'id': 44,
    'title': 'GraphQL API Queries',
    'category': 'api',
    'description': 'Create and optimize GraphQL queries and mutations',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a GraphQL specialist. Create efficient GraphQL queries and mutations for this application: [describe data requirements]. Schema information: [paste GraphQL schema or describe types]. Include: optimized queries with proper field selection, mutations for data modification, error handling, loading states, caching with Apollo Client or similar, and TypeScript type generation. Provide query examples and integration code.',
    'icon': 'fas fa-project-diagram'
  },
  {
    'id': 45,
    'title': 'Third-Party API Integration',
    'category': 'api',
    'description': 'Integrate popular third-party APIs (Stripe, Google Maps, social media, etc.)',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as an API integration expert. Integrate [API service, e.g., Stripe payments, Google Maps, Twitter API] into this [language/framework] application. Requirements: [describe integration needs]. Include: SDK/library setup, authentication configuration, error handling, security best practices, testing approach, and usage examples. Provide complete integration code with proper documentation.',
    'icon': 'fas fa-external-link-square-alt'
  },
  {
    'id': 46,
    'title': 'API Testing & Mocking',
    'category': 'testing',
    'description': 'Create comprehensive API tests and mock servers',
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a QA automation engineer. Create comprehensive API tests and mocks for this [API type, e.g., REST/GraphQL] endpoint: [describe API]. Include: unit tests for API functions, integration tests with mock servers, contract testing, load testing scripts, error scenario testing, and CI/CD integration. Use [testing framework, e.g., Jest, Postman, Cypress] and provide test examples with assertions.',
    'icon': 'fas fa-flask'
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
    'template': 'You are a helpful AI coding assistant focused on software development. Act as a code comparator. Explain this [language] code and compare it to [alternative approach]: [paste code here]. Highlight pros, cons, and when to use each approach.',
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
  },
  {
    'id': 39,
    'title': 'Beautify Code',
    'category': 'beautify',
    'description': 'Refactor code formatting, indentation, and structure for improved readability and consistency',
    'template': 'Act as a senior code formatting expert. Beautify this code by improving its structure, formatting, and readability: [paste code here]. Focus on: 1) Consistent indentation and spacing (2 or 4 spaces, no tabs), 2) Proper line breaks and code organization, 3) Consistent naming conventions (camelCase, PascalCase, snake_case), 4) Removal of unnecessary whitespace and comments, 5) Logical code grouping and separation, 6) Consistent bracket and parenthesis placement. Programming language: [specify language]. Code style: [specify style like Airbnb, Google, or custom]. Output the beautified code with explanations of changes made.',
    'icon': 'fas fa-code',
    'important': true
  },
  {
    'id': 40,
    'title': 'Beautify UI/UX',
    'category': 'beautify',
    'description': 'Design and optimize user interface and user experience for better visual appeal and usability',
    'template': 'Act as a senior UI/UX designer and frontend developer. Beautify this user interface by improving its design, layout, and user experience: [describe current UI/UX or paste relevant code]. Focus on: 1) Visual hierarchy and layout optimization, 2) Color scheme and typography improvements, 3) Responsive design and mobile-first approach, 4) Accessibility considerations (WCAG compliance, screen readers, keyboard navigation), 5) User interaction patterns and micro-interactions, 6) Performance optimization for UI rendering, 7) Cross-browser compatibility and progressive enhancement. Target platform: [web/mobile/desktop]. Design system: [Material Design, Ant Design, custom]. Output: 1) Redesigned UI/UX specifications, 2) Updated code implementation, 3) Accessibility improvements, 4) Performance recommendations, 5) Before/after design comparison.',
    'icon': 'fas fa-palette'
  }
];

/**
 * Load prompts from external JSON file with comprehensive error handling
 * @returns {Promise<void>}
 */
async function loadPrompts() {
  try {
    // Validate embedded prompts first
    if (!Array.isArray(embeddedPrompts) || embeddedPrompts.length === 0) {
      throw new Error('Embedded prompts data is invalid or empty');
    }

    // Only attempt to load if we're running on a server (not file:// protocol)
    if (window.location.protocol !== 'file:') {
      const response = await fetch('prompts.json');
      if (response.ok) {
        const externalPrompts = await response.json();

        // Validate external prompts structure
        if (Array.isArray(externalPrompts) && externalPrompts.length > 0) {
          // Additional validation for prompt structure
          const isValid = externalPrompts.every(prompt =>
            prompt &&
            typeof prompt.id === 'number' &&
            typeof prompt.title === 'string' &&
            typeof prompt.category === 'string' &&
            typeof prompt.template === 'string'
          );

          if (isValid) {
            AppState.prompts = externalPrompts;
            console.log(`Loaded ${AppState.prompts.length} prompts from external file`);
            return;
          } else {
            console.warn('External prompts data structure is invalid, falling back to embedded prompts');
          }
        } else {
          console.warn('External prompts data is not a valid array or is empty, falling back to embedded prompts');
        }
      } else {
        console.warn(`Failed to fetch external prompts: ${response.status} ${response.statusText}`);
      }
    }

    // Fallback to embedded prompts
    AppState.prompts = [...embeddedPrompts]; // Create a copy to avoid mutations
    console.log('Using embedded prompts (fetch not available or failed)');
  } catch (error) {
    console.error('Error loading prompts:', error);
    // Ensure we always have prompts available
    AppState.prompts = [...embeddedPrompts];
    showToast('Failed to load prompts, using defaults', 'warning');
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

// Enhanced debounce utility for performance optimization with immediate execution option
function debounce(fn, delay, immediate = false) {
  let timeout;
  return (...args) => {
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) fn(...args);
    }, delay);
    if (callNow) fn(...args);
  };
}

// Throttle utility for performance optimization
function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
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
}

function isFavorite(promptId) {
  return AppState.favorites.includes(promptId);
}

/**
 * Filter prompts based on current search and category filters
 * @param {Array} prompts - Array of prompt objects
 * @returns {Array} Filtered prompts
 */
function filterPrompts(prompts) {
  return prompts.filter(prompt => {
    let matchesCategory = AppState.selectedCategories.has('all') || AppState.selectedCategories.has(prompt.category);

    // Special handling for favorites category
    if (AppState.selectedCategories.has('favorites')) {
      matchesCategory = AppState.selectedCategories.has('favorites') && AppState.favorites.includes(prompt.id);
    }

    const matchesSearch = fuzzyMatch(prompt.title, AppState.searchTerm) ||
                          fuzzyMatch(prompt.description, AppState.searchTerm) ||
                          fuzzyMatch(prompt.template, AppState.searchTerm);
    return matchesCategory && matchesSearch;
  });
}

/**
 * Generate HTML for a single prompt card
 * @param {Object} prompt - Prompt object
 * @returns {string} HTML string for the prompt card
 */
function generatePromptCardHTML(prompt) {
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
            <button class="favorite-btn ${isFav ? 'active' : ''}" data-prompt-id="${prompt.id}" title="Add to favorites">
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
}

/**
 * Add animation effects to prompt cards
 * @param {NodeList} cards - Collection of prompt card elements
 */
function addCardAnimations(cards) {
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

/**
 * Set up event listeners for prompt card interactions
 * @param {Element} grid - The grid container element
 */
function setupCardEventListeners(grid) {
  const copyButtons = grid.querySelectorAll('.copy-btn');
  const editButtons = grid.querySelectorAll('.edit-btn');
  const favoriteButtons = grid.querySelectorAll('.favorite-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', handleCopyClick);
  });

  editButtons.forEach(button => {
    button.addEventListener('click', handleEditClick);
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', handleFavoriteClick);
  });
}

/**
 * Handle copy button click events
 * @param {Event} e - Click event
 */
function handleCopyClick(e) {
  const template = e.target.closest('.copy-btn').dataset.template;
  const promptId = parseInt(e.target.closest('.copy-btn').dataset.promptId);
  copyToClipboard(template, promptId);
}

/**
 * Handle edit button click events
 * @param {Event} e - Click event
 */
function handleEditClick(e) {
  const template = e.target.closest('.edit-btn').dataset.template;
  const promptId = parseInt(e.target.closest('.edit-btn').dataset.promptId);
  editPrompt(template, promptId);
}

/**
 * Handle favorite button click events
 * @param {Event} e - Click event
 */
function handleFavoriteClick(e) {
  const promptId = parseInt(e.target.closest('.favorite-btn').dataset.promptId);
  toggleFavorite(promptId);
}

/**
 * Render filtered prompts to the DOM
 */
function renderPrompts() {
  const grid = document.getElementById('promptsGrid');
  const filteredPrompts = filterPrompts(AppState.prompts);

  const sanitizedHTML = filteredPrompts.map(generatePromptCardHTML).join('');

  grid.innerHTML = DOMPurify.sanitize(sanitizedHTML, {
    ALLOWED_TAGS: ['div', 'span', 'button', 'i', 'mark'],
    ALLOWED_ATTR: ['class', 'onclick', 'title', 'data-template', 'data-prompt-id']
  });

  // Add animation delay to cards
  const cards = grid.querySelectorAll('.prompt-card');
  addCardAnimations(cards);

  // Set up event listeners
  setupCardEventListeners(grid);
}



function scrollToPrompt(promptId) {
  const promptCard = document.querySelector(`[data-prompt-id="${promptId}"]`).closest('.prompt-card');
  if (promptCard) {
    promptCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
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
  // Store the current prompt ID for saving
  window.currentEditingPromptId = promptId;

  // Populate the modal with the current template
  const textarea = document.getElementById('editPromptTextarea');
  textarea.value = template;

  // Open the edit modal
  openModal('editPromptModal');

  // Focus the textarea for better UX
  setTimeout(() => textarea.focus(), 100);
}

function saveEditedPrompt() {
  const textarea = document.getElementById('editPromptTextarea');
  const newTemplate = textarea.value.trim();
  const promptId = window.currentEditingPromptId;

  if (!newTemplate) {
    showToast('Template cannot be empty', 'error');
    return;
  }

  // Find and update the prompt in the state
  const prompt = AppState.prompts.find(p => p.id === promptId);
  if (prompt) {
    const oldTemplate = prompt.template;
    if (newTemplate !== oldTemplate) {
      prompt.template = newTemplate;
      showToast('Prompt template updated successfully! ✨', 'success');

      // Re-render the prompts to show the changes
      renderPrompts();
    } else {
      showToast('No changes made to the template', 'info');
    }
  } else {
    showToast('Error: Prompt not found', 'error');
  }

  // Close the modal
  closeModal('editPromptModal');

  // Clear the stored prompt ID
  window.currentEditingPromptId = null;
}



/**
 * Fallback clipboard copy method with custom success message
 * @param {string} text - Text to copy
 * @param {string} successMessage - Message to show on success
 */
function fallbackCopyToClipboardWithMessage(text, successMessage) {
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
      showToast(successMessage, 'success');
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

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    // Clear editing state if edit modal was closed
    if (modalId === 'editPromptModal') {
      window.currentEditingPromptId = null;
    }
  }
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
      // Export functionality removed
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
    } else if (category === 'favorites') {
      // "Favorites" category is special - clicking it selects only "favorites"
      AppState.selectedCategories.clear();
      AppState.selectedCategories.add('favorites');
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    } else {
      // Multi-select for other categories
      if (AppState.selectedCategories.has('all') || AppState.selectedCategories.has('favorites')) {
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

// Close modals when clicking outside or on close/cancel buttons
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    // Close if clicking on the overlay background
    if (e.target === modal) {
      modal.classList.remove('show');
      // Clear editing state if edit modal was closed
      if (modal.id === 'editPromptModal') {
        window.currentEditingPromptId = null;
      }
    }
  });
});

// Ensure modal close buttons work properly
document.addEventListener('click', (e) => {
  // Handle modal close button (X)
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      closeModal(modal.id);
    }
  }

  // Handle cancel button in edit modal
  if (e.target.classList.contains('btn-secondary') && e.target.textContent.includes('Cancel')) {
    closeModal('editPromptModal');
  }
});

// Keyboard support for modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close any open modal
    const openModal = document.querySelector('.modal.show');
    if (openModal) {
      openModal.classList.remove('show');
      // Clear editing state if edit modal was open
      if (openModal.id === 'editPromptModal') {
        window.currentEditingPromptId = null;
      }
    }
  }
});



// Initialize application
async function initializeApp() {
  await initializeState();
  renderPrompts();
}

// Start the application
initializeApp();

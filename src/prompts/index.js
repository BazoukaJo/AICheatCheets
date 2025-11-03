/**
 * Embedded prompts data for static app compatibility
 * Sorted by priority/usefulness
 * @type {Array<Prompt>}
 */

import { AppState } from '../state/index.js';
import { showToast } from '../utils/index.js';

export const embeddedPrompts = [
  // HIGH PRIORITY - Most frequently used and critical tasks
  {
    'id': 14,
    'title': 'Code Review Analysis',
    'category': 'review',
    'description': 'Comprehensive code review with actionable feedback and quality metrics',
    'template': 'Act as a senior code reviewer and technical lead with 15+ years of experience in [relevant domain]. Perform a comprehensive code review of this [language] code: [paste code or provide diff].\n\nReview context: [describe PR purpose, codebase size, team experience level, timeline constraints]\n\nEvaluate across these dimensions (rate each 1-5, provide evidence):\n\n**Code Quality (25%)**\n- Readability and maintainability\n- Naming conventions and consistency\n- Documentation completeness\n\n**Functionality & Requirements (25%)**\n- Requirements compliance\n- Logic correctness\n- Edge case handling\n\n**Performance & Scalability (20%)**\n- Algorithm efficiency\n- Resource usage optimization\n- Scalability considerations\n\n**Security (15%)**\n- Input validation and sanitization\n- Authentication/authorization\n- Data protection\n\n**Testing & Quality Assurance (10%)**\n- Test coverage and quality\n- Error handling robustness\n\n**Architecture & Design (5%)**\n- Design pattern appropriateness\n- Code organization and modularity\n\nOutput format:\n## Executive Summary (Approval: Yes/No/Conditional)\n## Critical Issues (Blockers - must fix)\n## Major Concerns (High priority fixes)\n## Minor Issues (Should fix when possible)\n## Recommendations (Nice to have)\n## Overall Assessment (Score: X/100)\n## Review Confidence Level (based on code familiarity)',
    'icon': 'fas fa-search-plus',
  },

  // EVALUATION CATEGORY - Comprehensive project assessment and scoring
  {
    'id': 47,
    'title': 'Complete Project Evaluation',
    'category': 'eval',
    'description': 'Comprehensive 10/10 scoring evaluation of entire project with detailed improvement roadmap',
    'template': 'Act as a senior software architect and product manager with 15+ years of experience. Evaluate this complete project/application: [paste project overview, tech stack, and key files]. Context: [describe target users, business goals, timeline, team size]. Perform comprehensive evaluation on 10-point scale: 1) **Code Quality** (readability, structure, best practices) - Score: __/10, 2) **Architecture & Design** (scalability, patterns, maintainability) - Score: __/10, 3) **Performance & Optimization** (speed, memory, efficiency) - Score: __/10, 4) **Security** (vulnerabilities, data protection, compliance) - Score: __/10, 5) **User Experience** (UI/UX, accessibility, responsiveness) - Score: __/10, 6) **Testing & Quality Assurance** (coverage, automation, reliability) - Score: __/10, 7) **Documentation** (completeness, clarity, maintenance docs) - Score: __/10, 8) **DevOps & Deployment** (CI/CD, monitoring, scalability) - Score: __/10, 9) **Innovation & Features** (uniqueness, user value, market fit) - Score: __/10, 10) **Overall Business Impact** (ROI, user satisfaction, growth potential) - Score: __/10. Output in Markdown: ## Executive Summary (Total Score: __/100), ## Detailed Assessment (each category with score + justification), ## Critical Issues (must fix for production), ## Major Improvements (high impact, medium effort), ## Minor Enhancements (low effort, nice to have), ## Technical Debt Analysis, ## Security Recommendations, ## Performance Optimization Plan, ## Testing Strategy Gaps, ## Deployment & Scaling Roadmap, ## Final Recommendations with Priority Matrix.',
    'icon': 'fas fa-star-half-alt',
  },
  {
    'id': 48,
    'title': 'UI/UX Design Evaluation',
    'category': 'eval',
    'description': 'Evaluate user interface and experience design with scoring and improvement suggestions',
    'template': 'Act as a senior UX designer and usability expert. Evaluate the UI/UX design of this application: [describe app purpose, target users, current design]. Context: [platform - web/mobile/desktop, user personas, key user journeys]. Rate on 10-point scale: 1) **Visual Design** (aesthetics, branding, consistency) - Score: __/10, 2) **Information Architecture** (content organization, navigation) - Score: __/10, 3) **User Experience Flow** (intuitiveness, efficiency, satisfaction) - Score: __/10, 4) **Accessibility** (WCAG compliance, inclusive design) - Score: __/10, 5) **Responsive Design** (cross-device compatibility) - Score: __/10, 6) **Interaction Design** (feedback, micro-interactions, affordances) - Score: __/10, 7) **Performance UX** (loading states, perceived performance) - Score: __/10, 8) **Error Handling UX** (error messages, recovery flows) - Score: __/10, 9) **Mobile Experience** (touch targets, gestures, context) - Score: __/10, 10) **Overall User Satisfaction** (usability testing results, user feedback) - Score: __/10. Provide: ## Current Design Analysis, ## Usability Issues Found, ## Accessibility Audit Results, ## Mobile Optimization Gaps, ## Performance UX Problems, ## Recommended Design Improvements, ## Implementation Priority, ## A/B Testing Suggestions, ## User Research Recommendations.',
    'icon': 'fas fa-palette',
  },
  {
    'id': 49,
    'title': 'Code Quality Assessment',
    'category': 'eval',
    'description': 'Evaluate code quality, maintainability, and technical excellence with detailed scoring',
    'template': 'Act as a senior software engineer and code quality specialist. Assess the code quality of this [language] codebase: [paste code samples or describe structure]. Context: [team size, project age, coding standards used]. Evaluate on 10-point scale: 1) **Code Readability** (naming, comments, structure) - Score: __/10, 2) **Code Maintainability** (modularity, dependencies, complexity) - Score: __/10, 3) **Best Practices Adherence** (language idioms, framework conventions) - Score: __/10, 4) **Error Handling** (robustness, logging, recovery) - Score: __/10, 5) **Testing Quality** (coverage, types, automation) - Score: __/10, 6) **Documentation** (inline docs, API docs, README) - Score: __/10, 7) **Performance** (algorithms, memory usage, bottlenecks) - Score: __/10, 8) **Security** (vulnerabilities, input validation, data protection) - Score: __/10, 9) **Scalability** (architecture, database design, caching) - Score: __/10, 10) **Technical Debt Level** (refactoring needs, outdated dependencies) - Score: __/10. Output: ## Quality Metrics Summary (Total: __/100), ## Code Smell Analysis, ## Complexity Assessment, ## Testing Coverage Gaps, ## Security Vulnerabilities, ## Performance Issues, ## Maintainability Problems, ## Recommended Refactoring, ## Code Standards Compliance, ## Automated Quality Tools Setup, ## Continuous Improvement Plan.',
    'icon': 'fas fa-code'
  },
  {
    'id': 50,
    'title': 'Performance & Scalability Review',
    'category': 'eval',
    'description': 'Evaluate application performance and scalability potential with optimization recommendations',
    'template': 'Act as a senior performance engineer and scalability architect. Evaluate the performance and scalability of this application: [describe tech stack, current load, performance requirements]. Context: [expected users, peak load, infrastructure]. Rate performance aspects: 1) **Frontend Performance** (loading speed, rendering, bundle size) - Score: __/10, 2) **Backend Performance** (response times, throughput, database queries) - Score: __/10, 3) **Database Performance** (query optimization, indexing, caching) - Score: __/10, 4) **API Performance** (latency, rate limiting, CDN) - Score: __/10, 5) **Memory Usage** (leaks, optimization, garbage collection) - Score: __/10, 6) **Network Efficiency** (compression, caching, CDN) - Score: __/10, 7) **Scalability Architecture** (horizontal scaling, load balancing) - Score: __/10, 8) **Caching Strategy** (implementation, hit rates, invalidation) - Score: __/10, 9) **Monitoring & Alerting** (observability, performance tracking) - Score: __/10, 10) **Resource Optimization** (CPU, memory, bandwidth efficiency) - Score: __/10. Provide: ## Performance Benchmark Results, ## Bottleneck Analysis, ## Scalability Assessment, ## Optimization Recommendations, ## Monitoring Setup Guide, ## Load Testing Strategy, ## CDN & Caching Plan, ## Database Tuning Advice, ## Infrastructure Scaling Plan, ## Performance Budget Guidelines.',
    'icon': 'fas fa-tachometer-alt'
  },
  {
    'id': 51,
    'title': 'Security Audit & Assessment',
    'category': 'eval',
    'description': 'Comprehensive security evaluation with vulnerability scoring and remediation plan',
    'template': 'Act as a senior security auditor and penetration tester. Perform a comprehensive security assessment of this application: [describe application type, data sensitivity, user authentication]. Context: [compliance requirements, threat model, security team]. Evaluate security on 10-point scale: 1) **Authentication & Authorization** (login security, session management) - Score: __/10, 2) **Data Protection** (encryption, secure storage, transmission) - Score: __/10, 3) **Input Validation** (XSS, SQL injection, sanitization) - Score: __/10, 4) **API Security** (rate limiting, authentication, CORS) - Score: __/10, 5) **Infrastructure Security** (server hardening, network security) - Score: __/10, 6) **Dependency Security** (vulnerable libraries, supply chain) - Score: __/10, 7) **Privacy Compliance** (GDPR, data handling, user rights) - Score: __/10, 8) **Logging & Monitoring** (security events, audit trails) - Score: __/10, 9) **Incident Response** (breach detection, recovery plans) - Score: __/10, 10) **Security Testing** (pen testing, automated scanning) - Score: __/10. Output: ## Security Score Summary (Total: __/100), ## Critical Vulnerabilities (CVSS scores), ## High-Risk Issues, ## Medium-Risk Concerns, ## Security Best Practices Gaps, ## Compliance Requirements Status, ## Recommended Security Controls, ## Penetration Testing Plan, ## Security Monitoring Setup, ## Incident Response Improvements, ## Security Training Recommendations.',
    'icon': 'fas fa-shield-alt'
  },
  {
    'id': 52,
    'title': 'Business Value & ROI Assessment',
    'category': 'eval',
    'description': 'Evaluate business impact, market fit, and return on investment potential',
    'template': 'Act as a senior product manager and business analyst. Assess the business value and ROI potential of this product/application: [describe product, target market, competitors]. Context: [business goals, budget, timeline, team]. Evaluate business aspects: 1) **Market Opportunity** (market size, growth potential, competition) - Score: __/10, 2) **Product-Market Fit** (user needs, value proposition, differentiation) - Score: __/10, 3) **User Acquisition** (marketing strategy, conversion rates, channels) - Score: __/10, 4) **Monetization Potential** (revenue models, pricing strategy, LTV/CAC) - Score: __/10, 5) **Scalability** (business model scalability, market expansion) - Score: __/10, 6) **Technical Competitive Advantage** (innovation, IP, barriers to entry) - Score: __/10, 7) **Team & Execution** (capability, experience, execution risk) - Score: __/10, 8) **Financial Projections** (revenue forecast, cost structure, profitability) - Score: __/10, 9) **Risk Assessment** (market risks, technical risks, execution risks) - Score: __/10, 10) **Exit Strategy** (acquisition potential, IPO readiness, strategic value) - Score: __/10. Provide: ## Business Score Summary (Total: __/100), ## Market Analysis, ## Competitive Landscape, ## Revenue Model Assessment, ## Go-to-Market Strategy, ## Risk Mitigation Plan, ## Growth Projections, ## Investment Recommendations, ## KPI Dashboard Setup, ## Strategic Roadmap.',
    'icon': 'fas fa-chart-line'
  },
  {
    'id': 4,
    'title': 'Explain Code',
    'category': 'explain',
    'description': 'Break down code step by step with analysis',
    'template': 'Act as a senior software engineer and code educator with 10+ years of experience. Explain this [language] code step by step: [paste code here].\n\nProvide a structured breakdown:\n1. **Overview**: What does this code accomplish?\n2. **Key Components**: Break down each major section/function\n3. **Logic Flow**: Explain the execution order and decision points\n4. **Design Patterns**: Identify any patterns or architectural approaches used\n5. **Potential Issues**: Highlight bugs, inefficiencies, or security concerns\n6. **Best Practices**: How well does this follow language conventions?\n\nInclude code comments in the explanation and suggest improvements where relevant.',
    'icon': 'fas fa-search'
  },
  {
    'id': 2,
    'title': 'Clean Up Code',
    'category': 'cleanup',
    'description': 'Remove redundancies, format properly, and suggest improvements',
    'template': 'Act as a senior code quality engineer specializing in [language] best practices. Clean up and refactor this [language] code: [paste code here].\n\nFocus areas (in priority order):\n1. **Functionality Preservation**: Ensure no behavior changes\n2. **Readability**: Clear variable names, consistent formatting, logical structure\n3. **Performance**: Remove inefficiencies without over-optimization\n4. **Maintainability**: Reduce complexity, eliminate duplication\n5. **Standards Compliance**: Follow [language-specific style guide, e.g., PEP 8 for Python]\n\nOutput format:\n- **Cleaned Code**: Full refactored version in code block\n- **Changes Made**: Bullet list of modifications with rationale\n- **Improvement Metrics**: Before/after complexity scores, line count changes\n- **Additional Recommendations**: Optional further improvements with effort estimates',
    'icon': 'fas fa-broom'
  },
  {
    'id': 5,
    'title': 'Add Specific Feature',
    'category': 'feature',
    'description': 'Integrate new functionality seamlessly',
    'template': 'Act as a senior full-stack developer with 12+ years of experience. Add [describe feature, e.g., user authentication] to this existing [language] code: [paste code here].\n\nIntegration requirements:\n1. **Seamless Integration**: Maintain existing code structure and patterns\n2. **Dependency Management**: Handle all required libraries and imports\n3. **Error Handling**: Implement proper error handling and user feedback\n4. **Testing**: Include unit tests for the new functionality\n5. **Documentation**: Update code comments and provide usage examples\n\nOutput format:\n- **Modified Code**: Complete updated code with feature integrated\n- **Dependencies Added**: List of new dependencies with installation instructions\n- **Usage Examples**: How to use the new feature\n- **Testing Instructions**: How to test the implementation',
    'icon': 'fas fa-plus-circle'
  },
  {
    'id': 6,
    'title': 'Generate Tests',
    'category': 'test',
    'description': 'Create comprehensive unit tests',
    'template': 'Act as a senior QA automation engineer and testing architect. Create comprehensive unit tests for this [language] code: [paste code here].\n\nRequirements:\n- **Framework**: Use [specify framework, e.g., Jest, pytest, JUnit]\n- **Coverage**: Aim for 90%+ code coverage including edge cases\n- **Test Types**: Unit tests, integration tests, error handling tests\n- **Structure**: Arrange-Act-Assert pattern with descriptive test names\n- **Mocking**: Include mocks/stubs for external dependencies\n\nTest categories to cover:\n1. **Happy Path**: Normal successful execution\n2. **Edge Cases**: Boundary values, empty inputs, null handling\n3. **Error Scenarios**: Exception handling, validation failures\n4. **Integration Points**: API calls, database interactions, file I/O\n\nOutput: Complete test suite with setup instructions and coverage report guidance.',
    'icon': 'fas fa-vial'
  },
  {
    'id': 7,
    'title': 'Optimize Code',
    'category': 'optimize',
    'description': 'Improve performance, memory usage, or speed',
    'template': 'Act as a senior performance engineer specializing in [language] optimization. Optimize this [language] code for [primary metric: speed/memory/CPU usage]: [paste code here].\n\nOptimization approach:\n1. **Profiling First**: Identify actual bottlenecks before optimizing\n2. **Algorithmic Improvements**: Big O complexity reductions\n3. **Memory Management**: Efficient data structures and garbage collection\n4. **I/O Optimization**: Reduce disk/network operations\n5. **Caching Strategy**: Implement appropriate caching layers\n6. **Concurrency**: Add parallel processing where beneficial\n\nRequirements:\n- Maintain exact same functionality and API\n- Provide performance benchmarks (before/after)\n- Include profiling code for ongoing monitoring\n- Document trade-offs and when optimization might not be worth it\n\nOutput format:\n- **Optimized Code**: Complete refactored version\n- **Performance Analysis**: Benchmark results and improvement metrics\n- **Trade-off Analysis**: Any increases in complexity vs. performance gains',
    'icon': 'fas fa-tachometer-alt'
  },
  {
    'id': 10,
    'title': 'Security Audit',
    'category': 'security',
    'description': 'Identify and fix security vulnerabilities',
    'template': 'Act as a senior cybersecurity engineer and penetration tester. Perform a comprehensive security audit of this [language] code: [paste code here].\n\nAudit scope:\n1. **Input Validation**: SQL injection, XSS, command injection prevention\n2. **Authentication & Authorization**: Session management, access controls\n3. **Data Protection**: Encryption, secure storage, transmission security\n4. **Error Handling**: Information leakage prevention\n5. **Dependencies**: Vulnerable third-party libraries\n6. **Configuration**: Secure defaults, secrets management\n\nRisk prioritization: Critical → High → Medium → Low → Info\n\nFor each finding provide:\n- **Severity**: CVSS score and risk level\n- **Description**: What the vulnerability is\n- **Impact**: Potential consequences\n- **Remediation**: Specific code fixes with examples\n- **Prevention**: Ongoing security practices\n\nOutput: Executive summary with risk scorecard, detailed findings, and prioritized remediation plan.',
    'icon': 'fas fa-shield-alt'
  }
];

/**
 * Load prompts from external JSON file with comprehensive error handling
 * @returns {Promise<void>}
 */
export async function loadPrompts() {
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

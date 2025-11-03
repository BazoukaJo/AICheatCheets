/**
 * Rendering functions for the AI Prompt Templates
 */

import { AppState, isFavorite, toggleFavorite, trackUsage } from '../state/index.js';
import { copyToClipboard, fuzzyMatch, highlightMatches, showToast } from '../utils/index.js';

/**
 * Filter prompts based on current search and category filters
 * @param {Array} prompts - Array of prompt objects
 * @returns {Array} Filtered prompts
 */
export function filterPrompts(prompts) {
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
export function generatePromptCardHTML(prompt) {
  // Sanitize user inputs
  const safeTitle = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(prompt.title) : prompt.title;
  const safeDescription = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(prompt.description) : prompt.description;
  const safeIcon = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(prompt.icon) : prompt.icon;

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
 * Set up event listeners for prompt card interactions
 * @param {Element} grid - The grid container element
 */
export function setupCardEventListeners(grid) {
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
  copyToClipboard(template, promptId, trackUsage);
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
async function handleFavoriteClick(e) {
  const promptId = parseInt(e.target.closest('.favorite-btn').dataset.promptId);
  await toggleFavorite(promptId);
}

/**
 * Render filtered prompts to the DOM with performance optimizations
 */
export function renderPrompts() {
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    const grid = document.getElementById('promptsGrid');
    const filteredPrompts = filterPrompts(AppState.prompts);

    // Performance optimization: Use DocumentFragment for batch DOM updates
    const fragment = document.createDocumentFragment();

    filteredPrompts.forEach((prompt, index) => {
      const cardHTML = generatePromptCardHTML(prompt);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(cardHTML, {
        ALLOWED_TAGS: ['div', 'span', 'button', 'i', 'mark'],
        ALLOWED_ATTR: ['class', 'onclick', 'title', 'data-template', 'data-prompt-id', 'aria-label', 'role', 'tabindex'],
      }) : cardHTML;

      const card = tempDiv.firstElementChild;
      if (card) {
        // Add micro-interaction delay
        card.style.animationDelay = `${index * 50}ms`;
        fragment.appendChild(card);
      }
    });

    // Clear existing content and append new content
    grid.innerHTML = '';
    grid.appendChild(fragment);

    // Set up event listeners with passive listeners for better performance
    setupCardEventListeners(grid);

    // Announce to screen readers
    const resultsCount = filteredPrompts.length;
    grid.setAttribute('aria-label', `${resultsCount} prompts found`);
  });
}

/**
 * Edit a prompt template
 * @param {string} template - Current template
 * @param {number} promptId - Prompt ID
 */
export function editPrompt(template, promptId) {
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

/**
 * Save edited prompt
 */
export function saveEditedPrompt() {
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
 * Open modal
 * @param {string} modalId - Modal ID to open
 */
export function openModal(modalId) {
  document.getElementById(modalId).classList.add('show');
}

/**
 * Close modal
 * @param {string} modalId - Modal ID to close
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    // Clear editing state if edit modal was closed
    if (modalId === 'editPromptModal') {
      window.currentEditingPromptId = null;
    }
  }
}

/**
 * Main entry point for the AI Prompt Templates
 * Initializes the application and sets up event listeners
 */

import { closeModal, renderPrompts, saveEditedPrompt } from './rendering/index.js';
import { debounce, fillPlaceholder, showToast, toggleFavoritesView } from './utils/index.js';

import { AppState } from './state/index.js';
import { initializeState } from './state/index.js';

/**
 * Initialize application
 * @returns {Promise<void>}
 */
async function initializeApp() {
  // Show warning if opened from file:// protocol
  if (window.location.protocol === 'file:') {
    const warningDiv = document.getElementById('fileProtocolWarning');
    if (warningDiv) {
      warningDiv.style.display = 'block';
    }
  }

  await initializeState();
  renderPrompts();
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
    const categoryBtn = document.querySelector(`[data-category="${categoryShortcuts[key]}"]`);
    if (categoryBtn) {
      categoryBtn.click();
      showToast(`Selected ${categoryBtn.textContent.trim()}`, 'success');
    }
    return;
  }

  switch (key) {
  case 'k': {
    if (isCtrlOrCmd) {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
    break;
  }
  case 'f': {
    if (isCtrlOrCmd) {
      e.preventDefault();
      toggleFavoritesView();
    }
    break;
  }
  case 'e': {
    if (isCtrlOrCmd) {
      e.preventDefault();
      // Export functionality removed
    }
    break;
  }
  case 'escape': {
    document.getElementById('searchInput').value = '';
    AppState.searchTerm = '';
    renderPrompts();
    break;
  }
  case 'enter': {
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
  }
});

// Make functions globally available for HTML onclick handlers
window.saveEditedPrompt = saveEditedPrompt;
window.closeModal = closeModal;
window.fillPlaceholder = fillPlaceholder;

// Start the application
initializeApp();

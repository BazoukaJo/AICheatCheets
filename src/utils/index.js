/**
 * Utility functions for the AI Prompt Assistant
 */

/**
 * Enhanced debounce utility for performance optimization with immediate execution option
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay, immediate = false) {
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

/**
 * Throttle utility for performance optimization
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
}

/**
 * Fuzzy search implementation
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @returns {boolean} Whether the query matches
 */
export function fuzzyMatch(text, query) {
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

/**
 * Highlight search matches
 * @param {string} text - Text to highlight in
 * @param {string} query - Search query
 * @returns {string} Text with highlights
 */
export function highlightMatches(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, warning, info)
 */
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Fill placeholder in template
 * @param {string} placeholder - Placeholder to fill
 */
export function fillPlaceholder(placeholder) {
  const value = prompt(`Enter value for "${placeholder}":`);
  if (value) {
    // Sanitize user input to prevent XSS if used in templates
    const sanitizedValue = DOMPurify.sanitize(value);
    // In a real implementation, this would update the template
    showToast(`Placeholder filled: ${sanitizedValue}`, 'success');
  }
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @param {number} promptId - Prompt ID for usage tracking
 * @param {Function} trackUsage - Usage tracking function
 */
export async function copyToClipboard(text, promptId, trackUsage) {
  // Enhanced clipboard handling with better error feedback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard! 📋', 'success');
      if (promptId && trackUsage) {
        trackUsage(promptId);
      }
    }).catch((error) => {
      console.warn('Clipboard API failed:', error);
      fallbackCopyToClipboard(text, promptId, trackUsage);
    });
  } else {
    fallbackCopyToClipboard(text, promptId, trackUsage);
  }
}

/**
 * Fallback clipboard copy method
 * @param {string} text - Text to copy
 * @param {number} promptId - Prompt ID for usage tracking
 * @param {Function} trackUsage - Usage tracking function
 */
export function fallbackCopyToClipboard(text, promptId, trackUsage) {
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
      if (promptId && trackUsage) {
        trackUsage(promptId);
      }
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

/**
 * Scroll to a specific prompt
 * @param {number} promptId - Prompt ID to scroll to
 */
export function scrollToPrompt(promptId) {
  const promptCard = document.querySelector(`[data-prompt-id="${promptId}"]`).closest('.prompt-card');
  if (promptCard) {
    promptCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Toggle favorites view
 */
export function toggleFavoritesView() {
  const favoritesSection = document.getElementById('favoritesSection');
  if (favoritesSection.style.display === 'none' || !favoritesSection.style.display) {
    favoritesSection.style.display = 'block';
    showToast('Showing favorites', 'success');
  } else {
    favoritesSection.style.display = 'none';
    showToast('Hiding favorites', 'warning');
  }
}

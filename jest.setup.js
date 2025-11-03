// Jest is already available globally

// Define minimal versions of required functions for testing
global.trackUsage = jest.fn();
global.renderPrompts = jest.fn();

// Mock DOMPurify first
global.DOMPurify = {
  sanitize: (input) => input,
};

// Mock Element.prototype.closest
Element.prototype.closest = jest.fn(function(_selector) {
  // Simple mock that returns the element itself for testing
  return this;
});

// Mock showToast as a jest mock
global.showToast = jest.fn((message, type = 'success') => {
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
});

// Define utility functions directly for testing
global.debounce = function(fn, delay, immediate = false) {
  let timeout;
  return (...args) => {
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        fn(...args);
      }
    }, delay);
    if (callNow) {
      fn(...args);
    }
  };
};

global.throttle = function(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
};

global.fuzzyMatch = function(text, query) {
  if (!query) {
    return true;
  }
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match gets highest priority
  if (textLower.includes(queryLower)) {
    return true;
  }

  // Simple fuzzy matching - check if all query characters appear in order
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === queryLower.length;
};

global.highlightMatches = function(text, query) {
  if (!query) {
    return text;
  }
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

global.copyToClipboard = async function(text, promptId) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    global.showToast('Copied to clipboard! 📋', 'success');
    if (promptId) {
      global.trackUsage(promptId);
    }
  } else {
    global.fallbackCopyToClipboard(text, promptId);
  }
};

global.fallbackCopyToClipboard = function(text, promptId) {
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
      global.showToast('Copied to clipboard! 📋', 'success');
      if (promptId) {
        global.trackUsage(promptId);
      }
    } else {
      throw new Error('execCommand failed');
    }
  } catch (error) {
    console.error('Fallback copy failed:', error);
    global.showToast('Copy failed. Please select and copy manually.', 'error');
  }
};

global.fillPlaceholder = function(placeholder) {
  const value = prompt(`Enter value for "${placeholder}":`);
  if (value) {
    const sanitizedValue = global.DOMPurify.sanitize(value);
    global.showToast(`Placeholder filled: ${sanitizedValue}`, 'success');
  }
};

global.scrollToPrompt = function(promptId) {
  const element = document.querySelector(`[data-prompt-id="${promptId}"]`);
  const promptCard = element ? element.closest('.prompt-card') : null;
  if (promptCard) {
    promptCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

global.toggleFavoritesView = function() {
  const favoritesSection = document.getElementById('favoritesSection');
  if (favoritesSection.style.display === 'none' || !favoritesSection.style.display) {
    favoritesSection.style.display = 'block';
    global.showToast('Showing favorites', 'success');
  } else {
    favoritesSection.style.display = 'none';
    global.showToast('Hiding favorites', 'warning');
  }
};

// Mock DOMPurify
global.DOMPurify = {
  sanitize: (input) => input,
};

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete global.window.location;
global.window.location = {
  protocol: 'http:',
  hostname: 'localhost',
  href: 'http://localhost:3000',
};

// Mock fetch
global.fetch = jest.fn();

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));

// Mock performance.now
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

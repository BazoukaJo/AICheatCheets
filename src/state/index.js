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
export const AppState = {
  currentCategory: 'all',
  selectedCategories: new Set(['all']),
  searchTerm: '',
  favorites: [],
  usageStats: {},
  prompts: [],
};

/**
 * Initialize state with error handling
 * @returns {Promise<void>}
 */
export async function initializeState() {
  const { loadPrompts } = await import('../prompts/index.js');
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

/**
 * Save state to localStorage
 */
export async function saveToStorage() {
  try {
    localStorage.setItem('clineFavorites', JSON.stringify(AppState.favorites));
    localStorage.setItem('clineUsageStats', JSON.stringify(AppState.usageStats));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    const { showToast } = await import('../utils/index.js');
    showToast('Failed to save preferences', 'error');
  }
}

/**
 * Track usage statistics
 * @param {number} promptId - The prompt ID that was used
 */
export function trackUsage(promptId) {
  const today = new Date().toDateString();
  AppState.usageStats[today] = (AppState.usageStats[today] || 0) + 1;
  saveToStorage();
}

/**
 * Toggle favorite status for a prompt
 * @param {number} promptId - The prompt ID to toggle
 */
export async function toggleFavorite(promptId) {
  const index = AppState.favorites.indexOf(promptId);
  if (index > -1) {
    AppState.favorites.splice(index, 1);
  } else {
    AppState.favorites.push(promptId);
  }
  await saveToStorage();
  const { renderPrompts } = await import('../rendering/index.js');
  renderPrompts();
}

/**
 * Check if a prompt is favorited
 * @param {number} promptId - The prompt ID to check
 * @returns {boolean} Whether the prompt is favorited
 */
export function isFavorite(promptId) {
  return AppState.favorites.includes(promptId);
}

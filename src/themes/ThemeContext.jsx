import { createContext, useContext } from 'react';
import { loadProgress } from '../storage/progress.js';
import habitats from '../data/habitats.json';

import wildlifeTheme from './wildlife.json';
import spaceTheme from './space.json';
import mythicTheme from './mythic.json';
import sportsTheme from './sports.json';

export const ALL_THEMES = [wildlifeTheme, spaceTheme, mythicTheme, sportsTheme];

const ThemeContext = createContext(null);

function getThemeById(id) {
  return ALL_THEMES.find((t) => t.id === id) || wildlifeTheme;
}

// Merge theme visuals with spelling word data
function getThemedHabitats(theme) {
  return habitats.map((habitat) => {
    const themed = theme.habitats[habitat.id] || {};
    return {
      ...habitat,
      displayName: themed.name || habitat.name,
      displayEmoji: themed.emoji || habitat.emoji,
      reward: themed.reward || habitat.animal,
    };
  });
}

export function ThemeProvider({ children }) {
  const progress = loadProgress();
  const themeId = progress.settings?.theme || 'wildlife';
  const theme = getThemeById(themeId);
  const themedHabitats = getThemedHabitats(theme);

  const value = {
    theme,
    themeId: theme.id,
    habitats: themedHabitats,
    colours: theme.colours,
    mathsHabitats: theme.mathsHabitats || {},
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}

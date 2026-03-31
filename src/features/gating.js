// Feature gating — controls what's free vs requires registration
// Free: 2 habitats (jungle, ocean), home, settings, about, avatar
// Registered: all 8 habitats, diagnostic, mock SATs, arcade

export const FREE_HABITATS = ['jungle', 'ocean'];

export function isHabitatFree(habitatId) {
  return FREE_HABITATS.includes(habitatId);
}

export function isFeatureLocked(featureId, isLoggedIn) {
  if (isLoggedIn) return false; // Everything unlocked for registered users

  switch (featureId) {
    case 'habitat':
      return false; // Check per-habitat with isHabitatLocked instead
    case 'diagnostic':
    case 'mockSats':
    case 'arcade':
      return true;
    default:
      return false;
  }
}

export function isHabitatLocked(habitatId, isLoggedIn) {
  if (isLoggedIn) return false;
  return !isHabitatFree(habitatId);
}

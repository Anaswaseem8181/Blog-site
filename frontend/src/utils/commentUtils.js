/**
 * Generates a deterministic, visually distinct CSS gradient background
 * for a user avatar based on their username string.
 * DRY — used by CommentThread and CommentInput.
 */
export function getAvatarStyle(username = '?') {
  // Hash the string to a stable number
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash into two distinct HSL hues
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 60) % 360;

  return {
    background: `linear-gradient(135deg, hsl(${hue1}, 70%, 55%), hsl(${hue2}, 70%, 45%))`,
  };
}

/** Returns the initials (up to 2 chars) for a username */
export function getInitials(username = '?') {
  const parts = username.trim().split(/[\s_-]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

/**
 * Parses comment text and highlights @mentions as styled <span> elements.
 * Returns an array of strings / React nodes.
 */
export function parseMentions(text) {
  const parts = text.split(/(@\w+)/g);
  return parts.map((part, i) =>
    part.startsWith('@')
      ? { type: 'mention', text: part, key: i }
      : { type: 'text',    text: part, key: i }
  );
}

/**
 * Returns a human-readable relative time string (e.g. "2h ago").
 * DRY — avoids installing a full date library for a simple use-case.
 */
export function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const intervals = [
    { label: 'y',  secs: 31536000 },
    { label: 'w',  secs: 604800   },
    { label: 'd',  secs: 86400    },
    { label: 'h',  secs: 3600     },
    { label: 'm',  secs: 60       },
    { label: 's',  secs: 1        },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return 'just now';
}

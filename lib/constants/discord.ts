/**
 * Discord character limits for various embed components
 */
export const DISCORD_LIMITS = {
  EMBED: {
    TITLE: 256,
    DESCRIPTION: 4096,
    FIELDS: 25,
    FIELD_NAME: 256,
    FIELD_VALUE: 1024,
    FOOTER_TEXT: 2048,
    AUTHOR_NAME: 256,
    TOTAL: 6000, // Total characters across all fields
  },
  MESSAGE: {
    CONTENT: 2000,
    EMBEDS: 10,
  },
  WEBHOOK: {
    USERNAME: 80,
  },
} as const;

/**
 * Discord CDN URL builders
 */
export const DISCORD_CDN = {
  EMOJI: (emojiId: string, animated: boolean = false) =>
    `https://cdn.discordapp.com/emojis/${emojiId}.${animated ? 'gif' : 'png'}`,
  AVATAR: (userId: string, hash: string) =>
    `https://cdn.discordapp.com/avatars/${userId}/${hash}.png`,
  ICON: (guildId: string, hash: string) =>
    `https://cdn.discordapp.com/icons/${guildId}/${hash}.png`,
} as const;

/**
 * Discord color presets
 */
export const DISCORD_COLOR_PRESETS = [
  { name: 'Blurple', value: 0x5865F2 },
  { name: 'Green', value: 0x57F287 },
  { name: 'Yellow', value: 0xFEE75C },
  { name: 'Fuchsia', value: 0xEB459E },
  { name: 'Red', value: 0xED4245 },
  { name: 'White', value: 0xFFFFFF },
  { name: 'Black', value: 0x23272A },
  { name: 'Dark Grey', value: 0x99AAB5 },
  { name: 'Aqua', value: 0x1ABC9C },
  { name: 'Dark Aqua', value: 0x11806A },
  { name: 'Blue', value: 0x3498DB },
  { name: 'Dark Blue', value: 0x206694 },
  { name: 'Purple', value: 0x9B59B6 },
  { name: 'Dark Purple', value: 0x71368A },
  { name: 'Gold', value: 0xF1C40F },
  { name: 'Dark Gold', value: 0xC27C0E },
  { name: 'Orange', value: 0xE67E22 },
  { name: 'Dark Orange', value: 0xA84300 },
  { name: 'Magenta', value: 0xE91E63 },
  { name: 'Dark Magenta', value: 0xAD1457 },
  { name: 'Luminous Vivid Pink', value: 0xE91E63 },
  { name: 'Dark Vivid Pink', value: 0xAD1457 },
] as const;

/**
 * Default Discord colors
 */
export const DISCORD_COLORS = {
  BLURPLE: 0x5865F2,
  GREEN: 0x57F287,
  YELLOW: 0xFEE75C,
  FUCHSIA: 0xEB459E,
  RED: 0xED4245,
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
  // Status colors
  ONLINE: 0x43B581,
  IDLE: 0xFAA61A,
  DND: 0xF04747,
  OFFLINE: 0x747F8D,
  // Theme colors
  DARK_BG: '#36393f',
  DARK_SECONDARY: '#2f3136',
  DARK_TERTIARY: '#202225',
  LIGHT_BG: '#ffffff',
  LIGHT_SECONDARY: '#f2f3f5',
} as const;

/**
 * Default embed structure
 */
export const DEFAULT_EMBED = {
  title: '',
  description: '',
  url: '',
  color: DISCORD_COLORS.BLURPLE,
  fields: [],
  author: {
    name: '',
    url: '',
    icon_url: '',
  },
  footer: {
    text: '',
    icon_url: '',
  },
  image: {
    url: '',
  },
  thumbnail: {
    url: '',
  },
} as const;

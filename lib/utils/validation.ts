import { DISCORD_LIMITS } from '../constants/discord';

/**
 * Validates if a string is a valid Discord webhook URL
 */
export const isValidWebhookUrl = (url: string): boolean => {
  if (!url) return false;
  
  const webhookRegex = /^https:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  return webhookRegex.test(url);
};

/**
 * Validates if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid (optional)
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a string is a valid image URL
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return true; // Empty is valid (optional)
  
  if (!isValidUrl(url)) return false;
  
  // Check if URL ends with common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return imageExtensions.test(url) || url.includes('cdn.discord');
};

/**
 * Validates character count against Discord limits
 */
export const validateCharCount = (
  text: string,
  limit: number
): { isValid: boolean; current: number; max: number; percentage: number } => {
  const current = text.length;
  const percentage = (current / limit) * 100;
  
  return {
    isValid: current <= limit,
    current,
    max: limit,
    percentage,
  };
};

/**
 * Calculates total embed character count
 */
export const getTotalEmbedCharCount = (embed: any): number => {
  let total = 0;
  
  if (embed.title) total += embed.title.length;
  if (embed.description) total += embed.description.length;
  if (embed.footer?.text) total += embed.footer.text.length;
  if (embed.author?.name) total += embed.author.name.length;
  
  if (embed.fields) {
    embed.fields.forEach((field: any) => {
      total += field.name.length + field.value.length;
    });
  }
  
  return total;
};

/**
 * Validates if total embed character count is within limits
 */
export const validateTotalEmbedChars = (embed: any): {
  isValid: boolean;
  current: number;
  max: number;
} => {
  const current = getTotalEmbedCharCount(embed);
  const max = DISCORD_LIMITS.EMBED.TOTAL;
  
  return {
    isValid: current <= max,
    current,
    max,
  };
};

/**
 * Sanitizes a color value to ensure it's within valid range
 */
export const sanitizeColor = (color: number | undefined): number => {
  if (color === undefined || color === null) return 0x5865F2;
  if (color < 0) return 0;
  if (color > 0xFFFFFF) return 0xFFFFFF;
  return Math.floor(color);
};

/**
 * Converts hex color string to decimal
 */
export const hexToDecimal = (hex: string): number => {
  const cleaned = hex.replace('#', '');
  return parseInt(cleaned, 16);
};

/**
 * Converts decimal color to hex string
 */
export const decimalToHex = (decimal: number): string => {
  return `#${decimal.toString(16).padStart(6, '0')}`;
};

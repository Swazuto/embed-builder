import { z } from 'zod';

/**
 * Schema for Discord Embed Field
 */
export const EmbedFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required').max(256, 'Field name must be 256 characters or less'),
  value: z.string().min(1, 'Field value is required').max(1024, 'Field value must be 1024 characters or less'),
  inline: z.boolean().default(false),
});

/**
 * Schema for Discord Embed Author
 */
export const EmbedAuthorSchema = z.object({
  name: z.string().max(256, 'Author name must be 256 characters or less'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  icon_url: z.string().url('Invalid icon URL').optional().or(z.literal('')),
});

/**
 * Schema for Discord Embed Footer
 */
export const EmbedFooterSchema = z.object({
  text: z.string().max(2048, 'Footer text must be 2048 characters or less'),
  icon_url: z.string().url('Invalid icon URL').optional().or(z.literal('')),
});

/**
 * Schema for Discord Embed Image
 */
export const EmbedImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
});

/**
 * Schema for Discord Embed Thumbnail
 */
export const EmbedThumbnailSchema = z.object({
  url: z.string().url('Invalid thumbnail URL'),
});

/**
 * Main Discord Embed Schema
 */
export const EmbedSchema = z.object({
  title: z.string().max(256, 'Title must be 256 characters or less').optional(),
  description: z.string().max(4096, 'Description must be 4096 characters or less').optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  color: z.number().int().min(0).max(0xFFFFFF).optional(),
  timestamp: z.string().datetime().optional(),
  author: EmbedAuthorSchema.optional(),
  thumbnail: EmbedThumbnailSchema.optional(),
  image: EmbedImageSchema.optional(),
  fields: z.array(EmbedFieldSchema).max(25, 'Maximum 25 fields allowed').optional(),
  footer: EmbedFooterSchema.optional(),
});

/**
 * Schema for Discord Webhook Payload
 */
export const WebhookPayloadSchema = z.object({
  content: z.string().max(2000, 'Content must be 2000 characters or less').optional(),
  username: z.string().max(80, 'Username must be 80 characters or less').optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
  embeds: z.array(EmbedSchema).min(1, 'At least one embed is required').max(10, 'Maximum 10 embeds allowed'),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type EmbedField = z.infer<typeof EmbedFieldSchema>;
export type EmbedAuthor = z.infer<typeof EmbedAuthorSchema>;
export type EmbedFooter = z.infer<typeof EmbedFooterSchema>;
export type EmbedImage = z.infer<typeof EmbedImageSchema>;
export type EmbedThumbnail = z.infer<typeof EmbedThumbnailSchema>;
export type Embed = z.infer<typeof EmbedSchema>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

/**
 * Template structure for saving/loading embeds
 */
export interface Template {
  id: string;
  name: string;
  description?: string;
  embed: Embed;
  webhookUrl?: string;
  content?: string;
  webhookUsername?: string;
  webhookAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Embed state for the application
 */
export interface EmbedState {
  embed: Embed;
  webhookUrl: string;
  content: string;
  webhookUsername?: string;
  webhookAvatar?: string;
}

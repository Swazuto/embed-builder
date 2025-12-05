import { create } from 'zustand';
import { Embed, EmbedField } from '../types/embed.types';
import { DISCORD_COLORS } from '../constants/discord';

export interface EmbedStore {
  // Embed data
  embed: Embed;
  
  // Webhook settings
  webhookUrl: string;
  webhookUsername: string;
  webhookAvatar: string;
  content: string;
  
  // Actions
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setUrl: (url: string) => void;
  setColor: (color: number) => void;
  setTimestamp: (timestamp: string | undefined) => void;
  
  setAuthor: (author: Embed['author']) => void;
  setFooter: (footer: Embed['footer']) => void;
  setImage: (imageUrl: string) => void;
  setThumbnail: (thumbnailUrl: string) => void;
  
  addField: () => void;
  updateField: (index: number, field: Partial<EmbedField>) => void;
  removeField: (index: number) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  
  setWebhookUrl: (url: string) => void;
  setWebhookUsername: (username: string) => void;
  setWebhookAvatar: (avatar: string) => void;
  setContent: (content: string) => void;
  
  loadEmbed: (embed: Embed) => void;
  loadState: (state: Partial<EmbedStore>) => void;
  clearAll: () => void;
  
  getEmbedJSON: () => object;
}

export const initialEmbed: Embed = {
  title: '',
  description: '',
  url: '',
  color: DISCORD_COLORS.BLURPLE,
  fields: [],
};

export const useEmbedStore = create<EmbedStore>((set, get) => ({
  // Initial state
  embed: initialEmbed,
  webhookUrl: '',
  webhookUsername: '',
  webhookAvatar: '',
  content: '',
  
  // Basic info actions
  setTitle: (title) => set((state) => ({
    embed: { ...state.embed, title: title || undefined }
  })),
  
  setDescription: (description) => set((state) => ({
    embed: { ...state.embed, description: description || undefined }
  })),
  
  setUrl: (url) => set((state) => ({
    embed: { ...state.embed, url: url || undefined }
  })),
  
  setColor: (color) => set((state) => ({
    embed: { ...state.embed, color }
  })),
  
  setTimestamp: (timestamp) => set((state) => ({
    embed: { ...state.embed, timestamp }
  })),
  
  // Author, Footer, Images
  setAuthor: (author) => set((state) => ({
    embed: { 
      ...state.embed, 
      author: (author?.name || author?.url || author?.icon_url) ? author : undefined 
    }
  })),
  
  setFooter: (footer) => set((state) => ({
    embed: { 
      ...state.embed, 
      footer: (footer?.text || footer?.icon_url) ? footer : undefined 
    }
  })),
  
  setImage: (imageUrl) => set((state) => ({
    embed: { 
      ...state.embed, 
      image: imageUrl ? { url: imageUrl } : undefined 
    }
  })),
  
  setThumbnail: (thumbnailUrl) => set((state) => ({
    embed: { 
      ...state.embed, 
      thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined 
    }
  })),
  
  // Fields actions
  addField: () => set((state) => ({
    embed: {
      ...state.embed,
      fields: [
        ...(state.embed.fields || []),
        { name: 'Field Name', value: 'Field Value', inline: false }
      ]
    }
  })),
  
  updateField: (index, field) => set((state) => {
    const fields = [...(state.embed.fields || [])];
    fields[index] = { ...fields[index], ...field };
    return {
      embed: { ...state.embed, fields }
    };
  }),
  
  removeField: (index) => set((state) => ({
    embed: {
      ...state.embed,
      fields: state.embed.fields?.filter((_, i) => i !== index)
    }
  })),
  
  reorderFields: (startIndex, endIndex) => set((state) => {
    const fields = [...(state.embed.fields || [])];
    const [removed] = fields.splice(startIndex, 1);
    fields.splice(endIndex, 0, removed);
    return {
      embed: { ...state.embed, fields }
    };
  }),
  
  // Webhook actions
  setWebhookUrl: (url) => set({ webhookUrl: url }),
  setWebhookUsername: (username) => set({ webhookUsername: username }),
  setWebhookAvatar: (avatar) => set({ webhookAvatar: avatar }),
  setContent: (content) => set({ content }),
  
  // Utility actions
  loadEmbed: (embed) => set({ embed }),
  
  loadState: (partialState) => set((state) => ({
    embed: partialState.embed ?? state.embed,
    webhookUrl: partialState.webhookUrl ?? state.webhookUrl,
    webhookUsername: partialState.webhookUsername ?? state.webhookUsername,
    webhookAvatar: partialState.webhookAvatar ?? state.webhookAvatar,
    content: partialState.content ?? state.content,
  })),
  
  clearAll: () => set({
    embed: { ...initialEmbed, fields: [] },
    webhookUrl: '',
    webhookUsername: '',
    webhookAvatar: '',
    content: '',
  }),
  
  getEmbedJSON: () => {
    const state = get();
    const embed = { ...state.embed };
    
    // Remove empty fields
    if (!embed.title) delete embed.title;
    if (!embed.description) delete embed.description;
    if (!embed.url) delete embed.url;
    if (!embed.author?.name && !embed.author?.url && !embed.author?.icon_url) delete embed.author;
    if (!embed.footer?.text && !embed.footer?.icon_url) delete embed.footer;
    if (!embed.image?.url) delete embed.image;
    if (!embed.thumbnail?.url) delete embed.thumbnail;
    if (!embed.fields || embed.fields.length === 0) delete embed.fields;
    
    return {
      content: state.content || undefined,
      embeds: [embed]
    };
  },
}));

import { Embed, Template } from '../types/embed.types';

const STORAGE_KEY = 'discord_embed_templates';
const AUTOSAVE_KEY = 'discord_embed_autosave';

/**
 * Storage manager for templates and autosave
 */
export const storageManager = {
  /**
   * Get all saved templates
   */
  getTemplates(): Template[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load templates:', error);
      return [];
    }
  },

  /**
   * Save a new template
   */
  saveTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Template {
    const templates = this.getTemplates();
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    templates.push(newTemplate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    
    return newTemplate;
  },

  /**
   * Update an existing template
   */
  updateTemplate(id: string, updates: Partial<Omit<Template, 'id' | 'createdAt'>>): void {
    const templates = this.getTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  },

  /**
   * Delete a template
   */
  deleteTemplate(id: string): void {
    const templates = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  },

  /**
   * Export a template to JSON file
   */
  exportTemplate(template: Template): void {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, '_')}_embed.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Import a template from JSON file
   */
  importTemplate(file: File): Promise<Template> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string);
          
          // Validate template structure
          if (!template.embed) {
            throw new Error('Invalid template format: missing embed data');
          }
          
          resolve(template);
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to parse template'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  /**
   * Autosave current embed state
   */
  autosave(embedState: any): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(embedState));
    } catch (error) {
      console.error('Failed to autosave:', error);
    }
  },

  /**
   * Load autosaved embed state
   */
  loadAutosave(): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(AUTOSAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load autosave:', error);
      return null;
    }
  },

  /**
   * Clear autosave
   */
  clearAutosave(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTOSAVE_KEY);
  },

  /**
   * Copy JSON to clipboard
   */
  async copyToClipboard(data: any): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(jsonString);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = jsonString;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
      } catch (error) {
        throw new Error('Failed to copy to clipboard');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  },
};

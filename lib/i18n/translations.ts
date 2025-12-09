export type Language = 'pt-BR' | 'en-US' | 'ru' | 'ja' | 'zh';

export interface Translations {
  embedEditor: string;
  preview: string;
  basic: string;
  author: string;
  fields: string;
  images: string;
  footer: string;
  message: string;
  webhook: string;
  title: string;
  titlePlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  url: string;
  urlPlaceholder: string;
  urlLabel: string;
  color: string;
  addTimestamp: string;
  authorName: string;
  authorNamePlaceholder: string;
  authorUrl: string;
  authorUrlPlaceholder: string;
  authorIcon: string;
  authorIconPlaceholder: string;
  addField: string;
  fieldName: string;
  fieldNamePlaceholder: string;
  fieldValue: string;
  fieldValuePlaceholder: string;
  inline: string;
  removeField: string;
  maxFields: string;
  thumbnail: string;
  thumbnailPlaceholder: string;
  image: string;
  imagePlaceholder: string;
  footerText: string;
  footerTextPlaceholder: string;
  footerIcon: string;
  footerIconPlaceholder: string;
  webhookUrl: string;
  webhookUrlPlaceholder: string;
  required: string;
  botUsername: string;
  botUsernamePlaceholder: string;
  optional: string;
  botAvatar: string;
  botAvatarPlaceholder: string;
  messageContent: string;
  messageContentPlaceholder: string;
  sendToWebhook: string;
  copyJson: string;
  clearAll: string;
  clearAllConfirm: string;
  yes: string;
  no: string;
  saveTemplate: string;
  loadTemplate: string;
  importJson: string;
  exportJson: string;
  templateName: string;
  templateNamePlaceholder: string;
  templateDescription: string;
  templateDescriptionPlaceholder: string;
  save: string;
  cancel: string;
  load: string;
  delete: string;
  createdAt: string;
  webhookUrlRequired: string;
  webhookSent: string;
  webhookError: string;
  jsonCopied: string;
  jsonCopyError: string;
  templateNameRequired: string;
  templateSaved: string;
  templateSaveError: string;
  templateLoaded: string;
  templateDeleted: string;
  templateImported: string;
  templateImportError: string;
  jsonExported: string;
  discordColors: string;
  customColor: string;
  selectLanguage: string;
}

import ptBR from './languages/pt-BR.json';
import enUS from './languages/en-US.json';
import ru from './languages/ru.json';
import ja from './languages/ja.json';
import zh from './languages/zh.json';

// Lazy load translations from JSON files
const loadedTranslations: Record<Language, Translations | null> = {
  'pt-BR': null,
  'en-US': null,
  'ru': null,
  'ja': null,
  'zh': null,
};

async function loadTranslation(language: Language): Promise<Translations> {
  if (loadedTranslations[language]) {
    return loadedTranslations[language]!;
  }

  const languageFiles: Record<Language, () => Promise<any>> = {
    'pt-BR': () => import('./languages/pt-BR.json'),
    'en-US': () => import('./languages/en-US.json'),
    'ru': () => import('./languages/ru.json'),
    'ja': () => import('./languages/ja.json'),
    'zh': () => import('./languages/zh.json'),
  };

  const module = await languageFiles[language]();
  const translation = module.default as Translations;
  loadedTranslations[language] = translation;
  return translation;
}

// For synchronous access, use static imports
export const translations: Record<Language, Translations> = {
  'pt-BR': ptBR as Translations,
  'en-US': enUS as Translations,
  'ru': ru as Translations,
  'ja': ja as Translations,
  'zh': zh as Translations,
};

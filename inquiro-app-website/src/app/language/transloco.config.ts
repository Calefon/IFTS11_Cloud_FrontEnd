import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

export enum AvailableLanguages {
  DE = 'de',
  ES = 'es',
  EN = 'en',
  FR = 'fr',
  IT = 'it',
  JA = 'ja',
  KO = 'ko',
  NL = 'nl',
  PL = 'pl',
  PT = 'pt',
  ZH = 'zh',
}

export const AvailableLanguagesList = [
  AvailableLanguages.DE,
  AvailableLanguages.ES,
  AvailableLanguages.EN,
  AvailableLanguages.FR,
  AvailableLanguages.IT,
  AvailableLanguages.JA,
  AvailableLanguages.KO,
  AvailableLanguages.NL,
  AvailableLanguages.PL,
  AvailableLanguages.PT,
  AvailableLanguages.ZH,
];

const config: TranslocoGlobalConfig = {
  langs: AvailableLanguagesList,
  defaultLang: AvailableLanguages.ES,
  rootTranslationsPath: 'assets/i18n',
};

export default config;

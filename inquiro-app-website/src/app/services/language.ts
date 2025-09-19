// src/app/core/i18n/language.service.ts
import { Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AvailableLanguages, AvailableLanguagesList } from '../language/transloco.config';

export type LangItem = { code: string; label: string; flag: string };

const LANGUAGE_STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  // Mapa simple de etiquetas y banderas por código
  private labels: Record<string, string> = {
    [AvailableLanguages.DE]: 'Deutsch',
    [AvailableLanguages.EN]: 'English',
    [AvailableLanguages.ES]: 'Español',
    [AvailableLanguages.FR]: 'Français',
    [AvailableLanguages.IT]: 'Italiano',
    [AvailableLanguages.JA]: '日本語',
    [AvailableLanguages.KO]: '한국어',
    [AvailableLanguages.NL]: 'Nederlands',
    [AvailableLanguages.PL]: 'Polski',
    [AvailableLanguages.PT]: 'Português',
    [AvailableLanguages.ZH]: '中文',
  };

  private flags: Record<string, string> = {
    [AvailableLanguages.DE]: '🇩🇪',
    [AvailableLanguages.EN]: '🇬🇧',
    [AvailableLanguages.ES]: '🇪🇸',
    [AvailableLanguages.FR]: '🇫🇷',
    [AvailableLanguages.IT]: '🇮🇹',
    [AvailableLanguages.JA]: '🇯🇵',
    [AvailableLanguages.KO]: '🇰🇷',
    [AvailableLanguages.NL]: '🇳🇱',
    [AvailableLanguages.PL]: '🇵🇱',
    [AvailableLanguages.PT]: '🇵🇹',
    [AvailableLanguages.ZH]: '🇨🇳',
  };

  // Lista pública (derivada del enum/lista global)
  readonly available: LangItem[] = AvailableLanguagesList.map((code) => ({
    code,
    label: this.labels[code] ?? code.toUpperCase(),
    flag: this.flags[code] ?? '🌐',
  }));

  // Idioma activo como signal
  active = signal<LangItem>(this.available[0]);

  constructor(private transloco: TranslocoService) {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const initial =
      saved && this.available.find((l) => l.code === saved)?.code
        ? saved
        : this.transloco.getActiveLang() || this.available[0].code;

    this.set(initial as string, false);
  }

  set(code: string, persist = true) {
    const found = this.available.find((l) => l.code === code);
    if (!found) return;
    this.transloco.setActiveLang(found.code);
    this.active.set(found);
    if (persist) localStorage.setItem(LANGUAGE_STORAGE_KEY, found.code);
  }

  is(code: string) {
    return this.active().code === code;
  }
}

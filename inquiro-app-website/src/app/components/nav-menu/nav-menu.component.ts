import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { LanguageService } from '../../services/language';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-nav-menu',
  imports: [TranslocoPipe],
  templateUrl: './nav-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  readonly themeService = inject(ThemeService);
  readonly lang = inject(LanguageService);

  langOpen = signal(false);

  toggleTheme() { this.themeService.toggleTheme(); }
  toggleLangMenu() { this.langOpen.update(v => !v); }
  selectLang(code: string) { this.lang.set(code); this.langOpen.set(false); }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const el = ev.target as HTMLElement;
    if (el.closest('#lang-toggle') || el.closest('#lang-menu')) return;
    this.langOpen.set(false);
  }
}

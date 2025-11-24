import { Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { DyslexicFontService } from '../../services/dyslexic-font.service'

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  @Output() logOutClickEvent = new EventEmitter<void>();
  readonly themeService = inject(ThemeService);
  readonly dyslexicService = inject(DyslexicFontService);

  toggleTheme() { this.themeService.toggleTheme(); }

  toggleDyslexic() {this.dyslexicService.toggleDFont(); }
    
  logOutClick(){
    this.logOutClickEvent.emit();
  }
}

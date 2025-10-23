import { Component, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  @Output() logOutClickEvent = new EventEmitter<void>();
  readonly themeService = inject(ThemeService);

  toggleTheme() { this.themeService.toggleTheme(); }
    
  logOutClick(){
    this.logOutClickEvent.emit();
  }
}

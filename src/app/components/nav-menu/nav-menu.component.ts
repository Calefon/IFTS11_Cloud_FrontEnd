import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  @Output() logOutClickEvent = new EventEmitter<void>();

  logOutClick(){
    this.logOutClickEvent.emit();
  }
}

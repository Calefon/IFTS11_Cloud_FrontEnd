import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page-component',
  imports: [],
  templateUrl: './home-page-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponentComponent { }

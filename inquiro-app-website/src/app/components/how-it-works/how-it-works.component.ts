import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-how-it-works',
  imports: [],
  templateUrl: './how-it-works.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  activeIdx = signal(0);

  setActive(i: number) {
    this.activeIdx.set(i);
  }
}

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-how-it-works',
  imports: [TranslocoPipe],
  templateUrl: './how-it-works.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  activeIdx = signal(0);

  setActive(i: number) {
    this.activeIdx.set(i);
  }
}

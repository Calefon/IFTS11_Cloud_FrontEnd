import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-plans-plan',
  imports: [TranslocoPipe],
  templateUrl: './plans-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansPlanComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() free!: string;
  @Input() price!: number;
  @Input() period!: string; // text after price
  @Input() badge?: string;
  @Input() highlight = false;
  @Input() ctaLabel = 'Choose plan';
  @Input() ctaHref = '#';
  @Input() features: { label: string; included: boolean }[] = [];
}

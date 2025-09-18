import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-plans-plan',
  imports: [],
  templateUrl: './plans-plan.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansPlanComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() price!: number; // display price
  @Input() period: string = 'month'; // text after price
  @Input() badge?: string;
  @Input() highlight = false;
  @Input() ctaLabel = 'Choose plan';
  @Input() ctaHref = '#';
  @Input() features: { label: string; included: boolean }[] = [];
}

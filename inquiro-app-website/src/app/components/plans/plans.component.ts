import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PlansPlanComponent } from './plans-plan/plans-plan.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-plans',
  imports: [PlansPlanComponent, TranslocoPipe],
  templateUrl: './plans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansComponent {
  private transloco = inject(TranslocoService);

  billing = signal<'monthly' | 'yearly'>('monthly');

  plans: Plan[] = [
    {
      id: 'starter',
      title: 'plans.tiers.starter.name',
      description: 'plans.tiers.starter.desc',
      free: 'plans.tiers.starter.free',
      ctaLabel: 'plans.tiers.starter.cta',
      ctaHref: '#plans',
      features: [
        { label: 'plans.tiers.starter.features.label1', included: true },
        { label: 'plans.tiers.starter.features.label2', included: true },
        { label: 'plans.tiers.starter.features.label3', included: true },
        { label: 'plans.tiers.starter.features.label4', included: false },
        { label: 'plans.tiers.starter.features.label5', included: false },
        { label: 'plans.tiers.starter.features.label6', included: false },
      ],
    },
    {
      id: 'pro',
      title: 'plans.tiers.pro.name',
      description: 'plans.tiers.pro.desc',
      price: 19,
      period: 'plans.tiers.pro.period',
      badge: 'plans.tiers.pro.badge',
      highlight: true,
      ctaLabel: 'plans.tiers.pro.cta',
      ctaHref: '#plans',
      features: [
        { label: 'plans.tiers.pro.features.label1', included: true },
        { label: 'plans.tiers.pro.features.label2', included: true },
        { label: 'plans.tiers.pro.features.label3', included: true },
        { label: 'plans.tiers.pro.features.label4', included: true },
        { label: 'plans.tiers.pro.features.label5', included: true },
        { label: 'plans.tiers.pro.features.label6', included: false },
      ],
    },
    {
      id: 'business',
      title: 'plans.tiers.business.name',
      description: 'plans.tiers.business.desc',
      price: 49,
      period: 'plans.tiers.business.period',
      ctaLabel: 'plans.tiers.business.cta',
      ctaHref: '#plans',
      features: [
        { label: 'plans.tiers.pro.features.label1', included: true },
        { label: 'plans.tiers.pro.features.label2', included: true },
        { label: 'plans.tiers.pro.features.label3', included: true },
        { label: 'plans.tiers.pro.features.label4', included: true },
        { label: 'plans.tiers.pro.features.label5', included: true },
        { label: 'plans.tiers.pro.features.label6', included: true },
      ],
    },
  ];
}

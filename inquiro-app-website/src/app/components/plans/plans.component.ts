import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PlansPlanComponent } from './plans-plan/plans-plan.component';

@Component({
  selector: 'app-plans',
  imports: [PlansPlanComponent],
  templateUrl: './plans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansComponent {
  billing = signal<'monthly' | 'yearly'>('monthly');

  plans: Plan[] = [
    {
      id: 'starter',
      title: 'Starter',
      description: 'For trying out surveys and basic reporting.',
      monthly: 0,
      yearly: 0,
      ctaLabel: 'Get started',
      ctaHref: '#plans',
      features: [
        { label: 'Up to 3 active surveys', included: true },
        { label: '100 responses / month', included: true },
        { label: 'Basic charts', included: true },
        { label: 'AI insights', included: false },
        { label: 'Team collaboration', included: false },
        { label: 'Priority support', included: false },
      ],
    },
    {
      id: 'pro',
      title: 'Pro',
      description: 'Advanced analytics and AI insights for growing teams.',
      monthly: 19,
      yearly: 15, // $15/mo billed yearly (~20% off)
      badge: 'Recommended',
      highlight: true,
      ctaLabel: 'Start Pro',
      ctaHref: '#plans',
      features: [
        { label: 'Unlimited surveys', included: true },
        { label: '5,000 responses / month', included: true },
        { label: 'Advanced charts & exports', included: true },
        { label: 'AI insights & summaries', included: true },
        { label: 'Team collaboration (5 seats)', included: true },
        { label: 'Priority support', included: false },
      ],
    },
    {
      id: 'business',
      title: 'Business',
      description: 'For organisations that need scale, security and SLA.',
      monthly: 49,
      yearly: 39, // $39/mo billed yearly
      ctaLabel: 'Contact sales',
      ctaHref: '#plans',
      features: [
        { label: 'Unlimited surveys', included: true },
        { label: '50,000+ responses / month', included: true },
        { label: 'Custom dashboards & SSO', included: true },
        { label: 'AI recommendations & automations', included: true },
        { label: 'Team collaboration (unlimited)', included: true },
        { label: 'Priority support & SLA', included: true },
      ],
    },
  ];
}

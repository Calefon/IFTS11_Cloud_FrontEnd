import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonials-testimonial',
  imports: [],
  templateUrl: './testimonials-testimonial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsTestimonialComponent {
  @Input() text!: string;
  @Input() author!: string;
  @Input() role?: string;
  @Input() avatar!: string;
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestimonialsTestimonialComponent } from './testimonials-testimonial/testimonials-testimonial.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-testimonials',
  imports: [TestimonialsTestimonialComponent, TranslocoPipe],
  templateUrl: './testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      quote: 'testimonials.list.t1.quote',
      author: 'testimonials.list.t1.author',
      role: 'testimonials.list.t1.role',
      avatar: 'testimonials.list.t1.avatar',
    },
    {
      quote: 'testimonials.list.t2.quote',
      author: 'testimonials.list.t2.author',
      role: 'testimonials.list.t2.role',
      avatar: 'testimonials.list.t2.avatar',
    },
    {
      quote: 'testimonials.list.t3.quote',
      author: 'testimonials.list.t3.author',
      role: 'testimonials.list.t3.role',
      avatar: 'testimonials.list.t3.avatar',
    },
    {
      quote: 'testimonials.list.t4.quote',
      author: 'testimonials.list.t4.author',
      role: 'testimonials.list.t4.role',
      avatar: 'testimonials.list.t4.avatar',
    },
    {
      quote: 'testimonials.list.t5.quote',
      author: 'testimonials.list.t5.author',
      role: 'testimonials.list.t5.role',
      avatar: 'testimonials.list.t5.avatar',
    },
    {
      quote: 'testimonials.list.t6.quote',
      author: 'testimonials.list.t6.author',
      role: 'testimonials.list.t6.role',
      avatar: 'testimonials.list.t6.avatar',
    },
  ];
}

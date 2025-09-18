import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestimonialsTestimonialComponent } from './testimonials-testimonial/testimonials-testimonial.component';

@Component({
  selector: 'app-testimonials',
  imports: [TestimonialsTestimonialComponent],
  templateUrl: './testimonials.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      text: "I just wanted to say that I'm very happy with my purchase so far. The documentation is outstanding - clear and detailed.",
      author: 'Josh Grazioso',
      role: 'Product Manager at Acme',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&...',
    },
    {
      text: 'The platform helped us collect insights faster than ever. Our team can now make decisions in real time.',
      author: 'Sophie Lee',
      role: 'Marketing Lead at Startup X',
      avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?...',
    },
    {
      text: 'AI-powered recommendations are a game changer. It feels like having an analyst 24/7.',
      author: 'Daniel Ruiz',
      role: 'Operations Director at Beta Corp',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?...',
    },
    {
      text: 'The survey builder is super intuitive. I created my first form in minutes and had responses the same day.',
      author: 'Emily Carter',
      role: 'HR Specialist at Bright Solutions',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    },
    {
      text: 'We were able to increase customer satisfaction by quickly understanding their needs through visualised data.',
      author: 'Michael Tan',
      role: 'Customer Experience Lead at NovaTech',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    },
    {
      text: 'Our leadership team now makes decisions confidently thanks to the AI insights. It really accelerated our growth.',
      author: 'Lucía Fernández',
      role: 'CEO at Visionary Labs',
      avatar:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    },
  ];
}

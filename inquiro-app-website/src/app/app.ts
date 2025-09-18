import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { FeaturedTechnologiesComponent } from './components/featured-technologies/featured-technologies.component';
import { PlansComponent } from './components/plans/plans.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { HowItWorksComponent } from "./components/how-it-works/how-it-works.component";
import { ContactComponent } from "./components/contact/contact.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent, HomeComponent, FeaturedTechnologiesComponent, PlansComponent, TestimonialsComponent, FooterComponent, HowItWorksComponent, ContactComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('inquiro-app-website');
}

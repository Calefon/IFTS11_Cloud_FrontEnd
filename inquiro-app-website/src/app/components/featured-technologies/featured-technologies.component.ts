import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-featured-technologies',
  imports: [TranslocoPipe],
  templateUrl: './featured-technologies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedTechnologiesComponent { }

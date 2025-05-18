import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ListComponent } from './app/list/list.component';
import { DetailComponent } from './app/detail/detail.component';
import { ListService } from './app/services/list.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ListComponent, DetailComponent],
  template: `
    <div class="container">
      <app-list class="list-container"></app-list>
      <app-detail class="detail-container"></app-detail>
    </div>
  `,
})
export class App {
  title = 'Accessible List-Detail View';
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    ListService
  ]
});

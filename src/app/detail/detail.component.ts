import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../services/list.service';
import { ListItem } from '../models/list-item.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (selectedItem(); as item) {
      <div>
        <h2>{{ item.name }} Details</h2>
        <p>{{ item.description }}</p>
        <button type="button">Do nothing</button>
      </div>
    } @else {
      <p>Please select an item from the list to view its details.</p>
    }
  `
})
export class DetailComponent {
  private listService = inject(ListService);
  
  // Signal-based approach
  selectedItem = computed(() => this.listService.selectedItem());
}

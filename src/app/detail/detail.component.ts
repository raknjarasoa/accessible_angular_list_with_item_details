import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../services/list.service';
import { ListItem } from '../models/list-item.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="selectedItem; else noSelection">
      <h2>{{ selectedItem.name }} Details</h2>
      <p>{{ selectedItem.description }}</p>
			<button type="button">Do nothing</button>
    </div>
    <ng-template #noSelection>
      <p>Please select an item from the list to view its details.</p>
    </ng-template>
  `
})
export class DetailComponent implements OnInit, OnDestroy {
  selectedItem: ListItem | null = null;
  private subscription = new Subscription();

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.listService.getSelectedItem().subscribe(item => {
        this.selectedItem = item;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

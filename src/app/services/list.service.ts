import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ListItem } from '../models/list-item.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private itemsSignal = signal<ListItem[]>([
    { id: 1, name: 'Item 1', description: 'This is the first item with detailed information.' },
    { id: 2, name: 'Item 2', description: 'This is the second item with more detailed information.' },
    { id: 3, name: 'Item 3', description: 'This is the third item with even more detailed information.' },
    { id: 4, name: 'Item 4', description: 'This is the fourth item with additional detailed information.' },
    { id: 5, name: 'Item 5', description: 'This is the fifth item with comprehensive detailed information.' }
  ]);
  
  private selectedItemSignal = signal<ListItem | null>(null);

  // Computed values
  readonly items = computed(() => this.itemsSignal());
  readonly selectedItem = computed(() => this.selectedItemSignal());

  constructor() {
    // Initialize with the first item selected
    const initialItems = this.itemsSignal();
    if (initialItems.length > 0) {
      this.selectedItemSignal.set(initialItems[0]);
    }
  }

  // Legacy methods for backward compatibility
  getItems(): Observable<ListItem[]> {
    return of(this.items());
  }

  getSelectedItem(): Observable<ListItem | null> {
    return of(this.selectedItem());
  }

  selectItem(item: ListItem): void {
    this.selectedItemSignal.set(item);
  }

  moveItemUp(id: number): void {
    const items = [...this.itemsSignal()];
    const index = items.findIndex(item => item.id === id);
    
    if (index > 0) {
      // Swap with the item above
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      this.itemsSignal.set(items);
    }
  }

  moveItemDown(id: number): void {
    const items = [...this.itemsSignal()];
    const index = items.findIndex(item => item.id === id);
    
    if (index < items.length - 1) {
      // Swap with the item below
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      this.itemsSignal.set(items);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListItem } from '../models/list-item.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private items: ListItem[] = [
    { id: 1, name: 'Item 1', description: 'This is the first item with detailed information.' },
    { id: 2, name: 'Item 2', description: 'This is the second item with more detailed information.' },
    { id: 3, name: 'Item 3', description: 'This is the third item with even more detailed information.' },
    { id: 4, name: 'Item 4', description: 'This is the fourth item with additional detailed information.' },
    { id: 5, name: 'Item 5', description: 'This is the fifth item with comprehensive detailed information.' }
  ];

  private itemsSubject = new BehaviorSubject<ListItem[]>(this.items);
  private selectedItemSubject = new BehaviorSubject<ListItem | null>(null);

  constructor() {
    // Initialize with the first item selected
    if (this.items.length > 0) {
      this.selectedItemSubject.next(this.items[0]);
    }
  }

  getItems(): Observable<ListItem[]> {
    return this.itemsSubject.asObservable();
  }

  getSelectedItem(): Observable<ListItem | null> {
    return this.selectedItemSubject.asObservable();
  }

  selectItem(item: ListItem): void {
    this.selectedItemSubject.next(item);
  }

  moveItemUp(id: number): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index > 0) {
      // Swap with the item above
      [this.items[index - 1], this.items[index]] = [this.items[index], this.items[index - 1]];
      this.itemsSubject.next([...this.items]);
    }
  }

  moveItemDown(id: number): void {
    const index = this.items.findIndex(item => item.id === id);
    if (index < this.items.length - 1) {
      // Swap with the item below
      [this.items[index], this.items[index + 1]] = [this.items[index + 1], this.items[index]];
      this.itemsSubject.next([...this.items]);
    }
  }
}

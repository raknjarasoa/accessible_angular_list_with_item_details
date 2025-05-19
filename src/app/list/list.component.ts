import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ElementRef, 
  ViewChildren, 
  AfterViewInit, 
  signal, 
  computed, 
  effect, 
  viewChildren, 
  inject 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListService } from '../services/list.service';
import { ListItem } from '../models/list-item.model';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, A11yModule],
  template: `
    <h2 id="list-heading">Items List</h2>
    <div 
      role="list" 
      aria-labelledby="list-heading"
      (keydown)="onKeyDown($event)">
      @for (item of items(); track item.id; let i = $index) {
        <div 
          class="list-item"
          [class.selected]="isSelected(item)"
          [attr.aria-selected]="isSelected(item)"
          [attr.tabindex]="isSelected(item) ? 0 : -1"
          role="listitem"
          [id]="'item-' + item.id"
          (click)="selectItem(item)"
          (focus)="onItemFocus(item)"
          #listItemElement>
          <span class="item-name">{{ item.name }}</span>
          <div class="item-controls">
            <button 
              [attr.aria-label]="'Move ' + item.name + ' up'"
              [disabled]="i === 0"
              (click)="moveUp(item, $event)"
              [attr.tabindex]="isButtonInTabOrder(item, 'up') ? 0 : -1"
              #moveUpButton>
              Move Up
            </button>
            <button 
              [attr.aria-label]="'Move ' + item.name + ' down'"
              [disabled]="i === items().length - 1"
              (click)="moveDown(item, $event)"
              [attr.tabindex]="isButtonInTabOrder(item, 'down') ? 0 : -1"
              #moveDownButton>
              Move Down
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  private listService = inject(ListService);
  
  // Signals
  items = computed(() => this.listService.items());
  selectedItem = computed(() => this.listService.selectedItem());
  
  // View children using signal-based API
  listItemElements = viewChildren<ElementRef>('listItemElement');
  moveUpButtons = viewChildren<ElementRef>('moveUpButton');
  moveDownButtons = viewChildren<ElementRef>('moveDownButton');

  constructor() {
    // Setup effect to focus selected item when it changes
    effect(() => {
      const item = this.selectedItem();
      if (item) {
        setTimeout(() => this.focusSelectedItem());
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.focusSelectedItem());
  }

  ngOnDestroy(): void {}

  isSelected(item: ListItem): boolean {
    return this.selectedItem()?.id === item.id;
  }

  selectItem(item: ListItem): void {
    this.listService.selectItem(item);
  }

  onItemFocus(item: ListItem): void {
    this.selectItem(item);
  }

  moveUp(item: ListItem, event: Event): void {
    event.stopPropagation();
    this.listService.moveItemUp(item.id);
  }

  moveDown(item: ListItem, event: Event): void {
    event.stopPropagation();
    this.listService.moveItemDown(item.id);
  }

  isButtonInTabOrder(item: ListItem, buttonType: 'up' | 'down'): boolean {
    // Only buttons for the selected item should be in the tab order
    if (!this.isSelected(item)) return false;
    
    const index = this.items().findIndex(i => i.id === item.id);
    
    // Disable tabbing to disabled buttons
    if (buttonType === 'up' && index === 0) return false;
    if (buttonType === 'down' && index === this.items().length - 1) return false;
    
    return true;
  }

  onKeyDown(event: KeyboardEvent): void {
    const selectedItem = this.selectedItem();
    if (!selectedItem) return;

    const currentIndex = this.items().findIndex(item => item.id === selectedItem.id);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < this.items().length - 1) {
          this.selectItem(this.items()[currentIndex + 1]);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          this.selectItem(this.items()[currentIndex - 1]);
        }
        break;
      case 'Tab':
        this.handleTabNavigation(event);
        break;
    }
  }

  handleTabNavigation(event: KeyboardEvent): void {
    const selectedItem = this.selectedItem();
    if (!selectedItem) return;
    
    const currentIndex = this.items().findIndex(item => item.id === selectedItem.id);
    const isFirstItem = currentIndex === 0;
    const isLastItem = currentIndex === this.items().length - 1;
    
    // Get the active element
    const activeElement = document.activeElement;
    
    // If shift+tab is pressed (reverse navigation)
    if (event.shiftKey) {
      // If we're on the list item
      if (activeElement === this.getListItemElement(currentIndex)?.nativeElement) {
        // If not the first item, move to the previous item
        if (currentIndex > 0) {
          event.preventDefault();
          this.selectItem(this.items()[currentIndex - 1]);
          return;
        }
        // If it's the first item, let the browser handle it (shift+tab out of the list)
        return;
      }
      
      // If we're on the "Move Up" button
      if (activeElement === this.getMoveUpButton(currentIndex)?.nativeElement) {
        // Focus the list item
        event.preventDefault();
        this.getListItemElement(currentIndex)?.nativeElement.focus();
        return;
      }
      
      // If we're on the "Move Down" button
      if (activeElement === this.getMoveDownButton(currentIndex)?.nativeElement) {
        // Try to focus "Move Up" button if it's enabled
        if (!isFirstItem) {
          event.preventDefault();
          this.getMoveUpButton(currentIndex)?.nativeElement.focus();
          return;
        } else {
          // If "Move Up" is disabled, focus the list item
          event.preventDefault();
          this.getListItemElement(currentIndex)?.nativeElement.focus();
          return;
        }
      }
    } 
    // If tab is pressed (forward navigation)
    else {
      // If we're on the list item
      if (activeElement === this.getListItemElement(currentIndex)?.nativeElement) {
        // Try to focus "Move Up" button if it's enabled
        if (!isFirstItem) {
          event.preventDefault();
          this.getMoveUpButton(currentIndex)?.nativeElement.focus();
          return;
        } 
        // If "Move Up" is disabled, try to focus "Move Down" button if it's enabled
        else if (!isLastItem) {
          event.preventDefault();
          this.getMoveDownButton(currentIndex)?.nativeElement.focus();
          return;
        }
        // If both buttons are disabled, move to the next item if available
        else if (currentIndex < this.items().length - 1) {
          event.preventDefault();
          this.selectItem(this.items()[currentIndex + 1]);
          return;
        }
        // Otherwise, let the browser handle it (tab out of the list)
        return;
      }
      
      // If we're on the "Move Up" button
      if (activeElement === this.getMoveUpButton(currentIndex)?.nativeElement) {
        // Try to focus "Move Down" button if it's enabled
        if (!isLastItem) {
          event.preventDefault();
          this.getMoveDownButton(currentIndex)?.nativeElement.focus();
          return;
        } 
        // If "Move Down" is disabled, move to the next item if available
        else if (currentIndex < this.items().length - 1) {
          event.preventDefault();
          this.selectItem(this.items()[currentIndex + 1]);
          return;
        }
        // Otherwise, let the browser handle it (tab out of the list)
        return;
      }
      
      // If we're on the "Move Down" button
      if (activeElement === this.getMoveDownButton(currentIndex)?.nativeElement) {
        // Move to the next item if available
        if (currentIndex < this.items().length - 1) {
          event.preventDefault();
          this.selectItem(this.items()[currentIndex + 1]);
          return;
        }
        // Otherwise, let the browser handle it (tab out of the list)
        return;
      }
    }
  }

  focusSelectedItem(): void {
    const selectedItem = this.selectedItem();
    if (selectedItem) {
      const itemElements = this.listItemElements();
      if (itemElements.length > 0) {
        const selectedIndex = this.items().findIndex(item => item.id === selectedItem.id);
        const itemElement = itemElements[selectedIndex];
        if (itemElement) {
          itemElement.nativeElement.focus();
        }
      }
    }
  }

  private getListItemElement(index: number): ElementRef | undefined {
    const elements = this.listItemElements();
    return elements[index];
  }

  private getMoveUpButton(index: number): ElementRef | undefined {
    const buttons = this.moveUpButtons();
    return buttons[index];
  }

  private getMoveDownButton(index: number): ElementRef | undefined {
    const buttons = this.moveDownButtons();
    return buttons[index];
  }
}

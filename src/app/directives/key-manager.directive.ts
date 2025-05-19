import { Directive, ElementRef, HostListener, input, effect, inject } from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Directive({
  selector: '[appKeyManager]',
  standalone: true
})
export class KeyManagerDirective {
  items = input<any[]>([]);
  private keyManager!: FocusKeyManager<any>;
  private elementRef = inject(ElementRef);

  constructor() {
    effect(() => {
      const currentItems = this.items();
      if (currentItems.length > 0) {
        this.keyManager = new FocusKeyManager(currentItems)
          .withWrap()
          .withHomeAndEnd();
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.keyManager) {
      this.keyManager.onKeydown(event);
    }
  }
}

import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Directive({
  selector: '[appKeyManager]',
  standalone: true
})
export class KeyManagerDirective implements OnInit {
  @Input() items: any[] = [];
  private keyManager!: FocusKeyManager<any>;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.keyManager = new FocusKeyManager(this.items)
      .withWrap()
      .withHomeAndEnd();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    this.keyManager.onKeydown(event);
  }
}

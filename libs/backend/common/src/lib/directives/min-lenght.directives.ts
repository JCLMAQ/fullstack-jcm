// min-length.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMinLength]',
})
export class MinLengthDirective {
  @Input('appMinLength') minLength: number;
  constructor(private el: ElementRef) {}
  @HostListener('input') onInput() {
    const inputValue: string = this.el.nativeElement.value;
    if (inputValue.length < this.minLength) {
      this.el.nativeElement.setCustomValidity(`Minimum length is ${this.minLength} characters.`);
    } else {
      this.el.nativeElement.setCustomValidity('');
    }
  }
}

/*
How to apply:

<!-- app.component.html -->

<input type="text" placeholder="Enter text" [appMinLength]="5" required>

Base on:

https://medium.com/@ayushgrwl365/angular-directives-enhancing-user-interfaces-with-ease-bb99d74e69cd

*/

import { AbstractControl } from '@angular/forms';

export function ValidateEmail(control: AbstractControl) {
  if (!control.value.endsWith('.com') || !control.value.includes('@')) {
    return { invalidUrl: true };
  }
  return null;
}
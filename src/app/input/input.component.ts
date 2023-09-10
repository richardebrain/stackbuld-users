import { Component, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() name!: string;
  @Input() placeholder!: string;
  @Input() type!: string;
  value!: string;
  customError!: string;
  hasCustomError!: boolean;
  onChange!: (value: string) => void;
  onTouched!: () => void;
  writeValue(value: string) {
    this.value = value;
  }
  registerOnChange(fn: (value: string) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }
  onChangeEvent(event: Event) {
    const { value, name } = event.target as HTMLInputElement;

    // Clear previous error
    this.customError = '';
    this.hasCustomError = false;

    // Check for email format
    if (!this.isEmail(value, name)) {
      this.customError = 'Invalid email format';
      this.hasCustomError = true;
    }

    // Check for text length
    if (value.length < 5) {
      this.customError = 'Value must be at least 5 characters';
      this.hasCustomError = true;
    }

    // Check for phone number format
    if (!this.isPhoneNumber(value, name)) {
      console.log(value);
      this.customError = 'Invalid phone number format';
      this.hasCustomError = true;
    }

    // If there's no custom error, update the value
    if (!this.hasCustomError) {
      this.onChange(value);
    }
  }

  // Custom email format validation
  private isEmail(value: string, name: string): boolean {
    if (name.toLowerCase() !== 'email') return true;
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return emailRegex.test(value);
  }

  // Custom phone number format validation (simplified for demonstration)
  private isPhoneNumber(value: string, name: string): boolean {
    if (name.toLowerCase() !== 'phone') return true;

    const phoneRegex = /^\d{10}$/;

    return phoneRegex.test(value);
  }

}

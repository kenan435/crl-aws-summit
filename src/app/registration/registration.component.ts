import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface UserRegistration {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @Input() defaultUserInfo?: UserRegistration;
  @Output() userRegistered = new EventEmitter<UserRegistration>();
  @Output() cancelRegistration = new EventEmitter<void>();
  
  registrationForm: FormGroup;
  submitted = false;
  
  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      company: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit() {
    // If default values are provided, fill the form
    if (this.defaultUserInfo) {
      this.registrationForm.patchValue({
        firstName: this.defaultUserInfo.firstName,
        lastName: this.defaultUserInfo.lastName,
        company: this.defaultUserInfo.company,
        email: this.defaultUserInfo.email
      });
    }
  }
  
  get f() { 
    return this.registrationForm.controls; 
  }
  
  onSubmit() {
    this.submitted = true;
    
    // Stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }
    
    const userData: UserRegistration = {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      company: this.registrationForm.value.company,
      email: this.registrationForm.value.email
    };
    
    this.userRegistered.emit(userData);
  }
  
  onCancel() {
    this.cancelRegistration.emit();
  }
}
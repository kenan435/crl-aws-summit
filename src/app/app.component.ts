
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ModuleSelectionComponent } from './module-selection/module-selection.component';
import { QuizComponent } from './quiz/quiz.component';
import { RegistrationComponent, UserRegistration } from './registration/registration.component';

//import outputs from '../../amplify_outputs.json';


//Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HttpClientModule,
    ModuleSelectionComponent,
    QuizComponent,
    RegistrationComponent
  ],
  template: `
    <div class="container">
      <h1>Interactive Quiz System</h1>
      
      <!-- Registration Form (shown first and after quiz completion) -->
      <div *ngIf="currentStep === 'registration'">
        <app-registration 
          [defaultUserInfo]="defaultTestUser"
          (userRegistered)="onUserRegistered(\$event)" 
          (cancelRegistration)="onCancelRegistration()">
        </app-registration>
      </div>
      
      <!-- Module Selection (shown after registration) -->
      <div *ngIf="currentStep === 'module-selection'">
        <div class="user-welcome">
          <p>Welcome, {{ userInfo?.firstName }} {{ userInfo?.lastName }}</p>
        </div>
        <app-module-selection (moduleSelect)="onModuleSelect(\$event)"></app-module-selection>
      </div>
      
      <!-- Quiz (shown after module selection) -->
      <div *ngIf="currentStep === 'quiz' && selectedModule !== null && userInfo !== null">
        <app-quiz 
          [moduleId]="selectedModule" 
          [userInfo]="userInfo"
          (quizExit)="resetToRegistration()">
        </app-quiz>
      </div>

      <!-- For quick testing: Button to bypass normal flow -->
      <div *ngIf="currentStep === 'registration'" class="quick-test-container">
        <button class="quick-test-btn" (click)="quickTestMode()">
          Quick Test Mode (Skip to Angular Quiz)
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #2196F3;
    }
    .quick-test-container {
      margin-top: 20px;
      text-align: center;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }
    .quick-test-btn {
      background-color: #FF9800;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    .quick-test-btn:hover {
      background-color: #F57C00;
    }
    .user-welcome {
      background-color: #e3f2fd;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
    }
    .user-welcome p {
      margin: 0;
      font-size: 16px;
      color: #1565c0;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'quiz-app';
  selectedModule: string | null = null;
  userInfo: UserRegistration | null = null;
  
  // Track the current step in the flow
  currentStep: 'registration' | 'module-selection' | 'quiz' = 'registration';
  
  // Default test user data
  defaultTestUser: UserRegistration = {
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company',
    email: 'test@example.com'
  };
  
  ngOnInit() {
    // Start with registration form
    this.currentStep = 'registration';
    this.selectedModule = null;
    this.userInfo = null;
    console.log('App initialized with registration form shown');
  }
  
  onUserRegistered(userData: UserRegistration): void {
    console.log('User registered:', userData);
    this.userInfo = userData;
    // After registration, show module selection
    this.currentStep = 'module-selection';
  }
  
  onModuleSelect(moduleId: string): void {
    console.log('Module selected:', moduleId);
    this.selectedModule = moduleId;
    // After module selection, show quiz
    this.currentStep = 'quiz';
  }
  
  onCancelRegistration(): void {
    console.log('Registration cancelled');
    // Stay on registration screen
  }
  
  // Complete reset to registration - called after quiz completion or abort
  resetToRegistration(): void {
    console.log('Resetting to registration');
    this.selectedModule = null;
    this.userInfo = null;
    this.currentStep = 'registration';
  }
  
  // Quick test mode function
  quickTestMode(): void {
    console.log('Entering quick test mode');
    // Set default user and module
    this.userInfo = this.defaultTestUser;
    this.selectedModule = 'angular'; // Use Angular module for quick testing
    // Skip straight to quiz
    this.currentStep = 'quiz';
    console.log('Quick test started with module:', this.selectedModule);
  }
}
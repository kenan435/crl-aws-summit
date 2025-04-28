import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService, QuizModule } from '../services/quiz.service';

@Component({
  selector: 'app-module-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-selection.component.html',
  styleUrls: ['./module-selection.component.css']
})
export class ModuleSelectionComponent {
  @Output() moduleSelect = new EventEmitter<string>();
  quizModules: QuizModule[];
  
  constructor(private quizService: QuizService) {
    this.quizModules = this.quizService.getQuizModules();
  }

  selectModule(moduleId: string): void {
    this.moduleSelect.emit(moduleId);
  }
}
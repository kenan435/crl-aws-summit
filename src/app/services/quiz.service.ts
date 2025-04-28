import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface QuizQuestion {
  id: number;
  text: string;
  userAnswer: boolean | null;
  correctAnswer: boolean;
}

export interface QuizModule {
  id: string;
  name: string;
  description: string;
  questionsFile: string;
}

// Add to quiz.service.ts or create a new file user.model.ts
export interface UserRegistration {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private availableModules: QuizModule[] = [
    {
      id: 'llm',
      name: 'Large Language Models (LLMs)',
      description: 'Test your knowledge about LLMs like GPT, BERT, and more',
      questionsFile: 'assets/quiz-questions-llm.txt'
    },
    {
      id: 'sap',
      name: 'SAP Systems',
      description: 'Questions about SAP ERP, HANA, and SAP modules',
      questionsFile: 'assets/quiz-questions-sap.txt'
    },
    {
      id: 'angular',
      name: 'Angular Framework',
      description: 'Test your knowledge of Angular concepts and features',
      questionsFile: 'assets/quiz-questions-angular.txt'
    }
  ];

  constructor(private http: HttpClient) { }

  getQuizModules(): QuizModule[] {
    return this.availableModules;
  }

  loadQuestionsForModule(moduleId: string): Observable<QuizQuestion[]> {
    const module = this.availableModules.find(m => m.id === moduleId);
    
    if (!module) {
      throw new Error(`Module with ID \${moduleId} not found`);
    }
    
    return this.http.get(module.questionsFile, { responseType: 'text' })
      .pipe(
        map(text => {
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          return lines.map((line, index) => {
            const [questionText, answerText] = line.split('|');
            return {
              id: index + 1,
              text: questionText.trim(),
              userAnswer: null,
              correctAnswer: answerText.trim().toLowerCase() === 'true'
            };
          });
        })
      );
  }
}
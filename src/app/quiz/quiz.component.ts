import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { QuizService, QuizQuestion } from '../services/quiz.service';
import { UserRegistration } from '../registration/registration.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { S3UploadService } from '../services/s3-upload.service';


@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  @Input() moduleId!: string;
  @Input() userInfo!: UserRegistration;
  @Output() quizExit = new EventEmitter<void>();
  
  questions: QuizQuestion[] = [];
  currentQuestionIndex = 0;
  quizCompleted = false;
  score = 0;
  loading = true;
  error = '';
  moduleName = '';
  
// Add upload status properties
uploadStatus: 'idle' | 'uploading' | 'success' | 'error' = 'idle';
uploadErrorMessage = '';

  // Property for abort confirmation
  showAbortConfirmation = false;

  constructor(
    private quizService: QuizService,
    private s3UploadService: S3UploadService) {}

  ngOnInit(): void {
    if (this.moduleId) {
      this.loadQuestions();
      const module = this.quizService.getQuizModules().find(m => m.id === this.moduleId);
      if (module) {
        this.moduleName = module.name;
      }
    } else {
      this.error = 'No module specified';
      this.loading = false;
    }
  }

  loadQuestions(): void {
    this.quizService.loadQuestionsForModule(this.moduleId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading questions:', err);
        this.error = 'Failed to load quiz questions. Please try again later.';
        this.loading = false;
      }
    });
  }

  get currentQuestion(): QuizQuestion | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  answerQuestion(answer: boolean): void {
    this.questions[this.currentQuestionIndex].userAnswer = answer;
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.calculateScore();
      this.quizCompleted = true;
    }
  }

  calculateScore(): void {
    this.score = this.questions.filter(q => q.userAnswer === q.correctAnswer).length;
  }

  resetQuiz(): void {
    this.questions.forEach(question => {
      question.userAnswer = null;
    });
    this.currentQuestionIndex = 0;
    this.quizCompleted = false;
    this.score = 0;
  }
  
  // Methods for abort functionality
  confirmAbort(): void {
    this.showAbortConfirmation = true;
  }
  
  cancelAbort(): void {
    this.showAbortConfirmation = false;
  }
  
  abortQuiz(): void {
    this.showAbortConfirmation = false;
    this.exitToModuleSelection();
  }
  
  exitToModuleSelection(): void {
    this.quizExit.emit();
  }
  
  // PDF export functionality
  exportResultsAsPDF(): void {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`\${this.moduleName} Quiz Results`, 14, 22);
    
    // Add user information
    doc.setFontSize(12);
    doc.text(`Name: \${this.userInfo.firstName} \${this.userInfo.lastName}`, 14, 32);
    doc.text(`Company: \${this.userInfo.company}`, 14, 38);
    doc.text(`Email: \${this.userInfo.email}`, 14, 44);
    
    // Add score summary
    doc.setFontSize(14);
    doc.text(`Score: \${this.score} out of \${this.questions.length} (\${Math.round((this.score / this.questions.length) * 100)}%)`, 14, 54);
    
    // Add date
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Date: \${currentDate}`, 14, 60);
    
    // Prepare data for table
    const tableData = this.questions.map((q, index) => [
      index + 1,
      q.text,
      q.userAnswer ? 'Yes' : 'No',
      q.correctAnswer ? 'Yes' : 'No',
      q.userAnswer === q.correctAnswer ? 'Correct' : 'Incorrect'
    ]);
    
    // Add table with results
    autoTable(doc, {
      startY: 70,
      head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Result']],
      body: tableData,
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 }
      },
      styles: { overflow: 'linebreak' },
      didDrawCell: (data) => {
        // Color the result cell based on correctness
        if (data.column.index === 4 && data.cell.section === 'body') {
          if (data.cell.raw === 'Correct') {
            doc.setFillColor(200, 230, 201); // Light green for correct
          } else {
            doc.setFillColor(255, 205, 210); // Light red for incorrect
          }
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setTextColor(0, 0, 0);
          
          // Add null check before calling toString()
          const cellText = data.cell.raw ? data.cell.raw.toString() : '';
          doc.text(cellText, data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { 
            align: 'center', 
            baseline: 'middle' 
          });
          
          return false; // Return false to prevent the default drawing
        }
        
        // Add this line to return a value for all other code paths
        return true; // Allow default drawing for all other cells
      }
    });
    
    // Save the PDF with user name in the filename
    const fileName = `\${this.userInfo.lastName}_\${this.userInfo.firstName}_\${this.moduleName.replace(/\s+/g, '_')}_Quiz_Results.pdf`;
    doc.save(fileName);
  }
}
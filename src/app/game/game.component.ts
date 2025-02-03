import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'] 
})
export class GameComponent {
  questions: any[] = [];
  quizze: any[] = [];
  answers: any[] = [];
  etatAnswers: any[] = [];
  selectedQuiz: any;
  score_tmp: any[] = [];
  currentQuestionIndex = 0;
  quizChoisi: any = null;
  score = 0;
  finished = false;
   attemps = { user:localStorage.getItem('email'), quiz: 0, answerId: 0, question_id: 0, answer: 0, action: ''};
  
  

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.getQuiz(); 
    this.getJoueurs();
  }

  startQuiz(quiz: any) {
    this.selectedQuiz = quiz;
    this.quizChoisi = quiz.id;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.finished = false;
    this.loadQuestionsAndAnswers(quiz.id); 
  }

  loadQuestionsAndAnswers(quizId: number) {
    // Charger les questions pour le quiz sélectionné
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listQuestionForGame', id:quizId })
      .subscribe({
        next: (response: any) => {
          
          if (response.status) { 
            this.questions = response.data;
            //console.log(this.questions)
            this.questions.forEach(question => {
              question.answers = []; 
              this.loadAnswers(question.id); 
            });
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de la récupération des questions.");
        }
      });
  }

  loadAnswers(questionId: number) {
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listAnswersForGame', id:questionId })
      .subscribe({
        next: (response: any) => {
         // console.log("ID : " + questionId)
          //console.log(response.data)
          if (response.status) { 
            const question = this.questions.find(q => q.id === questionId);
            if (question) {
              question.answers = response.data; // Associer les réponses à la question
            }
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de la récupération des réponses.");
        }
      });
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  selectAnswer(answer: any, quiz:number) {
   
        this.attemps = {
          user: localStorage.getItem('email'),
          quiz: quiz,
          answerId: answer.id,
          question_id: answer.question_id,
          answer: answer.is_correct,
          action: 'createAttempt',
        };
        
    if (answer.is_correct) {
      this.score++;
    }
  }


  setScore(attempt= {user: localStorage.getItem('email'), quiz: 0, answerId: 0, question_id: 0, answer: 0, action: ''}) {
   
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", attempt)
      .subscribe({
        next: (response: any) => {
            alert(response.message);
        },
        error: (error) => {
          console.error("Erreur : ", error);
          
          if (error.status) {
            alert(`Erreur HTTP ${error.status}: ${error.message}`);
          } else {
            alert("Erreur lors de la récupération des réponses.");
          }
        }
      });
  }
  
  

  nextQuestion() {

    console.log("Test Answer");
    console.log(this.attemps);   

    this.setScore(this.attemps);
    
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finished = true;
    }
  }

  restartQuiz() {
    this.selectedQuiz = null;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.finished = false;
    this.questions = []; // Réinitialiser les questions
  }

  getProgress() {
    const totalQuestions = this.questions.length || 1;
    const progressPercentage = ((this.currentQuestionIndex + 1) / totalQuestions) * 100;
    return progressPercentage + '%';
  }

  getQuiz() {
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listQuiz' })
      .subscribe({
        next: (response: any) => {
          if (response.status) { 
            this.quizze = response.data; // Charger les quiz disponibles
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de la récupération des quiz.");
        }
      });
  }


  getJoueurs() {
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listAttempt' })
      .subscribe({
        next: (response: any) => {
          if (response.status) { 
            this.score_tmp = response.data; 
            console.log(this.score_tmp);
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de la récupération des quiz.");
        }
      });
  }
}
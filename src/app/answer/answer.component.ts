import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-answer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'] // Correction ici
})
export class AnswerComponent implements OnInit {
  registrationForm: FormGroup;
  questions: any[] = [];
  answers: any[] = [];
  

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({       // Ajout d'un champ pour le quiz
      question: ['', Validators.required],
      answerText: ['', Validators.required],
      isCorrect: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getQuestions();
    this.getAnswers();
  }


  getQuestions() {
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listQuestions', email: localStorage.getItem('email') })
      .subscribe({
        next: (response: any) => {  
          if (response.status) { 
            this.questions = response.data;
            console.log(response.data);
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



  getAnswers() {
    console.log("Email : " + localStorage.getItem('email') )
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listAnswer', email: localStorage.getItem('email') })
      .subscribe({
        next: (response: any) => {  
          if (response.status) { 
            this.answers = response.data;
            console.log(response.data);
            this.getAnswers();
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


  onSubmit() {
    if (this.registrationForm.valid) {  
      const answer = {
        question: this.registrationForm.get('question')?.value,
        answerText: this.registrationForm.get('answerText')?.value,
        isCorrect: this.registrationForm.get('isCorrect')?.value,
        email: localStorage.getItem('email'),
        action: 'createAnswer'
      };

      console.log(answer);

      this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", answer)
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          console.log("Réponse brute : ", response);

          if (response.status) { 
            this.registrationForm.reset(); 
            this.getQuestions();
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de l'ajout de la réponse.");
        }
      });
    } else {
      console.warn("Le formulaire n'est pas valide");
      alert("Veuillez remplir correctement le formulaire.");
    }
  }

  deleteAnswer(id: number) {
   // alert("Le formulaire n'est pas : " + id);
     if (confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) { 
         this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'deleteAnswer', id: id })
             .subscribe({
                 next: (response: any) => {
                   //  alert(this.answers.message);
                     if (response.status) { // Vérifiez si la suppression a réussi
                         // Filtrer le quiz supprimé de la liste
                         this.answers = this.answers.filter(answer => answer.id !== id);
                         this.getAnswers();
                     }
                 },
                 error: (error) => {
                     console.error("Erreur : ", error);
                     alert("Erreur lors de la suppression de la réponse.");
                 }
        });
     }
 }


}
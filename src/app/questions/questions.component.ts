import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  registrationForm: FormGroup; 
  quizzes: any[] = [];
  questions: any[] = [];
  info_question = "Ajouter";
  name_tmp:string = '';
  description_tmp:string = '';
  
  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
     this.registrationForm = this.fb.group({
      quiz: ['', Validators.required],
      question: ['', Validators.required]
      });
  }

  ngOnInit() {
    this.getQuiz(); 
    this.getQuestions();
  }

  ActionModifier(question:any){
    alert("MO")
    this.info_question = "Modifier";
    this.description_tmp = question.question ;
  }

  ActionAjouter(){
    this.info_question = "Ajouter";
    this.description_tmp = '';
  }

  getQuiz() {
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listQuizByUser', email: localStorage.getItem('email')})
      .subscribe({
        next: (response: any) => {
          if (response.status) { 
            this.quizzes = response.data;
            console.log(response.data);
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

  getQuestions() {
    //console.log(localStorage.getItem('email'));
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listQuestions', email: localStorage.getItem('email')})
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
          alert("Erreur lors de la récupération des qusestions.");
        }
      });
  }


  onSubmit() {
    if (this.registrationForm.valid) {  
      const question = {
        quiz: parseInt(this.registrationForm.get('quiz')?.value), 
        question: this.registrationForm.get('question')?.value, 
        email: localStorage.getItem('email'),  
        action: 'createQuestion'  
      };

      console.log("question"); 
      console.log(question); 

      this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", question)
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
          alert("Erreur lors de l'inscription.");
        }
      });
    } else {
      console.warn("Le formulaire n'est pas valide");
      alert("Veuillez remplir correctement le formulaire.");
    }
  }


  deleteQuestion(id: number) {
   // alert("Le formulaire n'est pas : " + id);
    if (confirm("Êtes-vous sûr de vouloir supprimer cette questions ?")) { // Confirmation avant la suppression
        this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'deleteQuestion', id: id })
            .subscribe({
                next: (response: any) => {
                    alert(response.message);
                    if (response.status) { // Vérifiez si la suppression a réussi
                        // Filtrer le quiz supprimé de la liste
                        this.questions = this.questions.filter(question => question.id !== id);
                        this.getQuestions();
                    }
                },
                error: (error) => {
                    console.error("Erreur : ", error);
                    alert("Erreur lors de la suppression de la question.");
                }
       });
    }
}
}
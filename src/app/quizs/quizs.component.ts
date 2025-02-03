import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-quizs',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quizs.component.html',
  styleUrl: './quizs.component.css'
})
export class QuizsComponent {
   registrationForm: FormGroup; 
   quizzes: any[] = [];
    info_quiz = "Ajouter";
    name_tmp:string = '';
    description_tmp:string = '';
    quizMofify:number = 0

    constructor(private router: Router, private fb: FormBuilder, private http:HttpClient) {
      this.registrationForm = this.fb.group({
        titre: ['', [Validators.required]], 
        description: ['', [Validators.required]],
      });
    }

    ngOnInit() {
      this.getQuiz(); 
    }

    ActionModifier(quiz:any){
      this.info_quiz = "Modifier";
      this.name_tmp = quiz.title;
      this.description_tmp = quiz.description;
      this.quizMofify = quiz.id;
    }

    ActionAjouter(){
      this.info_quiz = "Ajouter";
      this.name_tmp = '';
      this.description_tmp = '';
      this.quizMofify = 0;
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


 /*  getQuiz() {
    this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'listQuiz' })
      .subscribe({
        next: (response: any) => {
          if (response.status) { 
            this.quizzes = response.data;
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de la récupération des quiz.");
        }
      });
  }*/

  deleteQuiz(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) { // Confirmation avant la suppression
        this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", { action: 'deleteQuiz', id: id })
            .subscribe({
                next: (response: any) => {
                    alert(response.message);
                    if (response.status) { // Vérifiez si la suppression a réussi
                        // Filtrer le quiz supprimé de la liste
                        this.quizzes = this.quizzes.filter(quiz => quiz.id !== id);
                        this.getQuiz(); 
                    }
                },
                error: (error) => {
                    console.error("Erreur : ", error);
                    alert("Erreur lors de la suppression du quiz.");
                }
       });
    }
}

    onSubmit() {
      if (this.registrationForm.valid) {  

        if(this.quizMofify == 0){

          const quiz = {
            titre: this.registrationForm.get('titre')?.value, 
            description: this.registrationForm.get('description')?.value, 
            email: localStorage.getItem('email'),  
            action: 'createQuiz'  
          };

          console.log(quiz); 
          this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", quiz)
          .subscribe({
            next: (response: any) => {
            //  alert(response.message);
              console.log("Réponse brute : ", response);
              this.getQuiz(); 
              if (response.status) { 
                this.registrationForm.reset(); // Reset the form fields
              }
            },
            error: (error) => {
              console.error("Erreur : ", error);
              alert("Erreur lors de l'inscription.");
            }
          });

      }else{

          const quiz = {
            titre: this.registrationForm.get('titre')?.value, 
            description: this.registrationForm.get('description')?.value, 
            email: localStorage.getItem('email'),  
            action: 'modifierQuiz',
            id:this.quizMofify
          };

          console.log(quiz); 
          this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", quiz)
          .subscribe({
            next: (response: any) => {
              //alert(response.message);
              console.log("Réponse brute : ", response);
              this.getQuiz(); 
              if (response.status) { 
                this.registrationForm.reset(); // Reset the form fields
              }
            },
            error: (error) => {
              console.error("Erreur : ", error);
              alert("Erreur lors de la modification.");
            }
          });

      
      }

      } else {
        console.warn("Le formulaire n'est pas valide");
        alert("Veuillez remplir correctement le formulaire.");
      }
    }
}

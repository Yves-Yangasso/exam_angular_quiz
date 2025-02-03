import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'], 
})
export class ConnexionComponent {
  loginForm: FormGroup; 

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]  // Assurez-vous que le nom correspond ici
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {  
      const user = {
        email: this.loginForm.get('email')?.value, 
        mdp: this.loginForm.get('password')?.value,
        action: 'getUser' 
      };

      console.log(user); 
      //this.http.get("http://localhost/projetsPHP/exam_angular_quiz/")
      this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", user)
      .subscribe({
        next: (response: any) => {

          alert(response.message + response.email);

          console.log("Réponse brute : ", response);
   
          if (response.status) { 
           localStorage.setItem('email', response.email);
           alert(localStorage.getItem('email'));
            this.router.navigate(['/accueil']);
          }
        },
        error: (error) => {
          console.error("Erreur : ", error);
          alert("Erreur lors de la vérification.");
        }
      });
    } else {
      console.warn("Le formulaire n'est pas valide");
      alert("Veuillez remplir correctement le formulaire.");
    }
  }
}
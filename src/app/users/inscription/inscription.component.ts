import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'], 
})
export class InscriptionComponent {
  registrationForm: FormGroup; 

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required]],  // Champ pour le nom
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]  // Champ pour confirmer le mot de passe
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {  
     
      if (this.registrationForm.get('password')?.value !== this.registrationForm.get('confirmPassword')?.value) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }

      const user = {
        name: this.registrationForm.get('name')?.value, 
        email: this.registrationForm.get('email')?.value, 
        mdp: this.registrationForm.get('password')?.value,  
        action: 'createUser'  
      };

      console.log(user); 
      this.http.post("http://localhost/projetsPHP/exam_angular_quiz/", user)
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          console.log("Réponse brute : ", response);
  
          if (response.status) { 
            this.router.navigate(['/connexion']);
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
}
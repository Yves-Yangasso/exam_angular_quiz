import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AccueilParDefautComponent } from './accueil-par-defaut/accueil-par-defaut.component';
import { ConnexionComponent } from './users/connexion/connexion.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'quiz_app';


  email: string | null;

  constructor(public router:Router) {
    // Initialisation de l'email
    this.email = null;
  }

  ngOnInit(): void {
    // Récupérer l'email depuis localStorage lors de l'initialisation
    this.email = localStorage.getItem('email');
  }

}

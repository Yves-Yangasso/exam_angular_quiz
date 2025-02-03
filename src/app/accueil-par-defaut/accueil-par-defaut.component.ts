import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-accueil-par-defaut',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './accueil-par-defaut.component.html',
  styleUrls: ['./accueil-par-defaut.component.css'],
})
export class AccueilParDefautComponent {
  constructor(private router: Router){ }
}

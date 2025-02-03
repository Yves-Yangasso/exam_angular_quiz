import { Routes } from '@angular/router';
import { ConnexionComponent } from './users/connexion/connexion.component';
import { InscriptionComponent } from './users/inscription/inscription.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AccueilParDefautComponent } from './accueil-par-defaut/accueil-par-defaut.component';
import { QuizsComponent } from './quizs/quizs.component';
import { QuestionsComponent } from './questions/questions.component';
import { AnswerComponent } from './answer/answer.component';
import { GameComponent } from './game/game.component';


export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'accueil-par-defaut',},
    {path:"accueil-par-defaut", component:AccueilParDefautComponent},
    {path: 'connexion', component: ConnexionComponent},
    {path: 'inscription', component: InscriptionComponent},
    {path: 'accueil', component: AccueilComponent},
    {path: 'quizs', component: QuizsComponent},
    {path: 'questions', component: QuestionsComponent},
    {path: 'answer', component: AnswerComponent},
    {path: 'game', component:GameComponent}
    
];

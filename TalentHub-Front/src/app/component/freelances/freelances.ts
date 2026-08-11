import { Component } from '@angular/core';

@Component({
  selector: 'app-freelances',
  standalone: false,
  templateUrl: './freelances.html',
  styleUrl: './freelances.css'
})
export class Freelances {

  entreprises = [
    {
      nom: 'Jumia Group',
      secteur: 'Fintech',
      localisation: 'Dakar, Sénégal',
      description: 'Une entreprise qui recherche régulièrement des freelances pour ses projets.'
    },
    {
      nom: 'Safiacom',
      secteur: 'Telecom',
      localisation: 'Dakar, Sénégal',
      description: 'Des opportunités pour les freelances dans le domaine du numérique.'
    },
    {
      nom: 'Yassir',
      secteur: 'Fintech',
      localisation: 'Dakar, Sénégal',
      description: 'Une plateforme qui travaille avec des professionnels du numérique.'
    },
    {
      nom: 'Wave Mobile Money',
      secteur: 'Fintech',
      localisation: 'Dakar, Sénégal',
      description: 'Des missions pour les freelances dans le domaine du digital et de la technologie.'
    }
  ];

}
import { CandidatureModal } from './../candidature-modal/candidature-modal';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OffreService } from '../../services/offre';

@Component({
  selector: 'app-detail-offre',
  standalone: false,
  templateUrl: './detail-offre.html',
  styleUrl: './detail-offre.css',
})
export class DetailOffreComponent implements OnInit {
  offre: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offreService: OffreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.offreService.getOffreById(+id).subscribe(data => {
        this.offre = data;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/offres']);
  }

  openPostulerModal(): void {
    this.dialog.open(CandidatureModal, {
      width: '500px',
      data: { 
        titre: this.offre.titre,
        entreprise: this.offre.entreprise?.nom || 'Entreprise inconnue',
        offreId: this.offre.id
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionService } from '../../services/inscription';
import { MatDialog } from '@angular/material/dialog';
import { SuccessInscriptionModalComponent } from '../success-inscription-modal/success-inscription-modal';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css'],
  standalone: false,
})
export class InscriptionComponent implements OnInit {
  currentStep: number = 1;
  inscriptionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inscriptionService: InscriptionService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.inscriptionForm = this.fb.group({
      // Step 1 (User + Role)
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: ['candidat', Validators.required],
      
      // Step 2
      sexe: [''],
      nationalite: [''],
      telephone: [''],
      dateNaissance: [''],
      lieuNaissance: [''],
      
      // Step 3
      specialite: [''],
      niveauEtude: [''],
      dernierDiplome: [''],
      dateObtentionDiplome: [''],
      numCni: [''],
      numPassport: [''],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  // Validateur personnalisé : les mots de passe doivent correspondre
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // Méthode pour vérifier uniquement la validité de l'étape 1
  isStep1Valid(): boolean {
    const c = this.inscriptionForm.controls;
    return c['first_name'].valid && 
           c['last_name'].valid && 
           c['email'].valid && 
           c['password'].valid && 
           c['role'].valid;
  }

 nextStep(): void {
  // 1. Sauvegarder les données de l'étape actuelle avant de passer à la suivante
  const stepData = this.getStepData();
  this.inscriptionService.updateStepData(stepData);

  // 2. Si ce n'est pas la dernière étape, on avance
  if (this.currentStep < 3) {
    this.currentStep++;
  } else {
    this.submitInscription(); 
  }
}

private getStepData(): Partial<any> {
  const controls = this.inscriptionForm.controls;
  const stepKeys = [
    ['email', 'password', 'first_name', 'last_name', 'role'], // Step 1
    ['sexe', 'nationalite', 'telephone', 'dateNaissance', 'lieuNaissance'], // Step 2
    ['specialite', 'niveauEtude', 'dernierDiplome', 'numCni', 'numPassport'] // Step 3
  ];
  const keys = stepKeys[this.currentStep - 1];
  const data: any = {};
  keys.forEach(key => data[key] = controls[key].value);
  return data;
}
  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  // Modifier submitInscription() :
submitInscription(): void {
  // Vérification avant l'envoi...
  this.inscriptionService.submitInscription().subscribe({
    next: () => {
      // Ouvrir le modal de succès
      this.dialog.open(SuccessInscriptionModalComponent, {
        width: '450px',
        disableClose: true // Empêche de fermer en cliquant à l'extérieur
      });
    },
    error: (err) => {
      console.error('Erreur', err);
      alert('Erreur lors de l\'inscription.');
    }
  });
}
}
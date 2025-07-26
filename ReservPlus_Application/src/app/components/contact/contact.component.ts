import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  
  contactForm: FormGroup;
  submitted = false;
  loading = false;

  contactInfo = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Adresse',
      content: '123 Rue de la Réservation<br>75001 Paris, France',
      color: '#667eea'
    },
    {
      icon: 'fas fa-phone',
      title: 'Téléphone',
      content: '+33 1 23 45 67 89<br>Lun-Ven: 9h-18h',
      color: '#28a745'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      content: 'contact@reservplus.fr<br>support@reservplus.fr',
      color: '#dc3545'
    },
    {
      icon: 'fas fa-clock',
      title: 'Horaires',
      content: 'Lundi - Vendredi: 9h-18h<br>Samedi: 9h-12h',
      color: '#ffc107'
    }
  ];

  faqItems = [
    {
      question: 'Comment créer un compte sur RéservPlus ?',
      answer: 'Créer un compte est simple ! Cliquez sur "S\'inscrire" en haut à droite, remplissez le formulaire avec vos informations et confirmez votre email.'
    },
    {
      question: 'Comment annuler une réservation ?',
      answer: 'Vous pouvez annuler une réservation depuis votre tableau de bord. Allez dans "Mes réservations", trouvez la réservation concernée et cliquez sur "Annuler".'
    },
    {
      question: 'Quels sont les moyens de paiement acceptés ?',
      answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires pour les entreprises.'
    },
    {
      question: 'Comment contacter le support client ?',
      answer: 'Notre équipe support est disponible par email à support@reservplus.fr, par téléphone au +33 1 23 45 67 89, ou via le chat en ligne.'
    },
    {
      question: 'Puis-je modifier une réservation existante ?',
      answer: 'Oui, vous pouvez modifier une réservation tant qu\'elle n\'est pas confirmée. Allez dans "Mes réservations" et cliquez sur "Modifier".'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      sujet: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
      telephone: [''],
      typeDemande: ['general', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.contactForm.valid) {
      this.loading = true;
      
      // Simulation d'envoi
      setTimeout(() => {
        console.log('Formulaire soumis:', this.contactForm.value);
        this.loading = false;
        this.contactForm.reset();
        this.submitted = false;
        alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      }, 2000);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['email']) {
        return 'Veuillez entrer une adresse email valide';
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `Ce champ doit contenir au moins ${requiredLength} caractères`;
      }
    }
    return '';
  }
} 
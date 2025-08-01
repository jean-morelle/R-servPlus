import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container-fluid p-0">
      <!-- Hero Section -->
      <section class="hero-section text-white py-5">
        <div class="container">
          <div class="row justify-content-center text-center">
            <div class="col-lg-8">
              <h1 class="display-4 fw-bold mb-4">
                <i class="material-icons me-3">contact_support</i>
                Contactez-nous
              </h1>
              <p class="lead mb-4">
                Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou assistance.
              </p>
              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <button 
                  (click)="openChat()"
                  class="btn btn-light btn-lg px-4 py-3 fw-semibold">
                  <i class="material-icons me-2">chat</i>
                  Chat en ligne
                </button>
                <button 
                  (click)="scrollToForm()"
                  class="btn btn-outline-light btn-lg px-4 py-3 fw-semibold">
                  <i class="material-icons me-2">email</i>
                  Envoyer un message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" *ngFor="let info of contactInfo">
              <div class="card border-0 shadow-sm h-100 text-center">
                <div class="card-body py-4">
                  <div class="info-icon rounded-circle d-inline-flex p-3 mb-3" [style.background]="info.color">
                    <i class="material-icons text-white" style="font-size: 2rem;">{{ info.icon }}</i>
                  </div>
                  <h4 class="fw-bold mb-3">{{ info.title }}</h4>
                  <div [innerHTML]="info.content" class="text-muted"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form and Map -->
      <section class="py-5" id="contact-form">
        <div class="container">
          <div class="row">
            <!-- Contact Form -->
            <div class="col-lg-8 mb-4">
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-primary bg-opacity-10 border-0">
                  <h3 class="h4 mb-0 text-primary">
                    <i class="material-icons me-2">email</i>
                    Envoyez-nous un message
                  </h3>
                </div>
                <div class="card-body p-4">
                  <p class="text-muted mb-4">
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </p>
                  
                  <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label fw-medium">
                          <i class="material-icons me-1" style="font-size: 1rem;">person</i>
                          Nom complet *
                        </label>
                        <input 
                          type="text" 
                          formControlName="nom" 
                          class="form-control"
                          placeholder="Votre nom complet"
                          [class.is-invalid]="submitted && contactForm.get('nom')?.invalid"
                        >
                        <div class="invalid-feedback" *ngIf="submitted && contactForm.get('nom')?.invalid">
                          {{ getErrorMessage('nom') }}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-medium">
                          <i class="material-icons me-1" style="font-size: 1rem;">email</i>
                          Email *
                        </label>
                        <input 
                          type="email" 
                          formControlName="email" 
                          class="form-control"
                          placeholder="votre.email@exemple.com"
                          [class.is-invalid]="submitted && contactForm.get('email')?.invalid"
                        >
                        <div class="invalid-feedback" *ngIf="submitted && contactForm.get('email')?.invalid">
                          {{ getErrorMessage('email') }}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-medium">
                          <i class="material-icons me-1" style="font-size: 1rem;">phone</i>
                          Téléphone
                        </label>
                        <input 
                          type="tel" 
                          formControlName="telephone" 
                          class="form-control"
                          placeholder="+33 1 23 45 67 89"
                        >
                      </div>
                      <div class="col-md-6">
                        <label class="form-label fw-medium">
                          <i class="material-icons me-1" style="font-size: 1rem;">category</i>
                          Type de demande *
                        </label>
                        <select 
                          formControlName="typeDemande" 
                          class="form-select"
                        >
                          <option value="general">Demande générale</option>
                          <option value="support">Support technique</option>
                          <option value="commercial">Question commerciale</option>
                          <option value="partnership">Partenariat</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                      <div class="col-12">
                        <label class="form-label fw-medium">
                          <i class="material-icons me-1" style="font-size: 1rem;">subject</i>
                          Sujet *
                        </label>
                        <input 
                          type="text" 
                          formControlName="sujet" 
                          class="form-control"
                          placeholder="Sujet de votre message"
                          [class.is-invalid]="submitted && contactForm.get('sujet')?.invalid"
                        >
                        <div class="invalid-feedback" *ngIf="submitted && contactForm.get('sujet')?.invalid">
                          {{ getErrorMessage('sujet') }}
                        </div>
                      </div>
                      <div class="col-12">
                        <label class="form-label fw-medium">
                          <i class="material-icons me-1" style="font-size: 1rem;">message</i>
                          Message *
                        </label>
                        <textarea 
                          formControlName="message" 
                          rows="6" 
                          class="form-control"
                          placeholder="Décrivez votre demande en détail..."
                          [class.is-invalid]="submitted && contactForm.get('message')?.invalid"
                        ></textarea>
                        <div class="invalid-feedback" *ngIf="submitted && contactForm.get('message')?.invalid">
                          {{ getErrorMessage('message') }}
                        </div>
                      </div>
                      <div class="col-12">
                        <button 
                          type="submit" 
                          class="btn btn-primary btn-lg px-4"
                          [disabled]="loading"
                        >
                          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                          <i class="material-icons me-2" *ngIf="!loading">send</i>
                          {{ loading ? 'Envoi en cours...' : 'Envoyer le message' }}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Map and Quick Actions -->
            <div class="col-lg-4">
              <!-- Map -->
              <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-info bg-opacity-10 border-0">
                  <h4 class="h6 mb-0 text-info">
                    <i class="material-icons me-2">location_on</i>
                    Notre localisation
                  </h4>
                </div>
                <div class="card-body text-center p-4">
                  <div class="map-placeholder mb-3">
                    <i class="material-icons text-muted" style="font-size: 4rem;">map</i>
                  </div>
                  <p class="text-muted mb-3">
                    123 Rue de la Réservation<br>Lomé-Togo
                  </p>
                  <button class="btn btn-outline-info">
                    <i class="material-icons me-1">open_in_new</i>
                    Voir sur Google Maps
                  </button>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="card border-0 shadow-sm">
                <div class="card-header bg-success bg-opacity-10 border-0">
                  <h4 class="h6 mb-0 text-success">
                    <i class="material-icons me-2">flash_on</i>
                    Actions rapides
                  </h4>
                </div>
                <div class="card-body p-0">
                  <div class="list-group list-group-flush">
                    <button 
                      (click)="openChat()"
                      class="list-group-item list-group-item-action d-flex align-items-center">
                      <i class="material-icons me-3 text-primary">chat</i>
                      <div>
                        <div class="fw-medium">Chat en ligne</div>
                        <small class="text-muted">Support immédiat</small>
                      </div>
                    </button>
                    <a href="tel:+33123456789" class="list-group-item list-group-item-action d-flex align-items-center">
                      <i class="material-icons me-3 text-success">phone</i>
                      <div>
                        <div class="fw-medium">Appeler</div>
                        <small class="text-muted">+33 1 23 45 67 89</small>
                      </div>
                    </a>
                    <a href="mailto:contact@reservplus.com" class="list-group-item list-group-item-action d-flex align-items-center">
                      <i class="material-icons me-3 text-warning">email</i>
                      <div>
                        <div class="fw-medium">Email</div>
                        <small class="text-muted">contact@reservplus.com</small>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="h1 fw-bold">
              <i class="material-icons me-3 text-primary">help</i>
              Questions fréquemment posées
            </h2>
            <p class="lead text-muted">Trouvez rapidement des réponses à vos questions</p>
          </div>
          <div class="row">
            <div class="col-lg-8 mx-auto">
              <div class="accordion" id="faqAccordion">
                <div class="accordion-item border-0 shadow-sm mb-3" *ngFor="let item of faqItems; let i = index">
                  <h2 class="accordion-header" [id]="'heading' + i">
                    <button 
                      class="accordion-button" 
                      [class.collapsed]="i !== 0"
                      type="button" 
                      data-bs-toggle="collapse" 
                      [attr.data-bs-target]="'#collapse' + i"
                      [attr.aria-expanded]="i === 0 ? 'true' : 'false'"
                      [attr.aria-controls]="'collapse' + i"
                    >
                      <i class="material-icons me-2 text-primary">question_answer</i>
                      {{ item.question }}
                    </button>
                  </h2>
                  <div 
                    [id]="'collapse' + i" 
                    class="accordion-collapse collapse" 
                    [class.show]="i === 0"
                    [attr.aria-labelledby]="'heading' + i" 
                    data-bs-parent="#faqAccordion"
                  >
                    <div class="accordion-body">
                      {{ item.answer }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section py-5 text-white">
        <div class="container text-center">
          <h2 class="display-5 fw-bold mb-4">
            <i class="material-icons me-3">support_agent</i>
            Besoin d'aide immédiate ?
          </h2>
          <p class="lead mb-4 opacity-75">
            Notre équipe support est disponible 24h/24 pour vous assister
          </p>
          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <a href="tel:+33123456789" class="btn btn-light btn-lg px-4 py-3 fw-semibold">
              <i class="material-icons me-2">phone</i>
              Appeler maintenant
            </a>
            <button 
              (click)="openChat()"
              class="btn btn-outline-light btn-lg px-4 py-3 fw-semibold">
              <i class="material-icons me-2">chat</i>
              Chat en ligne
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Chat Widget -->
    <div class="chat-widget" [class.open]="isChatOpen">
      <!-- Chat Toggle Button -->
      <button 
        (click)="toggleChat()"
        class="chat-toggle-btn"
        [class.active]="isChatOpen">
        <i class="material-icons">{{ isChatOpen ? 'close' : 'chat' }}</i>
        <span class="chat-badge" *ngIf="unreadMessages > 0">{{ unreadMessages }}</span>
      </button>

      <!-- Chat Window -->
      <div class="chat-window" *ngIf="isChatOpen">
        <div class="chat-header">
          <div class="d-flex align-items-center">
            <div class="chat-avatar me-2">
              <i class="material-icons text-white">support_agent</i>
            </div>
            <div>
              <h6 class="mb-0 fw-bold">Support RéservPlus</h6>
              <small class="text-success">
                <i class="material-icons" style="font-size: 0.75rem;">circle</i>
                En ligne
              </small>
            </div>
          </div>
          <button 
            (click)="toggleChat()"
            class="btn-close btn-close-white"
            type="button">
          </button>
        </div>

        <div class="chat-messages" #chatMessages>
          <div 
            *ngFor="let message of chatMessages"
            class="message"
            [class.user-message]="message.isUser"
            [class.agent-message]="!message.isUser">
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <div class="input-group">
            <input 
              type="text" 
              [(ngModel)]="newMessage"
              (keyup.enter)="sendMessage()"
              class="form-control"
              placeholder="Tapez votre message..."
              [disabled]="isTyping">
            <button 
              (click)="sendMessage()"
              class="btn btn-primary"
              [disabled]="!newMessage.trim() || isTyping">
              <i class="material-icons">send</i>
            </button>
          </div>
          <div class="typing-indicator" *ngIf="isTyping">
            <small class="text-muted">
              <i class="material-icons me-1" style="font-size: 0.75rem;">schedule</i>
              L'agent tape...
            </small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .info-icon {
      width: 80px;
      height: 80px;
    }

    .map-placeholder {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 2rem;
    }

    .accordion-button:not(.collapsed) {
      background-color: #e7f1ff;
      color: #0d6efd;
    }

    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Chat Widget Styles */
    .chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }

    .chat-toggle-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      position: relative;
    }

    .chat-toggle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .chat-toggle-btn.active {
      background: #dc3545;
    }

    .chat-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background: #f8f9fa;
    }

    .message {
      margin-bottom: 1rem;
      display: flex;
    }

    .user-message {
      justify-content: flex-end;
    }

    .agent-message {
      justify-content: flex-start;
    }

    .message-content {
      max-width: 80%;
      padding: 0.75rem;
      border-radius: 12px;
      position: relative;
    }

    .user-message .message-content {
      background: #0d6efd;
      color: white;
      border-bottom-right-radius: 4px;
    }

    .agent-message .message-content {
      background: white;
      color: #333;
      border: 1px solid #dee2e6;
      border-bottom-left-radius: 4px;
    }

    .message-time {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-top: 0.25rem;
    }

    .chat-input {
      padding: 1rem;
      background: white;
      border-top: 1px solid #dee2e6;
    }

    .typing-indicator {
      margin-top: 0.5rem;
      text-align: center;
    }

    .list-group-item {
      border: none;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .list-group-item:hover {
      background-color: #f8f9fa;
      transform: translateX(5px);
    }

    .card {
      transition: all 0.3s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
  `]
})
export class ContactComponent implements OnInit {
  
  contactForm: FormGroup;
  submitted = false;
  loading = false;
  isChatOpen = false;
  isTyping = false;
  newMessage = '';
  unreadMessages = 0;

  chatMessages = [
    {
      text: 'Bonjour ! Bienvenue sur RéservPlus. Comment puis-je vous aider aujourd\'hui ?',
      time: '14:30',
      isUser: false
    }
  ];

  contactInfo = [
    {
      icon: 'location_on',
      title: 'Adresse',
      content: '123 Rue de la Réservation<br>Lomé-Togo',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: 'phone',
      title: 'Téléphone',
      content: '+33 1 23 45 67 89<br>Lun-Ven: 9h-18h',
      color: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
    },
    {
      icon: 'email',
      title: 'Email',
      content: 'contact&#64;reservplus.com<br>support&#64;reservplus.com',
      color: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)'
    },
    {
      icon: 'schedule',
      title: 'Horaires',
      content: 'Lundi - Vendredi: 9h-18h<br>Samedi: 9h-12h',
      color: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
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
      answer: 'Notre équipe support est disponible par email à support@reservplus.com, par téléphone au +33 1 23 45 67 89, ou via le chat en ligne.'
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

  ngOnInit() {
    // Simuler des messages non lus
    setTimeout(() => {
      this.unreadMessages = 1;
    }, 5000);
  }

  openChat() {
    this.isChatOpen = true;
    this.unreadMessages = 0;
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.unreadMessages = 0;
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Ajouter le message de l'utilisateur
      this.chatMessages.push({
        text: this.newMessage,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isUser: true
      });

      const userMessage = this.newMessage;
      this.newMessage = '';

      // Simuler la réponse de l'agent
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
        this.chatMessages.push({
          text: this.getAgentResponse(userMessage),
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          isUser: false
        });
      }, 2000);
    }
  }

  getAgentResponse(userMessage: string): string {
    const responses = [
      'Merci pour votre message ! Un de nos agents va vous répondre dans les plus brefs délais.',
      'Je comprends votre demande. Laissez-moi vous aider avec cela.',
      'Excellente question ! Voici ce que je peux vous dire à ce sujet...',
      'Je vais transférer votre demande à l\'équipe appropriée.',
      'Avez-vous d\'autres questions ? Je suis là pour vous aider !'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  scrollToForm() {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
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
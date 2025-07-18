import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paiement, StatutPaiement } from '../../models/paiement.model';
import { PaiementService } from '../../services/paiement.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { PaiementFormComponent } from '../paiement-form/paiement-form.component';

@Component({
  selector: 'app-paiement-list',
  templateUrl: './paiement-list.component.html',
  styleUrls: ['./paiement-list.component.css'],
  standalone: true,
  imports: [CommonModule, PaiementFormComponent]
})
export class PaiementListComponent implements OnInit {
  paiements: Paiement[] = [];
  users: User[] = [];
  loading = false;
  errorMessage = '';
  showForm = false;
  selectedPaiement: Paiement | null = null;
  isEditMode = false;

  constructor(
    private paiementService: PaiementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPaiements();
    this.loadUsers();
  }

  loadPaiements(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.paiementService.getAllPaiements().subscribe({
      next: (paiements) => {
        this.paiements = paiements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des paiements:', error);
        this.errorMessage = 'Erreur lors du chargement des paiements';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    });
  }

  getUserName(userId: number | undefined): string {
    if (!userId) return 'Inconnu';
    const user = this.users.find(u => u.id === userId.toString());
    return user ? `${user.nom} ${user.prenom}` : 'Inconnu';
  }

  getPrestataireName(prestataireId: number | undefined): string {
    if (!prestataireId) return 'Inconnu';
    // This would need to be implemented if you have prestataire data
    return `Prestataire ${prestataireId}`;
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
  }

  formatAmount(amount: number): string {
    return `${amount.toFixed(2)} €`;
  }

  getStatusClass(statut: StatutPaiement): string {
    switch (statut) {
      case StatutPaiement.Valide:
        return 'status-valid';
      case StatutPaiement.EnAttente:
        return 'status-pending';
      case StatutPaiement.Refuse:
        return 'status-refused';
      default:
        return 'status-unknown';
    }
  }

  getStatusText(statut: StatutPaiement): string {
    switch (statut) {
      case StatutPaiement.Valide:
        return 'Validé';
      case StatutPaiement.EnAttente:
        return 'En attente';
      case StatutPaiement.Refuse:
        return 'Refusé';
      default:
        return 'Inconnu';
    }
  }

  addPaiement(): void {
    this.selectedPaiement = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  editPaiement(paiement: Paiement): void {
    this.selectedPaiement = { ...paiement };
    this.isEditMode = true;
    this.showForm = true;
  }

  deletePaiement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      this.paiementService.deletePaiement(id).subscribe({
        next: () => {
          this.loadPaiements();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.errorMessage = 'Erreur lors de la suppression du paiement';
        }
      });
    }
  }

  onPaiementSaved(paiement: Paiement): void {
    this.showForm = false;
    this.selectedPaiement = null;
    this.loadPaiements();
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.selectedPaiement = null;
  }
} 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, CreateUserDto, UpdateUserDto } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  error = '';
  showForm = false;
  editingUser: User | null = null;
  formMode: 'create' | 'edit' = 'create';
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = '';

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  // Méthodes pour le formulaire
  showAddForm(): void {
    this.formMode = 'create';
    this.editingUser = null;
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  showEditForm(user: User): void {
    this.formMode = 'edit';
    this.editingUser = user;
    this.showForm = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  hideForm(): void {
    this.showForm = false;
    this.editingUser = null;
  }

  onFormSubmit(data: CreateUserDto | UpdateUserDto): void {
    if (this.formMode === 'create') {
      this.userService.createUser(data as CreateUserDto).subscribe({
        next: () => {
          this.successMessage = 'Utilisateur ajouté avec succès !';
          this.hideForm();
          this.loadUsers();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur';
          console.error('Erreur:', err);
        }
      });
    } else {
      if (this.editingUser) {
        this.userService.updateUser(this.editingUser.id.toString(), data as UpdateUserDto).subscribe({
          next: () => {
            this.successMessage = 'Utilisateur modifié avec succès !';
            this.hideForm();
            this.loadUsers();
          },
          error: (err) => {
            this.errorMessage = 'Erreur lors de la modification de l\'utilisateur';
            console.error('Erreur:', err);
          }
        });
      }
    }
  }

  onFormCancel(): void {
    this.hideForm();
  }
} 
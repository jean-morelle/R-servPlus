import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    console.log('onSubmit called');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);
    
    if (this.registerForm.valid) {
      console.log('Form is valid, proceeding with registration');
      this.loading = true;
      this.errorMessage = '';

      const registerData: RegisterRequest = {
        email: this.registerForm.value.email,
        nom: this.registerForm.value.nom,
        prenom: this.registerForm.value.prenom,
        motDePasse: this.registerForm.value.password,
        confirmerMotDePasse: this.registerForm.value.confirmPassword
      };

      console.log('Register data:', registerData);

      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading = false;
          // Rediriger vers la page de connexion avec un message de succès
          this.router.navigate(['/login'], {
            queryParams: { message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' }
          });
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        }
      });
    } else {
      console.log('Form is invalid, marking as touched');
      this.registerForm.markAllAsTouched();
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return 'Email invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }
} 
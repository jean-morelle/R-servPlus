import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, CreateUserDto, UpdateUserDto } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() user?: User;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() formSubmit = new EventEmitter<CreateUserDto | UpdateUserDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: [this.user?.nom || '', Validators.required],
      prenom: [this.user?.prenom || '', Validators.required],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      motDePasse: [this.mode === 'create' ? '' : undefined, this.mode === 'create' ? [Validators.required, Validators.minLength(6)] : []]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // Pour la mise à jour, on ne doit pas envoyer motDePasse s'il est vide
      if (this.mode === 'edit' && !formValue.motDePasse) {
        delete formValue.motDePasse;
      }
      
      this.formSubmit.emit(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 
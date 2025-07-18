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
      telephone: [this.user?.telephone || '', Validators.required],
      adresse: [this.user?.adresse || '', Validators.required],
      ville: [this.user?.ville || '', Validators.required],
      codePostal: [this.user?.codePostal || '', Validators.required],
      estActif: [this.user?.estActif ?? true]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 
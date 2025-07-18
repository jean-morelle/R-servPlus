import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Prestataire, CreatePrestataireDto, UpdatePrestataireDto } from '../../models/prestataire.model';

@Component({
  selector: 'app-prestataire-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prestataire-form.component.html',
  styleUrls: ['./prestataire-form.component.css']
})
export class PrestataireFormComponent implements OnInit {
  @Input() prestataire?: Prestataire;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() loading: boolean = false;
  @Output() formSubmit = new EventEmitter<CreatePrestataireDto | UpdatePrestataireDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  specialites = [
    'Plomberie',
    'Électricité',
    'Jardinage',
    'Ménage',
    'Peinture',
    'Menuiserie',
    'Autre'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom: [this.prestataire?.nom || '', Validators.required],
      prenom: [this.prestataire?.prenom || '', Validators.required],
      email: [this.prestataire?.email || '', [Validators.required, Validators.email]],
      telephone: [this.prestataire?.telephone || '', Validators.required],
      adresse: [this.prestataire?.adresse || '', Validators.required],
      ville: [this.prestataire?.ville || '', Validators.required],
      codePostal: [this.prestataire?.codePostal || '', Validators.required],
      specialite: [this.prestataire?.specialite || '', Validators.required],
      description: [this.prestataire?.description || '', Validators.required],
      tarifHoraire: [this.prestataire?.tarifHoraire || '', [Validators.required, Validators.min(0)]],
      estActif: [this.prestataire?.estActif ?? true]
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
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { RoleService } from '../services/role.service';
import { ROLES, UserRole } from '../models/auth.model';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective implements OnInit, OnDestroy {
  @Input() appRole: UserRole | UserRole[] = [];
  @Input() appRolePermission: string = '';
  
  private subscription: Subscription = new Subscription();
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.roleService.getCurrentRole$().subscribe(role => {
        this.updateView();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateView() {
    let shouldShow = false;

    // Vérifier les permissions si spécifiées
    if (this.appRolePermission) {
      shouldShow = this.roleService.hasPermission(this.appRolePermission);
    }
    // Sinon vérifier les rôles
    else if (Array.isArray(this.appRole)) {
      shouldShow = this.roleService.hasAnyRole(this.appRole);
    } else {
      shouldShow = this.roleService.hasRole(this.appRole);
    }

    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
} 
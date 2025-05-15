import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthApiService } from 'app/core/services-api/auth-api.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm!: FormGroup;

  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _authApiService = inject(AuthApiService);

  private fb = inject(FormBuilder);

  ngOnInit(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this._authService.register(this.registerForm.value).subscribe({
        next: ()=>{
          this._router.navigate(['/inicio']);
        },
        error: (error)=>{
          console.error('error iniciar sesion', error.error.error);
        }
      });
    }
  } 

}

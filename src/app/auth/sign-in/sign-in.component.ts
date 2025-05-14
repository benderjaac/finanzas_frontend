import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseApi } from 'app/core/models/response-api.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  loginForm!: FormGroup;
  
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  private fb = inject(FormBuilder);

  ngOnInit(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this._authService.signIn(this.loginForm.value).subscribe({
        next: ()=>{
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
          this._router.navigate([redirectURL]);
        },
        error: (error)=>{
          console.error('error iniciar sesion', error.error.error);
        }
      });
    }
  } 
  
}

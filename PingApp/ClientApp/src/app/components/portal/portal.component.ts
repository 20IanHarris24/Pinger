import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { UntilDestroy } from '@ngneat/until-destroy';


@UntilDestroy()
@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
  imports: [ReactiveFormsModule],
})

export class PortalComponent {


  isLoginOpen = false;
  isSubmitting = false;
  showPassword = false;
  loginError = "";


   readonly loginForm = new FormGroup({
      userName: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

  constructor(
    private readonly _titleService: Title,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
  )  {
    this._titleService.setTitle("Pinger App Demo");
  }


    openLogin(): void {
      this.isLoginOpen = true;
      this.loginError = "";
    }

    closeLogin(): void {
      this.isLoginOpen = false;
      this.showPassword = false;
      this.loginError = "";
    }

    submitLogin(): void {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }

      this.isSubmitting = true;
      this.loginError = "";

      const { userName, password } = this.loginForm.getRawValue();

      this._authService.login(userName, password)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
        next: () => {
            const returnUrl =
               this._route.snapshot.queryParamMap.get("returnUrl")
            ?? "/monitor";

          this._router.navigateByUrl(returnUrl);
        },
        error: (error: HttpErrorResponse) => {
          this.loginError =
            error.status === 401
              ? "Invalid username or password."
             : "Unable to sign in. Please try again.";
        },
      });
  }
}

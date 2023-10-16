import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from "axios";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  template: `<body>
    <div class="container">
      <header>
        <img
          class="logo"
          src="assets/img/photos_660489.png"
          alt="logo"
          (click)="this.redirect('auth/login')"
        />
        <h1 class="title">CAMAGRU</h1>
      </header>

      <div class="form_container">
        <div
          *ngFor="let label of labels; let i = index"
          [hidden]="i !== currentStep"
        >
          <div class="form_div">
            <div style="height: 20px;"></div>
            <label for="{{ modelProperties[i] }}">{{ messages[i] }}</label>
            <div style="height: 20px;"></div>
            <input
              type="text"
              [name]="modelProperties[i]"
              [id]="modelProperties[i]"
              autocomplete="off"
              [(ngModel)]="form[modelProperties[i]]"
              required
              *ngIf="i !== 2 && i !== 3"
            />

            <input
              type="password"
              [name]="modelProperties[i]"
              [id]="modelProperties[i]"
              autocomplete="off"
              [(ngModel)]="form[modelProperties[i]]"
              required
              *ngIf="i === 2 || i === 3"
            />
            <div class="error_container">
              <p *ngIf="this.clicked === true" style="margin: 0px">
                {{ this.checkError(this.currentStep) }}
              </p>
              <p *ngIf="this.taken === true">Email or username already taken</p>
            </div>
            <div class="button_container">
              <button [disabled]="currentStep === 0" (click)="prevStep()">
                Previous
              </button>
              <button
                *ngIf="currentStep !== labels.length - 1"
                [disabled]="currentStep === labels.length - 1"
                (click)="nextStep()"
              >
                Next
              </button>
              <button
                *ngIf="currentStep === labels.length - 1"
                (click)="onSubmit()"
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p>© 2023 Camagru - All wrongs reserved</p>
    </footer>
  </body> `,
  styleUrls: ["./register.css"],
})
export class RegisterComponent {
  form: any = {
    username: "",
    email: "",
    password: "",
    match: "",
  };

  labels = ["Username", "Email", "Password", "Password match"];
  messages = [
    "Please enter your username",
    "Please enter your email",
    "Please enter your password",
    "Please confirm your password",
  ];
  modelProperties = ["username", "email", "password", "password match"];
  currentStep = 0;

  clicked: boolean = false;
  match: boolean = true;
  taken: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  redirect(path: string) {
    this.router.navigate([path]);
  }

  nextStep() {
    console.log("rponse == ", this.checkError(this.currentStep));
    if (this.checkError(this.currentStep) === "") {
      this.clicked = false;
      if (this.currentStep < this.labels.length - 1) {
        console.log("step == ", this.currentStep);
        this.currentStep++;
      }
    } else this.clicked = true;
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.taken = false;
      this.currentStep--;
    }
  }

  checkError(currentStep: number): string {
    if (currentStep === 0) return this.checkUsername();
    if (currentStep === 1) return this.checkEmail();
    if (currentStep === 2) return this.checkPassword();
    if (currentStep === 3) return this.checkPasswordMatch();
    return "";
  }

  checkUsername(): string {
    const username = this.form.username;
    if (username.length < 3 || username.length > 15)
      return "Username must be between 3 and 15 characters long";
    if (this.isAlpha(username) === false)
      return "Username must contain only letters";
    return "";
  }

  checkEmail(): string {
    const email = this.form.email;
    if (this.isValidEmail(email) === false) return "Enter a valid email";
    return "";
  }

  checkPassword(): string {
    const password = this.form.password;
    if (password.length < 8 || password.length > 20)
      return "Password must be between 8 and 20 characters long";
    if (
      (this.hasLowerCase(password) &&
        this.hasUpperCase(password) &&
        this.hasDigit(password)) === false
    )
      return "Password must contain at least one uppercase letter, one lowercase letter and one digit";
    return "";
  }

  checkPasswordMatch(): string {
    if (this.form.password !== this.form.match) return "Passwords do not match";
    return "";
  }

  isAlpha(input: string): boolean {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(input);
  }

  isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  hasLowerCase(str: string) {
    return /[a-z]/.test(str);
  }

  hasUpperCase(str: string) {
    return /[A-Z]/.test(str);
  }

  hasDigit(str: string) {
    return /\d/.test(str);
  }
  async onSubmit() {
    if (this.checkError(this.currentStep) === "") {
      try {
        this.clicked = false;
        const data = {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
        }
        const response = await axios.post("http://localhost:8080/auth/local/signup", data);
        if (response.status === 409) {
          this.taken = true;
        }
      } catch (e) {
        console.log("ERROR === ", e);
      }
      console.log(this.form);
    } else this.clicked = true;
  }
}

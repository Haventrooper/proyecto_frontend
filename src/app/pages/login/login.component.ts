import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TdserviceService } from 'src/app/services/tdservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[ TdserviceService ]

})
export class LoginComponent {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private td_service: TdserviceService, 

  ) {
    this.form = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    this.td_service.login(this.form.get('user')?.value,this.form.get('password')?.value).subscribe(response => {
      let thing: any = response;
			localStorage.setItem("token", thing["token"]);
		})
  }
}


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms'
import { ServicesService } from '../../services.service';
import { ReactiveFormsModule } from '@angular/forms';
import {ValidateEmail} from '../../shared/validators/email.validator'
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactFormComponent implements OnInit {
  FormData!: FormGroup;
  constructor(private builder: FormBuilder, private contact: ServicesService) { }
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit() {
    this.FormData = this.builder.group({
      Fullname: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required,ValidateEmail]),
      Comment: new FormControl('', [Validators.required])
    });
  }


  onSubmit(FormData:FormGroup) {
    console.log(FormData)
    this.contact.PostMessage(FormData)
      .subscribe(response => {
        location.href = 'https://mailthis.to/confirm'
        console.log(response)
      }, error => {
        console.warn(error.responseText)
        console.log({ error })
      })
  }
}


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UpcomingAppointmentService } from '../../upcoming-appointment.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { UpcomingAppointment } from '../../upcoming-appointment.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

export interface DialogData {
  id: number;
  action: string;
  appointment: UpcomingAppointment;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  appointmentForm: UntypedFormGroup;
  appointment: UpcomingAppointment;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: UpcomingAppointmentService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      console.log(data.appointment.date);
      this.dialogTitle = data.appointment.doctor;
      this.appointment = data.appointment;
    } else {
      this.dialogTitle = 'New Appointment';
      const blank = {} as UpcomingAppointment;
      this.appointment = new UpcomingAppointment(blank);
    }
    this.appointmentForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.appointment.id],
      img: [this.appointment.img],
      email: [
        this.appointment.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      date: [
        formatDate(this.appointment.date, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      time: [this.appointment.time, [Validators.required]],
      mobile: [this.appointment.mobile, [Validators.required]],
      doctor: [this.appointment.doctor, [Validators.required]],
      injury: [this.appointment.injury],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.appointmentService.addUpcomingAppointment(
      this.appointmentForm.getRawValue()
    );
  }
}
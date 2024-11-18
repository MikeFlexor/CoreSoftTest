import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/models';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';

@UntilDestroy({ checkProperties: true })
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    FieldsetModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    website: new FormControl(''),
    address: new FormGroup({
      city: new FormControl(''),
      street: new FormControl(''),
      suite: new FormControl(''),
      zipcode: new FormControl(''),
      geo: new FormGroup({
        lat: new FormControl(),
        lng: new FormControl()
      })
    }),
    company: new FormGroup({
      companyName: new FormControl(''),
      catchPhrase: new FormControl(''),
      bs: new FormControl('')
    })
  });
  isAddMode: boolean = false;
  get submitButtonText() {
    return this.isAddMode ? 'Добавить' : 'Изменить';
  }
  user: User | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAddMode = this.route.snapshot.routeConfig?.path === 'add';

    // Если форма в режиме добавления
    if (this.isAddMode) {
      this.initForm();
      return;
    }

    // Если форма в режиме редактирования
    const id = +this.route.snapshot.params['id'];
    const foundUser = this.userService.users$.value.find((user) => user.id === id);
    if (foundUser) {
      this.user = foundUser;
      this.initForm();
    } else {
      this.userService.getUserById(id);
      this.userService.userById$
        .pipe(
          tap((user) => {
            if (user) {
              this.user = user;
              this.initForm();
            }
          }),
          untilDestroyed(this)
        )
        .subscribe();
    }
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      username: [this.user ? this.user.username : '', Validators.required],
      name: [this.user ? this.user.name : '', Validators.required],
      email: [this.user ? this.user.email : '', [Validators.required, Validators.email]],
      phone: [this.user ? this.user.phone : '', Validators.required],
      website: [this.user ? this.user.website : ''],
      address: this.formBuilder.group({
        city: [this.user ? this.user.address.city : '', Validators.required],
        street: [this.user ? this.user.address.street : '', Validators.required],
        suite: [this.user ? this.user.address.suite : '', Validators.required],
        zipcode: [this.user ? this.user.address.zipcode : '', Validators.required],
        geo: this.formBuilder.group({
          lat: [this.user ? this.user.address.geo.lat : null],
          lng: [this.user ? this.user.address.geo.lng : null],
        })
      }),
      company: this.formBuilder.group({
        companyName: [this.user ? this.user.company.name : '', Validators.required],
        catchPhrase: [this.user ? this.user.company.catchPhrase : ''],
        bs: [this.user ? this.user.company.bs : ''],
      })
    });
    this.cdr.markForCheck();
  }

  onGoToListClick(): void {
    this.router.navigate(['usersList']);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (this.isAddMode) {
      this.userService.addUser(this.form.value as User);
    } else if (this.user) {
      this.userService.updateUser({...this.form.value as User, id: this.user.id});
    }

    this.onGoToListClick();
  }
}

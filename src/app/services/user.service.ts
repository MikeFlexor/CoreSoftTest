import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/models';
import { catchError, tap, throwError } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): void {
    this.http.get<User[]>(this.baseUrl)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError(() => {
          return throwError(() => new Error());
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  getUserById(id: number): void {
    this.http.get<User>(`${this.baseUrl}/${id}`)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError(() => {
          return throwError(() => new Error());
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  addUser(user: User): void {
    this.http.post<User>(this.baseUrl, user)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError(() => {
          return throwError(() => new Error());
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  updateUser(user: User): void {
    this.http.put<User>(`${this.baseUrl}/${user.id}`, user)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError(() => {
          return throwError(() => new Error());
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  deleteUser(id: number): void {
    this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        catchError(() => {
          return throwError(() => new Error());
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }
}

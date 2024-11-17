import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address, Company, Geo, User } from '../models/models';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$ = new BehaviorSubject<User[]>([]);

  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): void {
    this.http.get<User[]>(this.baseUrl)
      .pipe(
        tap((response) => {
          // Если получили данные пользователей
          if (response.length) {
            const users: User[] = [];
            // Для тестового отображения большого количества строк, добавляем полученные данные несколько раз
            for (let i = 0; i < 10; i++) {
              users.push(...JSON.parse(JSON.stringify(response)) as User[]);
            }
            // Правим идентификаторы для избавления от дублирования выделения строк
            for (let i = 0; i < users.length; i++) {
              users[i].id = i;
            }
            this.users$.next(users);
          // Если полученные данные пустые, то генерируем тестовые данные
          } else {
            this.users$.next(this.getGeneratedUsers());
          }
        }),
        catchError(() => {
          this.users$.next(this.getGeneratedUsers());
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

  // Тестовое получение сгенерированного списка пользователей для случаев, когда внешнее API недоступно
  private getGeneratedUsers(): User[] {
    const users: User[] = [];

    const randomString = (length: number) => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
      }
      return result;
    };

    for (let i = 0; i < 100; i++) {
      const user: User = {
        id: i,
        name: `${randomString(10)} ${randomString(10)}`,
        username: randomString(10),
        email: `${randomString(10)}@${randomString(5)}`,
        address: {
          street: randomString(10),
          suite: randomString(10),
          city: randomString(10),
          zipcode: randomString(5),
          geo: {
            lat: randomString(7),
            lng: randomString(7)
          } as Geo
        } as Address,
        phone: randomString(10),
        website: randomString(10),
        company: {
          name: randomString(7),
          catchPhrase: randomString(20),
          bs: randomString(10),
        } as Company
      };
      users.push(user);
    }

    return users;
  }
}

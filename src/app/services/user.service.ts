import { Injectable } from '@angular/core';
import { User } from '../utils/type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpsService: HttpClient) {}

  apiUrl: string = 'https://jsonplaceholder.typicode.com/';

  getUsers(): Observable<User[]> {
    return this.httpsService.get<User[]>(this.apiUrl + 'users');
  }
  addUser(data: User): Observable<User> {
    return this.httpsService.post<User>(this.apiUrl + 'users', data);
  }
  updateUser(id: number, dataToUpdate: any): Observable<User> {
    return this.httpsService.put<User>(this.apiUrl + `users/${id}`, {
      ...dataToUpdate,
    });
  }

  deleteUser(id: number): Observable<User> {
    return this.httpsService.delete<User>(this.apiUrl + `users/${id}`);
  }
}

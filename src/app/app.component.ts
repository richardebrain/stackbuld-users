import { Component } from '@angular/core';
import { User } from './utils/type';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private fb: FormBuilder, private userService: UserService) {
    this.search.get('searchField')!.valueChanges.subscribe((val) => {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(val?.toLowerCase()!!) ||
          user.email.toLowerCase().includes(val?.toLowerCase()!!) ||
          user.phone.toLowerCase().includes(val?.toLowerCase()!!)
      );
    });
  }
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
  });
  updateUserForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
  });

  search = this.fb.group({
    searchField: [''],
  });
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = true;
  showEditForm: boolean = false;
  formToEditId!: number;
  async addUser() {
    this.userService
      .addUser({
        ...(this.userForm.value as User),
        id: Math.floor(Math.random() * 100) + 1,
      })
      .pipe(catchError(this.handleError))
      .subscribe((res) => {
        this.filteredUsers = [...this.filteredUsers, res];
        this.users = [...this.users, res];
        this.userForm.reset();
        alert('User added successfully');
      });
  }
  async updateUser(id: number) {
    this.userService
      .updateUser(id, this.updateUserForm.value)
      .pipe(catchError(this.handleError))
      .subscribe((res) => {
        const users = this.filteredUsers.map((user) => {
          if (user.id === res.id) {
            return res;
          }
          return user;
        });
        this.filteredUsers = users;
        this.users = users;
        this.showEditForm = false;
        alert('User updated successfully');
      });
  }
  async deleteUser(userid: number) {
    this.userService
      .deleteUser(userid)
      .pipe(catchError(this.handleError))
      .subscribe((res) => {
        this.filteredUsers = this.filteredUsers.filter(
          (user) => user.id !== userid
        );
        this.users = this.users.filter((user) => user.id !== userid);
        alert('User deleted successfully');
      });
  }
  showEditForms(userToEdit: User) {
    this.showEditForm = !this.showEditForm;
    this.formToEditId = userToEdit.id;
    if (this.showEditForm && userToEdit.id === this.formToEditId) {
      this.updateUserForm.setValue({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
      });
    }
  }

  ngOnInit(): void {
    this.userService
      .getUsers()
      .pipe(catchError(this.handleError))
      .subscribe((res) => {
        this.users = res;
        this.filteredUsers = res;
        this.isLoading = false;
      });
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      alert(error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status}`;
      alert(errorMessage);
    }

    return throwError(errorMessage);
  }
}

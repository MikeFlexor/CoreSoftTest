import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'userslist',
    loadComponent: async () => {
      return (await import('./components/users-list/users-list.component')).UsersListComponent;
    }
  },
  {
    path: 'userdetails',
    loadComponent: async () => {
      return (await import('./components/user-details/user-details.component')).UserDetailsComponent;
    }
  },
  {
    path: 'userform',
    loadComponent: async () => {
      return (await import('./components/user-form/user-form.component')).UserFormComponent;
    }
  },
  {
    path: '**',
    loadComponent: async () => {
      return (await import('./components/users-list/users-list.component')).UsersListComponent;
    }
  }
];

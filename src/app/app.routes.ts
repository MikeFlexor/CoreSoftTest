import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'userslist',
    loadComponent: async () => {
      return (await import('./components/users-list/users-list.component')).UsersListComponent;
    }
  },
  {
    path: 'details',
    loadComponent: async () => {
      return (await import('./components/user-details/user-details.component')).UserDetailsComponent;
    }
  },
  {
    path: 'add',
    loadComponent: async () => {
      return (await import('./components/user-form/user-form.component')).UserFormComponent;
    }
  },
  {
    path: 'edit/:id',
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

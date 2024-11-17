import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserService]
})
export class UsersListComponent implements OnInit {
  selectedUser: User | null = null;

  constructor(public userService: UserService) {}

  applyFilter(table: Table, event: any, matchMode: string) {
    table.filterGlobal((event.target as HTMLInputElement).value, matchMode);
    this.selectedUser = null;
  }

  ngOnInit(): void {
    this.userService.getUsers();
  }

  onAddClick(): void {
    // TODO
  }

  onDeleteClick(): void {
    // TODO
  }

  onDetailsClick(): void {
    // TODO
  }

  onEditClick(): void {
    // TODO
  }
}

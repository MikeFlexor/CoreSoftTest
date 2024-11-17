import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserService]
})
export class UsersListComponent implements OnInit {
  constructor(private userServise: UserService) {}

  ngOnInit(): void {
    this.userServise.getUsers();
  }
}

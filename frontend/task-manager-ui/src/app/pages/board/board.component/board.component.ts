import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskService, Task } from '../../../shared/task.service';
import { AuthService } from '../../../core/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIcon
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  tasks: Task[] = [];
  draft: Task = { title: '', description: '', status: 'TODO' };

  constructor(private api: TaskService,
    public auth: AuthService
  ) {}


 ngOnInit() {
  // const token = localStorage.getItem('tm_token');
  // if (!token) {
  //   // Redirect if no token
  //   window.location.href = '/login';
  //   return;
  // }
  this.reload();
}


  reload() {
    this.api.list().subscribe(r => (this.tasks = r));
  }
//   reload() {
//   this.api.list().subscribe({
//     next: (r) => (this.tasks = r),
//     error: (err) => console.error(err)
//   });
// }


  create() {
    this.api.create(this.draft).subscribe(_ => {
      this.draft = { title: '', description: '', status: 'TODO' };
      this.reload();
    });
  }

  setStatus(t: Task, s: Task['status']) {
    if (!t.id) return;
    this.api.update(t.id, { ...t, status: s }).subscribe(_ => this.reload());
  }

  remove(t: Task) {
    if (!t.id) return;
    this.api.delete(t.id).subscribe(_ => this.reload());
  }

  get todoTasks(): Task[] {
    return this.tasks.filter(x => x.status === 'TODO');
  }

  get inProgressTasks(): Task[] {
    return this.tasks.filter(x => x.status === 'IN_PROGRESS');
  }

  get doneTasks(): Task[] {
    return this.tasks.filter(x => x.status === 'DONE');
  }
}

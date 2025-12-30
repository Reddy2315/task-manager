import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Task = { id?: number; title: string; description?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE'; dueDate?: string };

@Injectable({ providedIn: 'root' })
export class TaskService {
  private taskUrl = 'http://localhost:8080/api/tasks';
  constructor(private http: HttpClient) { }
  // list() { 
  //   return this.http.get<Task[]>(this.taskUrl); 
  // }

  list() {
    return this.http.get<Task[]>(this.taskUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('tm_token')}`
      }
    });
  }


  create(t: Task) {
    return this.http.post<Task>(this.taskUrl, t);
  }
  update(id: number, t: Task) {
    return this.http.put<Task>(`${this.taskUrl}/${id}`, t);
  }
  delete(id: number) {
    return this.http.delete(`${this.taskUrl}/${id}`);
  }
}

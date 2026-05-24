import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIcon
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  draft: Task = { title: '', description: '', status: 'TODO', dueAt: '' };
  showCreateForm = false;
  dueAlerts: Task[] = [];
  now = new Date();
  todayStart = new Date(new Date().setHours(0, 0, 0, 0));
  dueDate: Date | null = null;
  dueHour = 'HH';
  dueMinute = 'MM';
  duePeriod: 'AM' | 'PM' = 'AM';
  hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  remindersEnabled = localStorage.getItem('tm_reminders_enabled') === 'true';
  private clockId?: number;
  private reminderId?: number;
  private reminderTimers = new Map<number, number>();

  constructor(
    private api: TaskService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {

    if (this.auth.isLoggedIn()) {
      this.reload();
    }

    this.clockId = window.setInterval(() => {
      this.now = new Date();

      if (this.auth.isLoggedIn()) {
        this.checkReminders();
      }

      this.cdr.markForCheck();
    }, 1000);

    this.reminderId = window.setInterval(() => {

      if (this.auth.isLoggedIn()) {
        this.scheduleReminderTimers();
      }

    }, 60000);
  }

  ngOnDestroy() {
    if (this.clockId) window.clearInterval(this.clockId);
    if (this.reminderId) window.clearInterval(this.reminderId);
    this.reminderTimers.forEach(id => window.clearTimeout(id));
  }

  reload() {

    if (!this.auth.isLoggedIn()) {
      this.tasks = [];
      return;
    }

    this.api.list().subscribe({
      next: (r) => {
        this.tasks = r;
        this.scheduleReminderTimers();
        this.checkReminders();
        this.cdr.markForCheck();
      },
      error: () => {
        this.tasks = [];
      }
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  create() {
    if (!this.draft.title.trim()) return;
    const payload: Task = { ...this.draft, dueAt: this.buildDueAt() };
    this.api.create(payload).subscribe(_ => {
      this.draft = { title: '', description: '', status: 'TODO', dueAt: '' };
      this.clearDueDate();
      this.showCreateForm = false;
      this.reload();
    });
  }

  clearDraft() {
    this.draft = { title: '', description: '', status: 'TODO', dueAt: '' };
    this.clearDueDate();
  }

  clearDueDate() {
    this.dueDate = null;
    this.dueHour = 'HH';
    this.dueMinute = 'MM';
    this.duePeriod = 'AM';
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

  get isTasksExist(): boolean {
    return (this.tasks?.length ?? 0) > 0;
  }

  get completionRate(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.doneTasks.length / this.tasks.length) * 100);
  }

  get pendingReminderCount(): number {
    return this.tasks.filter(t => t.status !== 'DONE' && !!t.dueAt).length;
  }

  get notificationPermission(): NotificationPermission | 'unsupported' {
    return this.notificationsSupported ? Notification.permission : 'unsupported';
  }

  get notificationsSupported(): boolean {
    return 'Notification' in window;
  }

  enableNotifications() {
    if (!this.notificationsSupported) return;
    if (Notification.permission === 'granted') {
      this.remindersEnabled = true;
      localStorage.setItem('tm_reminders_enabled', 'true');
      this.checkReminders();
      this.cdr.markForCheck();
      return;
    }
    Notification.requestPermission().then(permission => {
      this.remindersEnabled = permission === 'granted';
      localStorage.setItem('tm_reminders_enabled', String(this.remindersEnabled));
      this.checkReminders();
      this.cdr.markForCheck();
    });
  }

  disableNotifications() {
    this.remindersEnabled = false;
    localStorage.setItem('tm_reminders_enabled', 'false');
    this.reminderTimers.forEach(id => window.clearTimeout(id));
    this.reminderTimers.clear();
    this.cdr.markForCheck();
  }

  dismissAlert(task: Task) {
    this.dueAlerts = this.dueAlerts.filter(t => t.id !== task.id);
  }

  dateTimeValue(t: Task): string | undefined {
    return t.dueAt;
  }

  dateTimeLabel(t: Task): string {
    const value = this.dateTimeValue(t);
    if (!value) return 'No due time';
    return new Date(value).toLocaleString(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  timingClass(t: Task): string {
    const value = this.dateTimeValue(t);
    if (!value || t.status === 'DONE') return '';
    const dueTime = new Date(value).getTime();
    const diff = dueTime - this.now.getTime();
    if (diff < 0) return 'is-overdue';
    if (diff <= 60 * 60 * 1000) return 'is-due-soon';
    return '';
  }

  timingLabel(t: Task): string {
    const value = this.dateTimeValue(t);
    if (!value) return 'No reminder';
    if (t.status === 'DONE') return 'Completed';
    const dueTime = new Date(value).getTime();
    const diff = dueTime - this.now.getTime();
    if (diff < 0) return 'Overdue';
    if (diff <= 60 * 60 * 1000) return 'Due soon';
    return 'Scheduled';
  }

  private checkReminders() {
    const notified = new Set(JSON.parse(localStorage.getItem('tm_notified_tasks') || '[]'));
    let changed = false;

    this.tasks
      .filter(t => t.id && t.status !== 'DONE' && t.dueAt)
      .forEach(t => {
        const dueTime = new Date(t.dueAt as string).getTime();
        if (Number.isNaN(dueTime) || dueTime > Date.now() || notified.has(t.id)) return;

        if (!this.dueAlerts.some(alert => alert.id === t.id)) {
          this.dueAlerts = [t, ...this.dueAlerts].slice(0, 3);
        }

        if (this.remindersEnabled && this.notificationsSupported && Notification.permission === 'granted') {
          new Notification('Task reminder', {
            body: `${t.title} is due now.`,
            tag: `task-${t.id}`,
            requireInteraction: true
          });
        }
        notified.add(t.id);
        changed = true;
      });

    if (changed) {
      localStorage.setItem('tm_notified_tasks', JSON.stringify([...notified]));
    }
  }

  private scheduleReminderTimers() {
    this.reminderTimers.forEach(id => window.clearTimeout(id));
    this.reminderTimers.clear();

    this.tasks
      .filter(t => t.id && t.status !== 'DONE' && t.dueAt)
      .forEach(t => {
        const dueTime = new Date(t.dueAt as string).getTime();
        const delay = dueTime - Date.now();
        if (Number.isNaN(dueTime) || delay <= 0) return;

        const timerId = window.setTimeout(() => {
          this.checkReminders();
          this.cdr.markForCheck();
        }, Math.min(delay, 2147483647));

        this.reminderTimers.set(t.id as number, timerId);
      });
  }

  private buildDueAt(): string | undefined {
    if (!this.dueDate) return undefined;

    const date = new Date(this.dueDate);
    let hour = Number(this.dueHour);
    if (this.duePeriod === 'AM' && hour === 12) hour = 0;
    if (this.duePeriod === 'PM' && hour !== 12) hour += 12;

    date.setHours(hour, Number(this.dueMinute), 0, 0);
    const pad = (value: number) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  logout() {
    this.auth.logout();
    this.tasks = [];
  }

  get isGuest(): boolean {
    return !this.auth.isLoggedIn();
  }
}
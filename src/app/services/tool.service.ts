import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  private currentTool = new BehaviorSubject('select');
  currentTool$ = this.currentTool.asObservable();

  constructor() {}

  selectTool(name: string): void {
    this.currentTool.next(name);
  }
}

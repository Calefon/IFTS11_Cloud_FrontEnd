import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DyslexicFontService {
  private readonly storageKey = 'dmode';
  Dxmode = signal<boolean>(false);

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    const savedDmode = localStorage.getItem(this.storageKey);
    const isDmodeOn = savedDmode === 'dmode-on';
    this.setDxMode(isDmodeOn);
  }

  toggleDFont(): void {
    const isDmodeOn = document.documentElement.classList.toggle('dyslexic');
    localStorage.setItem(this.storageKey, isDmodeOn ? 'dmode-on' : 'dmode-off');
    this.Dxmode.set(isDmodeOn);
  }

  private setDxMode(enable: boolean): void {
    document.documentElement.classList.toggle('dyslexic', enable);
    this.Dxmode.set(enable);
  }
}
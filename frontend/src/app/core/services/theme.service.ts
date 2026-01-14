import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private preferencesSubject = new BehaviorSubject<UserPreferences>({
    theme: 'light',
    fontSize: 16
  });
  
  public preferences$ = this.preferencesSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.loadPreferences();
    }
  }

  private loadPreferences() {
    if (!this.isBrowser) return;
    
    // Cargar preferencias del localStorage
    const savedTheme = localStorage.getItem('user-theme') as 'light' | 'dark';
    const savedFontSize = localStorage.getItem('user-font-size');
    
    const preferences: UserPreferences = {
      theme: savedTheme || 'light',
      fontSize: savedFontSize ? parseInt(savedFontSize) : 16
    };
    
    this.preferencesSubject.next(preferences);
    this.applyPreferences(preferences);
  }

  setTheme(theme: 'light' | 'dark') {
    const current = this.preferencesSubject.value;
    const newPreferences = { ...current, theme };
    this.updatePreferences(newPreferences);
  }

  setFontSize(size: number) {
    const current = this.preferencesSubject.value;
    const newPreferences = { ...current, fontSize: size };
    this.updatePreferences(newPreferences);
  }

  private updatePreferences(preferences: UserPreferences) {
    this.preferencesSubject.next(preferences);
    this.applyPreferences(preferences);
    this.savePreferences(preferences);
  }

  private applyPreferences(preferences: UserPreferences) {
    if (!this.isBrowser) return;
    
    // Aplicar tema
    document.body.className = preferences.theme;
    document.documentElement.setAttribute('data-theme', preferences.theme);
    
    // Aplicar tamaño de fuente
    document.documentElement.style.fontSize = `${preferences.fontSize}px`;
    
    // Forzar repaint
    document.body.offsetHeight;
  }

  private savePreferences(preferences: UserPreferences) {
    if (!this.isBrowser) return;
    
    localStorage.setItem('user-theme', preferences.theme);
    localStorage.setItem('user-font-size', preferences.fontSize.toString());
  }

  getCurrentPreferences(): UserPreferences {
    return this.preferencesSubject.value;
  }
}
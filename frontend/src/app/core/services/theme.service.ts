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
    
    // Aplicar variables CSS para colores celestes
    this.applyThemeColors(preferences.theme);
    
    // Forzar repaint
    document.body.offsetHeight;
  }

  private savePreferences(preferences: UserPreferences) {
    if (!this.isBrowser) return;
    
    localStorage.setItem('user-theme', preferences.theme);
    localStorage.setItem('user-font-size', preferences.fontSize.toString());
  }

  private applyThemeColors(theme: 'light' | 'dark') {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      // Colores celestes del admin - modo oscuro
      root.style.setProperty('--primary-color', '#00f0ff');
      root.style.setProperty('--primary-light', '#3a86ff');
      root.style.setProperty('--primary-dark', '#0066cc');
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1a1a40');
      root.style.setProperty('--bg-card', '#162447');
      root.style.setProperty('--text-primary', '#c0d6ff');
      root.style.setProperty('--text-secondary', '#80aaff');
      root.style.setProperty('--border-color', '#3a3f5c');
      root.style.setProperty('--success-color', '#10b981');
      root.style.setProperty('--error-color', '#ef4444');
      root.style.setProperty('--warning-color', '#f59e0b');
    } else {
      // Colores celestes del admin - modo claro
      root.style.setProperty('--primary-color', '#0ea5e9');
      root.style.setProperty('--primary-light', '#0284c7');
      root.style.setProperty('--primary-dark', '#0369a1');
      root.style.setProperty('--bg-primary', '#f8fafc');
      root.style.setProperty('--bg-secondary', '#e2e8f0');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#cbd5e1');
      root.style.setProperty('--success-color', '#10b981');
      root.style.setProperty('--error-color', '#ef4444');
      root.style.setProperty('--warning-color', '#f59e0b');
    }
  }

  getCurrentPreferences(): UserPreferences {
    return this.preferencesSubject.value;
  }
}
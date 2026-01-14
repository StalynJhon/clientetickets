import { Component, OnInit } from '@angular/core';
import { ThemeService, UserPreferences } from '../../../core/services/theme.service';

@Component({
  selector: 'app-preferencias-usuario',
  templateUrl: './preferencias-usuario.component.html',
  styleUrls: ['./preferencias-usuario.component.css']
})
export class PreferenciasUsuarioComponent implements OnInit {
  currentPreferences: UserPreferences = {
    theme: 'light',
    fontSize: 16
  };
  
  fontSizeOptions = [
    { value: 12, label: 'Pequeño (12px)' },
    { value: 14, label: 'Normal (14px)' },
    { value: 16, label: 'Mediano (16px)' },
    { value: 18, label: 'Grande (18px)' },
    { value: 20, label: 'Muy Grande (20px)' }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Suscribirse a los cambios de preferencias
    this.themeService.preferences$.subscribe(preferences => {
      this.currentPreferences = preferences;
    });
    
    // Cargar preferencias actuales
    this.currentPreferences = this.themeService.getCurrentPreferences();
  }

  toggleTheme() {
    const newTheme = this.currentPreferences.theme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeService.setTheme(theme);
  }

  changeFontSize(event: any) {
    const newSize = parseInt(event.target.value);
    this.themeService.setFontSize(newSize);
  }

  getFontSizeLabel(): string {
    const option = this.fontSizeOptions.find(opt => opt.value === this.currentPreferences.fontSize);
    return option ? option.label : `${this.currentPreferences.fontSize}px`;
  }

  resetToDefaults() {
    this.themeService.setTheme('light');
    this.themeService.setFontSize(16);
  }
}
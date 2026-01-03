import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesPublicasComponent } from './promociones-publicas.component';

describe('PromocionesPublicasComponent', () => {
  let component: PromocionesPublicasComponent;
  let fixture: ComponentFixture<PromocionesPublicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionesPublicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocionesPublicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

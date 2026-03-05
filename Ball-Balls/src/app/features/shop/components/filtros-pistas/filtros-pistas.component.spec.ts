import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosPistasComponent } from './filtros-pistas.component';

describe('FiltrosPistasComponent', () => {
  let component: FiltrosPistasComponent;
  let fixture: ComponentFixture<FiltrosPistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosPistasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltrosPistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

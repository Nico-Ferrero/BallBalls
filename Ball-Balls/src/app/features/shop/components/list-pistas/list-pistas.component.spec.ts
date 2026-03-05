import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPistasComponent } from './list-pistas.component';

describe('ListPistasComponent', () => {
  let component: ListPistasComponent;
  let fixture: ComponentFixture<ListPistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPistasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

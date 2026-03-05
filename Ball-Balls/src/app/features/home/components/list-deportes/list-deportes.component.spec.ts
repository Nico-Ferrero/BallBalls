import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDeportesComponent } from './list-deportes.component';

describe('ListDeportesComponent', () => {
  let component: ListDeportesComponent;
  let fixture: ComponentFixture<ListDeportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDeportesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDeportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

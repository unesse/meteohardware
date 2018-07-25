import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Panne3parComponent } from './panne3par.component';

describe('Panne3parComponent', () => {
  let component: Panne3parComponent;
  let fixture: ComponentFixture<Panne3parComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Panne3parComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Panne3parComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGuiComponent } from './admin-gui.component';

describe('AdminGuiComponent', () => {
  let component: AdminGuiComponent;
  let fixture: ComponentFixture<AdminGuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

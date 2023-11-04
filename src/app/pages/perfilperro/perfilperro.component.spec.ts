import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilperroComponent } from './perfilperro.component';

describe('PerfilperroComponent', () => {
  let component: PerfilperroComponent;
  let fixture: ComponentFixture<PerfilperroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerfilperroComponent]
    });
    fixture = TestBed.createComponent(PerfilperroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

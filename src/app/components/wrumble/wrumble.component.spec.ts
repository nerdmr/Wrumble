import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrumbleComponent } from './wrumble.component';

describe('WrumbleComponent', () => {
  let component: WrumbleComponent;
  let fixture: ComponentFixture<WrumbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrumbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrumbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

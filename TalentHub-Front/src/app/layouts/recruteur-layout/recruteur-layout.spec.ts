import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { RecruteurLayout } from './recruteur-layout';
import { AuthService } from '../../services/auth';

describe('RecruteurLayout', () => {
  let component: RecruteurLayout;
  let fixture: ComponentFixture<RecruteurLayout>;

  const authServiceMock = {
    logout: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecruteurLayout
      ],

      imports: [
        RouterModule.forRoot([])
      ],

      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecruteurLayout);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

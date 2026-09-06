import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications';

import { NotificationService } from '../../../services/notification.service';


describe('NotificationsComponent', () => {

  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;


  const notificationServiceMock = {

    getNotifications: () => ({
      subscribe: () => {}
    }),

    marquerCommeLue: () => ({
      subscribe: () => {}
    }),

    toutMarquerLu: () => ({
      subscribe: () => {}
    })

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        NotificationsComponent
      ],

      providers: [

        {
          provide: NotificationService,
          useValue: notificationServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        NotificationsComponent
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});

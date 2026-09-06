import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages';

import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/connexion';


describe('MessagesComponent', () => {

  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;


  const messageServiceMock = {

    getMessages: () => ({
      subscribe: () => {}
    }),

    marquerCommeLu: () => ({
      subscribe: () => {}
    }),

    envoyerMessage: () => ({
      subscribe: () => {}
    })

  };


  const authServiceMock = {

    getCurrentUser: () => null

  };


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      declarations: [
        MessagesComponent
      ],

      providers: [

        {
          provide: MessageService,
          useValue: messageServiceMock
        },

        {
          provide: AuthService,
          useValue: authServiceMock
        }

      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        MessagesComponent
      );

    component =
      fixture.componentInstance;

  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });

});

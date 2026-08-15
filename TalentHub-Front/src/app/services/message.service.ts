import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';

import {
  Message,
  MessageCreation
} from '../models/message.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl =
    environment.apiUrl + 'messages/';


  constructor(
    private http: HttpClient
  ) {}


  getMessages():
    Observable<Message[]> {

    return this.http.get<Message[]>(
      this.apiUrl
    );

  }


  marquerCommeLu(
    id: number
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}${id}/marquer_lu/`,

      {}

    );

  }


  envoyerMessage(
    message: MessageCreation
  ): Observable<Message> {

    return this.http.post<Message>(
      this.apiUrl,
      message
    );

  }

}
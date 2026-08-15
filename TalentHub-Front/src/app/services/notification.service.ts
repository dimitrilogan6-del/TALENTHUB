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
  Notification
} from '../models/notification.model';

import {
  environment
} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl =
    environment.apiUrl + 'notifications/';

  constructor(
    private http: HttpClient
  ) {}

  getNotifications():
    Observable<Notification[]> {

    return this.http.get<
      Notification[]
    >(this.apiUrl);

  }

  marquerCommeLue(
    id: number
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}${id}/marquer_lue/`,

      {}

    );

  }

  toutMarquerLu():
    Observable<any> {

    return this.http.patch(

      `${this.apiUrl}tout_marquer_lu/`,

      {}

    );

  }

}
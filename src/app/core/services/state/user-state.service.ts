import { Injectable } from '@angular/core';
import { UserState } from '../../models/user-state.model';
import { StateService } from './state.service';
import { Observable } from 'rxjs';

const initialUserState: UserState = {
  userId: '',
  userName: '',
};

@Injectable({
  providedIn: 'root'
})
export class UserStateService extends StateService<UserState> {
  userId$: Observable<string> | undefined = this.select(
    (state) => state.userId,
  );
  userName$: Observable<string> | undefined = this.select(
    (state) => state.userName,
  );

  constructor() {
    super(initialUserState);
  }

  setUser(userId: string, userName: string): void {
    this.setState({ userId, userName });
  }

  clearUser(): void {
    this.setState(initialUserState);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
// Gets user token and make API calls
export class PigeonInfoService {
  private readonly pigeonRoute: string = environment.apiUrl + 'api/pigeon';
  public hasLoaded: boolean = false;
  public isAuthenticated: boolean = false;
  public token: string | null = null;
  public userProfile: User | undefined | null = null;
  public magnetCode: string | null = null;
  constructor(private http: HttpClient, 
              public auth: AuthService) {
  }

  public loadUser(): BehaviorSubject<boolean> {
    const processDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    if (!this.hasLoaded) {
      this.auth.isAuthenticated$.subscribe(response => {
        this.isAuthenticated = response;
        if (response) {
          // Get user profile if authenticated
          this.auth.user$.subscribe(user => this.userProfile = user);
          // Get user access token if authenticated
          this.auth.getAccessTokenSilently().subscribe(accessToken => {
            this.token = accessToken;
            this.hasLoaded = true;
            processDone.next(true);
          });
        }
      })
    }
    return processDone;
  }

  public getPigeon() : BehaviorSubject<boolean>{
    const processDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    const pigeonHeader: HttpHeaders = new HttpHeaders({ContentType: 'application/json',
                                                      Authorization: `Bearer ${this.token}`});
    this.http.get(this.pigeonRoute, { headers: pigeonHeader }).subscribe((code: any) => {this.magnetCode = code?.magnetCode; processDone.next(true);});
    return processDone;
  }

  public postPigeon(magnetCode: string) : BehaviorSubject<boolean> {
    const processDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    const pigeonHeader: HttpHeaders = new HttpHeaders({ContentType: 'application/json',
                                                      Authorization: `Bearer ${this.token}`}); 
    this.http.post(this.pigeonRoute, { magnetCode: magnetCode }, { headers: pigeonHeader }).subscribe(response => processDone.next(true));
    return processDone;
  }
}

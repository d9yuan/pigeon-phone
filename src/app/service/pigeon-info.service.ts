import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@auth0/auth0-spa-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AES, enc, mode, lib } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
// Gets user token and make API calls
export class PigeonInfoService {
  private readonly pigeonRoute: string = environment.apiUrl + 'api/pigeon';
  private readonly shareRoute: string = environment.apiUrl + 'api/share';
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

  private decipher(iv: any, content: string): string {
    const key = enc.Utf8.parse(environment.encrypKey);
    const cipherParams = lib.CipherParams.create({
      ciphertext: enc.Base64.parse(content)
    });
    const decryptedFromText = AES.decrypt(cipherParams, key, { iv: iv, keySize: 128 });
    
    return decryptedFromText.toString(enc.Utf8);
  }

  public getPigeon() : BehaviorSubject<boolean>{
    const processDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    const pigeonHeader: HttpHeaders = new HttpHeaders({ContentType: 'application/json',
                                                      Authorization: `Bearer ${this.token}`});
    this.http.get(this.pigeonRoute, { headers: pigeonHeader }).subscribe((code: any) => {
      if (code) {
        this.magnetCode = this.decipher(code.iv, code.content);
        processDone.next(true);
      }});
    return processDone;
  }

  public postPigeon(magnetCode: string) : BehaviorSubject<boolean> {
    const processDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    const pigeonHeader: HttpHeaders = new HttpHeaders({ContentType: 'application/json',
                                                      Authorization: `Bearer ${this.token}`}); 
    this.http.post(this.pigeonRoute, { magnetCode: magnetCode }, { headers: pigeonHeader }).subscribe(response => processDone.next(true));
    return processDone;
  }

  public getSharePigeon(pigeonId: string): BehaviorSubject<boolean> {
    const processDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    const pigeonHeader: HttpHeaders = new HttpHeaders({
      ContentType: 'application/json',
      Authorization: `Bearer ${this.token}`
    });
    this.http.post(this.shareRoute, { pigeonId: pigeonId }, { headers: pigeonHeader }).subscribe((code: any) => {
      if (code) {
        this.magnetCode = this.decipher(code.iv, code.content);
        processDone.next(true);
      }
    });
    return processDone;
  }
}

import { Component, EventEmitter, OnInit } from '@angular/core';
import { PigeonInfoService } from '../service/pigeon-info.service';

@Component({
  selector: 'app-create-screen',
  templateUrl: './create-screen.component.html',
  styleUrls: ['./create-screen.component.scss']
})
export class CreateScreenComponent implements OnInit {
  private secretPasscode: string | null = null;
  private receivedPasscodeStroke: string = '';
  public passcodeSaved: boolean = false;
  public noPassword: boolean = true;
  public wrongPassword: boolean = false;
  public bubbleFilled: boolean[]  = [false, false, false, false];
  public passcodeCreated: EventEmitter<string> = new EventEmitter<string>();
  constructor(private pigeonService: PigeonInfoService) {
    // this.pigeonService.postPigeon().subscribe(done => console.log(done + ' here'));
   }
  public passcodePressHandler(digit: string): void {
    console.log(`${digit} pressed!`);
    this.passcodeReceivedHandler(digit);
  }

  public passcodeReceivedHandler(digit: string): void {
    this.receivedPasscodeStroke += Number(digit).toString();
    this.bubbleFilled = this.bubbleFilled.map((element, index) => index < this.receivedPasscodeStroke.length);
    if (this.noPassword && this.receivedPasscodeStroke.length === 4) {
      this.bubbleFilled = [false, false, false, false];
      this.noPassword = false;
      this.secretPasscode = this.receivedPasscodeStroke;
      this.receivedPasscodeStroke = '';
    }
    else if (!this.noPassword && this.receivedPasscodeStroke.length === 4 && this.receivedPasscodeStroke !== this.secretPasscode) {
      console.log('Wrong password')
      this.wrongPassword = true;
      setTimeout(() => {
        this.bubbleFilled = [false, false, false, false];
        this.receivedPasscodeStroke = '';
        this.secretPasscode = null;
        this.noPassword = true;
        this.wrongPassword = false;
      }, 400);
    }
    else if (!this.noPassword && this.receivedPasscodeStroke.length === 4 && this.receivedPasscodeStroke === this.secretPasscode) {
      // Password set successfully
      this.passcodeSaved = true;
      this.pigeonService.postPigeon(this.secretPasscode).subscribe(done => setTimeout(() => this.passcodeCreated.emit('passcode created'), 400));
    }
  }
  ngOnInit(): void {
  }

}

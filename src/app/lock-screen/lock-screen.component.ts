import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})
export class LockScreenComponent implements OnInit {
  private receivedPasscodeStroke: string = '';
  private secretPasscode: string = '1234';
  public bubbleFilled: boolean[] = [false, false, false, false];
  public passcodeCorrect: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }
  public passcodePressHandler(digit: string): void {
    console.log(`${digit} pressed!`);
    this.passcodeReceivedHandler(digit);
  }

  public passcodeReceivedHandler(digit: string): void {
    this.receivedPasscodeStroke += digit;
    this.bubbleFilled = this.bubbleFilled.map( (element, index) => index < this.receivedPasscodeStroke.length ? true : false);
    if (this.receivedPasscodeStroke.length === 4 && this.receivedPasscodeStroke === this.secretPasscode) {
      this.passcodeCorrect.emit('passcode correct');
      this.bubbleFilled = [false, false, false, false];
      this.receivedPasscodeStroke = '';
    }
    else if (this.receivedPasscodeStroke.length === 4 && this.receivedPasscodeStroke !== this.secretPasscode) {
      this.passcodeCorrect.emit('passcode not correct');
      this.bubbleFilled = [false, false, false, false];
      this.receivedPasscodeStroke = '';
    }
  }
  public ngOnInit(): void {
  }

}

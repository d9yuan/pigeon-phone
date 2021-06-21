import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { PigeonInfoService } from '../service/pigeon-info.service';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss']
})

export class LockScreenComponent implements OnInit {
  private receivedPasscodeStroke: string = '';
  private secretPasscode: string | null= null;
  public bubbleFilled: boolean[] = [false, false, false, false];
  public passcodeCorrect: EventEmitter<string> = new EventEmitter<string>();

  constructor(private pigeonService: PigeonInfoService) {
    this.secretPasscode = this.pigeonService.magnetCode; 
  }
  public passcodePressHandler(digit: string): void {
    if (this.secretPasscode === null || this.secretPasscode === undefined || this.secretPasscode.length !== 4){
      console.log('Unknown error when retrieving passcode');
      return;
    }
    console.log(`${digit} pressed!`);
    this.passcodeReceivedHandler(digit);
  }

  public passcodeReceivedHandler(digit: string): void {
    this.receivedPasscodeStroke += Number(digit).toString();
    this.bubbleFilled = this.bubbleFilled.map( (element, index) => index < this.receivedPasscodeStroke.length);
    if (this.receivedPasscodeStroke.length === 4 && this.receivedPasscodeStroke === this.secretPasscode) {
      this.passcodeCorrect.emit('passcode correct');
      this.bubbleFilled = [false, false, false, false];
      this.receivedPasscodeStroke = '';
    }
    else if (this.receivedPasscodeStroke.length === 4 && this.receivedPasscodeStroke !== this.secretPasscode) {
      this.passcodeCorrect.emit('passcode not correct');
      setTimeout(() => {
        this.bubbleFilled = [false, false, false, false];
        this.receivedPasscodeStroke = '';
      }, 400);
    }
  }
  public ngOnInit(): void {
  }

}

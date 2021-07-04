import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CreateScreenComponent } from '../create-screen/create-screen.component';
import { EntryScreenComponent } from '../entry-screen/entry-screen.component';
import { HomeScreenComponent } from '../home-screen/home-screen.component';
import { LockScreenComponent } from '../lock-screen/lock-screen.component';
import { PigeonInfoService } from '../service/pigeon-info.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  private activeComponent: any = null;
  private componentSelector: any = { createScreen: CreateScreenComponent,
                                     homeScreen: HomeScreenComponent,
                                     lockScreen: LockScreenComponent,
                                     entryScreen: EntryScreenComponent };
  public isCreateMode: boolean = false;
  public isLoading: boolean = true;
  public profileLoading: boolean = true;
  @ViewChild('ActivePage', { read: ViewContainerRef }) activePage: ViewContainerRef | undefined;
  constructor(private pigeonService: PigeonInfoService,
              private componentFactoryResolver: ComponentFactoryResolver) {
                this.pigeonService.loadUser().subscribe(done => {
                  this.isLoading = !done;
                  if (done) {
                    this.pigeonService.getPigeon().subscribe(done => {
                      this.profileLoading = !done;
                      if (done && !this.pigeonService.magnetCode) {
                        this.isCreateMode = true;
                      }
                    });
                  }
                });
                
              }

  private loadComponent(componentClass: any): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    this.activePage?.clear();
    const componentRef = this.activePage?.createComponent(factory);
    this.activeComponent = componentClass;
    if (this.activeComponent === this.componentSelector.lockScreen){
      (<LockScreenComponent>componentRef?.instance).passcodeCorrect.subscribe(passcodeMsg => {
        console.log(passcodeMsg);
        if (passcodeMsg === 'passcode correct') {
          this.loadComponent(this.componentSelector.homeScreen);
        }
      });
    }
    else if (this.activeComponent === this.componentSelector.createScreen) {
      (<CreateScreenComponent>componentRef?.instance).passcodeCreated.subscribe(passcodeMsg => {
        console.log(passcodeMsg);
        if (passcodeMsg === 'passcode created') {
          this.loadComponent(this.componentSelector.homeScreen);
        }
      });
    }
  }

  private resetHintAnimation(): void {
    if (!this.isLoading) {
      document.getElementsByClassName('hint-text')[0].classList.remove('text-focus-in');
      (document.getElementsByClassName('hint-text')[0] as HTMLElement).offsetHeight;
      document.getElementsByClassName('hint-text')[0].classList.add('text-focus-in');
    }
  }

  public bottomBarHandler(): void {
    switch (this.activeComponent) {
      case this.componentSelector.entryScreen: {
        if (this.isCreateMode) {
          this.resetHintAnimation();
          this.loadComponent(this.componentSelector.createScreen);
        }
        else {
          this.resetHintAnimation();
          this.loadComponent(this.componentSelector.lockScreen);
        }
        break;
      }
      default: {
        this.resetHintAnimation();
        this.loadComponent(this.componentSelector.entryScreen);
        break;
      }
    }
  }

  public get hintText(): string { 
    switch (this.activeComponent) {
      case this.componentSelector.entryScreen:
        return 'Click to enter passcode';
      case this.componentSelector.lockScreen:
        return 'Click to lock screen';
      case this.componentSelector.createScreen:
        return 'Click to lock screen';
      default:
        return '';
    }
  }
  public ngOnInit(): void {
    this.loadComponent(this.componentSelector.entryScreen);
  }
}

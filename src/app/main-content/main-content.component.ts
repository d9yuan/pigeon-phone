import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
export class MainContentComponent implements AfterViewInit {
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

  public bottomBarHandler(): void {
    switch (this.activeComponent) {
      case this.componentSelector.entryScreen: {
        if (this.isCreateMode) {
          this.loadComponent(this.componentSelector.createScreen);
        }
        else {
          this.loadComponent(this.componentSelector.lockScreen);
        }
        break;
      }
      default: {
        break;
      }
    }
  }


  public ngAfterViewInit(): void {
    this.loadComponent(this.componentSelector.entryScreen);
  }
}

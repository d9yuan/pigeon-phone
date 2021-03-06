import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private pigeonId: string | null = null;
  public isCreateMode: boolean = false;
  public isLoading: boolean = true;
  public profileLoading: boolean = true;
  public hintTextAnimated: boolean = false;
  @ViewChild('ActivePage', { read: ViewContainerRef }) activePage: ViewContainerRef | undefined;
  constructor(private pigeonService: PigeonInfoService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private route: ActivatedRoute) {
                if (this.route.snapshot.paramMap.has('pigeonId')) {
                  this.pigeonId = this.route.snapshot.paramMap.get('pigeonId');
                }
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
    this.hintTextAnimated = false;
  }

  public bottomBarHandler(): void {
    this.resetHintAnimation();
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
    this.pigeonService.loadUser().subscribe(done => {
      this.isLoading = !done;
      if (done) {
        if (!this.pigeonId) {
          this.pigeonService.getPigeon().subscribe(done => {
            this.profileLoading = !done;
            if (done && !this.pigeonService.magnetCode) {
              this.isCreateMode = true;
            }
          });
        } else {
          this.pigeonService.getSharePigeon(this.pigeonId).subscribe(done => {
            this.profileLoading = !done;
            this.isCreateMode = false;
          })
        }
      }
    });
    this.loadComponent(this.componentSelector.entryScreen);
  }
}

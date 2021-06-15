import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { EntryScreenComponent } from '../entry-screen/entry-screen.component';
import { HomeScreenComponent } from '../home-screen/home-screen.component';
import { LockScreenComponent } from '../lock-screen/lock-screen.component';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements AfterViewInit {
  private activeComponent: any = null;
  private componentSelector: any = { homeScreen: HomeScreenComponent,
                                     lockScreen: LockScreenComponent,
                                     entryScreen: EntryScreenComponent };
  @ViewChild('ActivePage', { read: ViewContainerRef }) activePage: ViewContainerRef | undefined;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  private loadComponent(componentClass: any): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    this.activePage?.clear();
    const componentRef = this.activePage?.createComponent(factory);
    this.activeComponent = componentClass;
    if (this.activeComponent === LockScreenComponent){
      (<LockScreenComponent>componentRef?.instance).passcodeCorrect.subscribe(passcodeMsg => {
                                                                                console.log(passcodeMsg);
                                                                                this.loadComponent(this.componentSelector.homeScreen);
                                                                            });
    }
  }

  public bottomBarHandler(): void {
    switch (this.activeComponent) {
      case this.componentSelector.entryScreen: {
        this.loadComponent(this.componentSelector.lockScreen);
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

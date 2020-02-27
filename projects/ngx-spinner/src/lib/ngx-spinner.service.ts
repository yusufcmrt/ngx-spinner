import {ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Inject, Injectable, Injector} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {NgxSpinner, PRIMARY_SPINNER, Spinner} from './ngx-spinner.enum';
import {NgxSpinnerComponent} from './ngx-spinner.component';

@Injectable({
  providedIn: 'root'
})
export class NgxSpinnerService {
  /**
   * Spinner observable
   *
   * @memberOf NgxSpinnerService
   */
  private spinnerObservable = new ReplaySubject<NgxSpinner>(1);

  /**
   * Dynamically loaded spinner ComponentRef
   * @memberOf NgxSpinnerService
   */
  private spinnerComponentRef: ComponentRef<NgxSpinnerComponent>;

  /**
   * Creates an instance of NgxSpinnerService.
   * @memberOf NgxSpinnerService
   */
  constructor(private componentFactoryResolver: ComponentFactoryResolver, @Inject('config') public config: Spinner,
              private injector: Injector, private appRef: ApplicationRef) {
  }

  /**
   * Get subscription of desired spinner
   * @memberof NgxSpinnerService
   **/
  getSpinner(name: string): Observable<NgxSpinner> {
    return this.spinnerObservable.asObservable().pipe(filter((x: NgxSpinner) => x && x.name === name));
  }

  /**
   * To show spinner
   *
   * @memberOf NgxSpinnerService
   */
  show(name: string = PRIMARY_SPINNER, spinner?: Spinner) {
    if (name === PRIMARY_SPINNER) {
      this.createComponent();
    }
    if (spinner && Object.keys(spinner).length) {
      spinner['name'] = name;
      this.spinnerObservable.next(new NgxSpinner({...spinner, show: true}));
      return true;
    } else {
      this.spinnerObservable.next(new NgxSpinner({name, show: true}));
      return true;
    }
  }

  /**
   * To hide spinner
   *
   * @memberOf NgxSpinnerService
   */
  hide(name: string = PRIMARY_SPINNER, debounce: number = 0) {
    if (debounce) {
      return new Promise((resolve, _reject) => {
        setTimeout(() => {
          this.hideSpinner(name);
          resolve(true);
        }, debounce);
      });
    } else {
      this.hideSpinner(name);
      return true;
    }
  }

  /**
   * Hide spinner action
   * @memberOf NgxSpinnerService
   */
  private hideSpinner(name: string) {
    if (name === PRIMARY_SPINNER) {
      this.destroyComponent();
    }
    this.spinnerObservable.next(new NgxSpinner({name, show: false}));
  }

  /**
   * Create NgxSpinnerComponent and prepend body
   * @memberOf NgxSpinnerService
   */
  private createComponent() {
    if (!this.spinnerComponentRef) {
      this.spinnerComponentRef = this.componentFactoryResolver.resolveComponentFactory(NgxSpinnerComponent).create(this.injector);
      this.appRef.attachView(this.spinnerComponentRef.hostView);
      const domElem = (this.spinnerComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      document.body.prepend(domElem);
      this.spinnerComponentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Destroy component which is created dynamically
   * @memberOf NgxSpinnerService
   */
  private destroyComponent() {
    if (this.spinnerComponentRef) {
      this.spinnerComponentRef.destroy();
      this.spinnerComponentRef = null;
    }
  }
}

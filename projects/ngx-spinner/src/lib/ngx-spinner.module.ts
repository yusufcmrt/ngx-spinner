import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxSpinnerComponent} from './ngx-spinner.component';
import {Spinner} from './ngx-spinner.enum';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [NgxSpinnerComponent],
  providers: [{provide: 'config', useValue: {}}],
  exports: [NgxSpinnerComponent]
})
export class NgxSpinnerModule {

  /**
   * Set default spinner configuration
   * @param {Spinner} config
   */
  static forRoot(config?: Spinner): ModuleWithProviders {
    return {
      ngModule: NgxSpinnerModule,
      providers: [{provide: 'config', useValue: config}],
    };
  }
}

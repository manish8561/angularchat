import { NgModule, ModuleWithProviders, Type, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatliveComponent } from './chatlive.component';
import { ChatliveService, ChatliveServiceConfig } from './chatlive.service';

@NgModule({
  declarations: [
    ChatliveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ChatliveComponent,
  ],
})
export class ChatliveModule {
  static forRoot(arg0): ModuleWithProviders {
    //throw new Error("Method not implemented.");
    return ({
      ngModule: ChatliveModule,
      providers: [ChatliveService, { provide: ChatliveServiceConfig, useValue: arg0 }]
    });
  }
}

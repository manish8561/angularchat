import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatliveComponent } from './chatlive.component';

@NgModule({
  declarations: [
    ChatliveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[
    ChatliveComponent,
  ]
})
export class ChatliveModule { }

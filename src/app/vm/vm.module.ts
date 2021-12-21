import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { VmComponent } from "./vm.component";
import { VmService } from "./vm.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [VmComponent],
  providers: [VmService],
  exports: [SharedModule]
})
export class VmModule { }

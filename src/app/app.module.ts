import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { PannesComponent } from './pannes/pannes.component';

import { Routes, RouterModule } from "@angular/router";
import { Panne3parComponent } from './panne3par/panne3par.component';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { UserService } from './user.service';
import { AdminGuiComponent } from './admin-gui/admin-gui.component';
import { AuthguardGuard } from './authguard.guard';

const routes:Routes=[
  { path:'pannes', component:PannesComponent},
  { path:'3par', component:Panne3parComponent},
  { path:'',component:PannesComponent},
  {
    path:'adminGui', canActivate:[AuthguardGuard], component: AdminGuiComponent
  }
 
]

@NgModule({ 
  declarations: [
    AppComponent,
    PannesComponent,
    Panne3parComponent,
    AdminGuiComponent,
    
    
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(routes), HttpModule, FormsModule, NgxPaginationModule
  ],
  providers: [UserService,AuthguardGuard],
  bootstrap: [AppComponent]
})

export class AppModule {}



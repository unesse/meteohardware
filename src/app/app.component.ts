import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { UserService } from './user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare var $;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  data: any;
  interval: any;
  nb:number=0;
  getauth=false;
  alertError=false;
  username:any;
  password:any;
  constructor(private http:Http, private user:UserService, private router:Router ){
    
  }

  ngOnInit() {
    this.alertError=false;
      if(this.user.getUserLoggedIn()==true){
          this.getauth=true;
      }
  }
  getAuth(){
    return this.getauth;
  }
  Logged(e: NgForm){
    if(e.value['username']=="admin" && e.value['password']=="admin"){
      this.getauth=false;
      this.user.setUserLoggedIn();
      this.alertError=false;
      $('#loginModal').modal('hide');
      this.getauth=true;
      this.router.navigate(['adminGui']);
    }
    else{
      this.alertError=true;
    }
   
  }
  tab3par(){
    document.getElementById("3par").click();
  }
  dd(){
    document.getElementById("dd").click();
  }

  emcvmax(){
    document.getElementById("menu2").click();
  }

  storeonce(){
    document.getElementById("storeonce").click();
  }

  brocade(){
    document.getElementById("brocade").click();
  }

  cisco(){
    document.getElementById("cisco").click();
  }


  
}

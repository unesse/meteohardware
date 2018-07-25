import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";

@Component({
  selector: 'app-panne3par',
  templateUrl: './panne3par.component.html',
  styleUrls: ['./panne3par.component.css']
})
export class Panne3parComponent implements OnInit {
  varTest:any;
  constructor(private http:Http) {
   
   }

  ngOnInit() {
  }

  onTest(){
   this.http.get("http://16.19.50.171:8080/Components/sjhdcjdsz")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.varTest=data;
      
    })
  }

}

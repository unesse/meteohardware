import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as Chart from 'chart.js';
import * as jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
declare var $;
@Component({
  selector: 'app-pannes',
  templateUrl: './pannes.component.html',
  styleUrls: ['./pannes.component.css'],
  
})
export class PannesComponent implements OnInit {
  phy3par: any;
  log3par: any;
  port3par:any;
  disk3par:any;
  battery3par:any;
  nodes3par:any;
  network:any;
  licenceState:any;
    nbNormal:number=0 ;
    nbFailed:number=0 ;
    nbWarning:number=0;
    nbFailedPhy:number=0;
    nbFailedLog:number=0;
    nbFailedDisk:number=0;
    nbFailedPort:number=0;
    nbWarningPhy:number=0;
    nbWarningLog:number=0;
    nbWarningDisk:number=0;
    nbWarningPort:number=0;
    interval:any;
    warningPhy=[];
    failedPhy=[];
    warningLog=[];
    failedLog=[];
    warningPort=[];
    failedPort=[];
    warningDisk=[];
    failedDisk=[];
    rawFree:number=0;
    usableFree:number=0;
    time=new Date();
    alerts3par:any=[];
    motCle:string="";
    pn:number=1;
  myLineChart:any;
  dataChartPhy=[];
  dataChartLog=[];
  dataChartDisk=[];
  dataChartPort=[];
  labelChart=[];
  phy3parArchive:any;
  log3parArchive:any;
  port3parArchive:any;
  disk3parArchive:any;
  
  constructor(private http:Http) {
    
    
   }
   refreshData(){
    this.http.get("http://16.19.50.171:8080/3PAR/initialiser")
.map((resp)=>resp.json())
.subscribe(data=> {  
  
});

  //  this.update();
    
    this.time = new Date();
    
    // setTimeout(function(){
    //   $(function(){
    //     var table = $('.phyTable').DataTable();
    //     table
    // .order( [ 3, 'asc' ] )
        
    // .draw();
    //   })
    // },300);
//  setTimeout(function(){
//       $(function(){
//         var tabl = $('.logiTable').DataTable();
//         tabl
//         .order( [ 1, 'asc' ] )
//         .draw();
//       })
//     },300);
   
this.http.get("http://16.19.50.171:8080/Components/3PAR/networkState")
.map((resp)=>resp.json())
.subscribe(data=> {  
  this.network=data;
});
this.http.get("http://16.19.50.171:8080/Components/3PAR/licenceState")
.map((resp)=>resp.json())
.subscribe(data=> {  
  this.licenceState=data;
 
});
    this.http.get("http://16.19.50.171:8080/Components/3PAR/disks")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.disk3par=data;
      for(var item of this.disk3par){
        if(item.state=='normal'){
          this.nbNormal++;
         
        }
        if(item.state=='failed'){
          this.nbFailed++;   
          this.nbFailedDisk++;
        }
      }
    });
    this.http.get("http://16.19.50.171:8080/Components/3PAR/ports")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.port3par=data;
      for(var item of this.port3par){
        if(item.state=='ready'){
         
          this.nbNormal++;
         
        }
        if(item.state=='offline'){
          this.nbFailed++;
          this.nbFailedPort++;
         
        }
        if(item.state=='loss_sync'){
          this.nbWarning++;
          this.nbWarningPort++;
         
        }
      }
    });
    this.http.get("http://16.19.50.171:8080/Components/3PAR/physicals/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.phy3par=data;
      for(var item of this.phy3par){
        if(item.state=='normal'){
          this.nbNormal++;
         
        }
        if(item.state=='degraded'){
           this.nbWarning++;
          this.nbWarningPhy++;
          
         
        }
        if(item.state=='failed'){
         this.nbFailed++;
          this.nbFailedPhy++;
          
        }
      }
      
    });
    this.http.get("http://16.19.50.171:8080/Panes/3PAR/physicals")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.phy3parArchive=data;
    });
    this.http.get("http://16.19.50.171:8080/Panes/3PAR/logicals")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.log3parArchive=data;
    });
    this.http.get("http://16.19.50.171:8080/Panes/3PAR/ports")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.port3parArchive=data;
    });
    this.http.get("http://16.19.50.171:8080/Panes/3PAR/disks")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.disk3parArchive=data;
    });

    this.http.get("http://16.19.50.171:8080/Components/3PAR/logicals/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.log3par=data;
      for(var item of this.log3par){
        if(item.state=='normal'){
          this.nbNormal++;
         
        }
        if(item.state=='failed'){
          this.nbFailed++;
          this.nbFailedLog++;
         
        }
      }
      setTimeout(function(){
        $(function(){
          var time=new Date();
           $('.appendedLog').remove();
          var tabl = $('.logiTable').append('<caption class="appendedLog" style="caption-side: top">Resultat de health check du disque Logique \n La Date du health check : '+time+' </caption>').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength',
            {
              extend: 'collection',
              text: 'Telecharger l\'archivage des pannes',
              className: 'btn btn-primary',
            init: function(api, node, config) {
              $(node).removeClass('dt-button')
           },
              buttons: [
                  {
                      text: 'Format PDF',
                      action: function () {
                        var time=new Date();
                        $('.appendedLog1').remove();
                        var table = $('.logiTableArchive').append('<caption class="appendedLog1" style="caption-side: top">Liste des pannes du disque logique trié selon la date  \n La Date du la dernière healthcheck : '+time+'</caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-pdf")[2].click();
                      }
                  },
                  {
                      text: 'Format Excel',
                      action: function () {
                        var time=new Date();
                        $('.appendedlog2').remove();
                        var table = $('.logiTableArchive').append('<caption class="appendedLog2"  style="caption-side: top">Liste des pannes du disque Logique trié selon la date \n La Date du la dernière healthcheck : '+time+' </caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-excel")[2].click();
                      }
                  }
              ]
          }]
          });
        
          tabl
          .order( [ 3, 'asc' ] )
          .draw();
        })
      },300);
      setTimeout(function(){
        $(function(){
          var time=new Date();
          $('.appendedPhy').remove();
          var table = $('.phyTable').append('<caption  class="appendedPhy"  style="text-align:center;caption-side: top">Resultat de health check du disque Physique \n La Date du health check : '+time+' </caption>').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength',
            {
              extend: 'collection',
              text: 'Telecharger l\'archivage des pannes',
              className: 'btn btn-primary',
            init: function(api, node, config) {
              $(node).removeClass('dt-button')
           },
              buttons: [
                  {
                      text: 'Format PDF',
                      action: function () {
                        var time=new Date();
                        $('.appendedPhy1').remove();
                        var table = $('.phyTableArchive').append('<caption class="appendedPhy1"  style="caption-side: top">Liste des pannes du disque physique trié selon la date  \n La Date du la dernière healthcheck : '+time+'</caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-pdf")[1].click();
                      }
                  },
                  {
                      text: 'Format Excel',
                      action: function () {
                        var time=new Date();
                        $('.appendedPhy2').remove();
                        var table = $('.phyTableArchive').append('<caption  class="appendedPhy2" style="caption-side: top">Liste des pannes du disque physique trié selon la date \n La Date du la dernière healthcheck : '+time+' </caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-excel")[1].click();
                      }
                  }
              ]
          }]
          });
          
          table
      .order( [ 3, 'asc' ] )
          
      .draw();
        })
      },300);
      
      setTimeout(function(){
        $(function(){
          var time=new Date();
          $('.appendedPort').remove();
          var table = $('.portsTable').append('<caption class="appendedPort"  style="caption-side: top">Resultat de health check des ports \n La Date du health check : '+time+' </caption>').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength',
            {
              extend: 'collection',
              text: 'Telecharger l\'archivage des pannes',
              className: 'btn btn-primary',
            init: function(api, node, config) {
              $(node).removeClass('dt-button')
           },
              buttons: [
                  {
                      text: 'Format PDF',
                      action: function () {
                        var time=new Date();
                        $('.appendedPort1').remove();
                        var table = $('.portTableArchive').append('<caption class="appendedPort1"  style="caption-side: top">Liste des pannes des ports trié selon la date  \n La Date du la dernière healthcheck : '+time+'</caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-pdf")[3].click();
                      }
                  },
                  {
                      text: 'Format Excel',
                      action: function () {
                        var time=new Date();
                        $('.appendedPort2').remove();
                        var table = $('.portTableArchive').append('<caption class="appendedPort2"  style="caption-side: top">Liste des pannes des ports trié selon la date \n La Date du la dernière healthcheck : '+time+' </caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-excel")[3].click();
                      }
                  }
              ]
          }]
          });
          table
      .order( [ 3, 'asc' ] )
          
      .draw();
        })
      },300);
      
      setTimeout(function(){
        $(function(){
          var time=new Date();
          $('.appendedDisk').remove();
          var table2 = $('.disksTable').append('<caption  class="appendedDisk" style="caption-side: top">Resultat de health check du disque Inventory \n La Date du health check : '+time+' </caption>').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength',
            {
              extend: 'collection',
              text: 'Telecharger l\'archivage des pannes',
              className: 'btn btn-primary',
            init: function(api, node, config) {
              $(node).removeClass('dt-button')
           },
              buttons: [
                  {
                      text: 'Format PDF',
                      action: function () {
                        var time=new Date();
                        $('.appendedDisk1').remove();
                        var table = $('.disksTableArchive').append('<caption  class="appendedDisk1" style="caption-side: top">Liste des pannes du disque Inventory trié selon la date  \n La Date du la dernière healthcheck : '+time+'</caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-pdf")[4].click();
                      }
                  },
                  {
                      text: 'Format Excel',
                      action: function () {
                        var time=new Date();
                        $('.appendedDisk2').remove();
                        var table = $('.disksTableArchive').append('<caption class="appendedDisk2"  style="caption-side: top">Liste des pannes du disque Inventory trié selon la date \n La Date du la dernière healthcheck : '+time+' </caption>').DataTable({
                          retrieve: true,
                          dom: 'Bfrtip',
                          buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
                        });
                        table
                    .order( [ 4, 'desc' ] )
                        
                    .draw();
                        $(".buttons-excel")[4].click();
                      }
                  }
              ]
          }]
          });
          table2
          .order( [ 3, 'asc' ] )
          .draw();
        })
      },300);
        this.labelChart.push(this.time.toLocaleString());
      this.dataChartPhy.push(this.nbFailedPhy);
      this.dataChartLog.push(this.nbFailedLog);
      this.dataChartPort.push(this.nbFailedPort);
      this.dataChartDisk.push(this.nbFailedDisk);
      
      if(this.labelChart.length==9){
        this.labelChart.shift();
        this.dataChartPhy.shift();
        this.dataChartLog.shift();
         this.dataChartPort.shift();
        this.dataChartDisk.shift();
      }
    this.myLineChart = new Chart(document.getElementById("myChartCheck"), {
      type: 'line',
      data: {
        labels: this.labelChart,
        datasets: [
          { 
            data: this.dataChartPhy,
            borderColor: "#1ac5e0",
            label: 'Physical Disk',
           
          },
          { 
            data:this.dataChartLog,
            borderColor: "#af5c06",
            label: 'Logical Disk',
            
          },
          { 
            data: this.dataChartDisk,
            label: 'Disk Inventory',
            borderColor: "#1fb715",
          },
          { 
            data:this.dataChartPort,
            borderColor: "#7115b7",
            label: 'Port',
          },
        ]
      },
      options: {
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true,
           
            ticks: {
               minRotation: 50,
               min:1
            },
          }],
          yAxes: [{
            display: true,
             ticks: {
            beginAtZero: true
          },
         // stepSize: 2
          }],
        },

      }
    });
    });
    this.http.get("http://16.19.50.171:8080/Components/3PAR/alerts/chercherAlert?r="+this.motCle)
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.alerts3par=data.content;
      
    });

    this.http.get("http://16.19.50.171:8080/Components/3PAR/freeSpace/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.rawFree=data.rawFree;
      this.usableFree=data.usableFree;
       new Chart(document.getElementById("myChart"),
    {
    "type":"doughnut",
    "data":
        {
        "labels":["Usable Free : "+this.usableFree,"Raw Free : "+this.rawFree],
        "datasets":[{"label":"My First Dataset","data":[this.usableFree,this.rawFree],
                    "backgroundColor":
                            ["rgb(255, 99, 132)",
                            "rgb(54, 162, 235)",
     ]}]}});
    });
   
     
    
  
   

  
   
    this.http.get("http://16.19.50.171:8080/Components/3PAR/batteries")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.battery3par=data;
      
    });
    this.http.get("http://16.19.50.171:8080/Components/3PAR/nodes")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.nodes3par=data;
      
    });
  
   


  

}
  ngOnInit() {
    

    var dt=new Date();
    
    this.refreshData();
    
     this.interval = setInterval(() => { 
     
      if((new Date().getMinutes()==0)){
      this.nbNormal=0 ;
      this.nbFailed=0 ;
      this.nbWarning=0;
      this.nbFailedPhy=0;
      this.nbFailedLog=0;
      this.nbFailedDisk=0;
      this.nbFailedPort=0;
      this.nbWarningPhy=0;
      this.nbWarningLog=0;
      this.nbWarningDisk=0;
      this.nbWarningPort=0;
      this.rawFree=0;
      this.usableFree=0;
     
      this.update();
        this.refreshData();
      }

      }, 60000);
                           
  }

  setColorTr(state){
    
    switch(state){
      case 'normal':return 'rgba(137, 243, 95, 0.644)' ;
      case 'degraded':return 'rgba(226, 175, 109, 0.815)' ;
      case 'failed':return 'rgba(226, 109, 109, 0.815)' ;
    }
  }
  setColorTrPorts(state){
    
    
    switch(state){
      case 'ready':return 'rgba(137, 243, 95, 0.644)' ;
      case 'loss_sync':return 'rgba(226, 175, 109, 0.815)' ;
      case 'offline':return 'rgba(226, 109, 109, 0.815)' ;
    }
  }
  getClassAlertInfo(severity){
    
    if(severity.includes('Informational')){
      
    return true;
    }
    else{
    return false;
    }
  }
  getClassAlertCritical(severity){
    if(severity.includes('Critical'))
    return true;

    return false;
  }
  WarningPhy(){
     
    while(this.warningPhy.length){
      this.warningPhy.pop();
   }
   

      setTimeout(function(){
        
        $(function(){
          var table = $('.phyTableW').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/physicals/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.phy3par=data;
      for(var item of this.phy3par){
      
        if(item.state=='degraded'){
          this.warningPhy.push(item)
         
        }
        
      }

      $('#myModalWPhy').modal('show'); 
      
    });
    
   
  }
   FailedPhy(){
   
    while(this.failedPhy.length){
      this.failedPhy.pop();
   }
  
      setTimeout(function(){
        $(function(){
          var table = $('.phyTableF').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/physicals/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.phy3par=data;
      for(var item of this.phy3par){
      
        if(item.state=='failed'){
          this.failedPhy.push(item)
         
        }
        
      }
     
      $('#myModalFPhy').modal('show'); 
      
    });
    
   
  }

  WarningLog(){
     
    while(this.warningLog.length){
      this.warningLog.pop();
   }
   

      setTimeout(function(){
        
        $(function(){
          var table = $('.LogTableW').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/logicals/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.log3par=data;
      for(var item of this.log3par){
      
        if(item.state=='degraded'){
          this.warningLog.push(item)
         
        }
        
      }

      $('#myModalWLog').modal('show'); 
      
    });
    
   
  }
   FailedLog(){
   
    while(this.failedLog.length){
      this.failedLog.pop();
   }
  
      setTimeout(function(){
        $(function(){
          var table = $('.LogTableF').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/logicals/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.log3par=data;
      for(var item of this.log3par){
      
        if(item.state=='failed'){
          this.failedLog.push(item)
         
        }
        
      }
     
      $('#myModalFLog').modal('show'); 
      
    });
    
   
  }

  WarningPort(){
     
    while(this.warningPort.length){
      this.warningPort.pop();
   }
   

      setTimeout(function(){
        
        $(function(){
          var table = $('.PortTableW').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/ports/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.port3par=data;
      for(var item of this.port3par){
      
        if(item.state=='loss_sync'){
          this.warningPort.push(item)
         
        }
        
      }

      $('#myModalWPort').modal('show'); 
      
    });
    
   
  }
   FailedPort(){
   
    while(this.failedPort.length){
      this.failedPort.pop();
   }
  
      setTimeout(function(){
        $(function(){
          var table = $('.PortTableF').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/ports/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.port3par=data;
      for(var item of this.port3par){
      
        if(item.state=='offline'){
          this.failedPort.push(item)
         
        }
        
      }
     
      $('#myModalFPort').modal('show'); 
      
    });
    
   
  }
  FailedDisk(){
    while(this.failedDisk.length){
      this.failedDisk.pop();
   }
  
      setTimeout(function(){
        $(function(){
          var table = $('.disksTableF').DataTable({
            retrieve: true,
            dom: 'Bfrtip',
            buttons: ['copy', 'csv', 'excel','pdf', 'print','pageLength']
          });
          table
      .order( [ 3, 'asc' ] )
      .draw();
        })
      },300);
    this.http.get("http://16.19.50.171:8080/Components/3PAR/disks/")
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.disk3par=data;
      for(var item of this.disk3par){
      
        if(item.state=='failed'){
          this.failedDisk.push(item)
         
        }
        
      }
     
      $('#myModalFDisk').modal('show'); 
      
    });
    
  }
  getMargin(i){
    var k=i%2;
    switch(k){
      case 0 : return '0px 8px 8px 0px';
      default: return '0px 0px 8px 8px';
    }
  }
  getUrl(e){
    if(e=="Active")
    return 'url(https://cdn3.iconfinder.com/data/icons/medicon/512/accept_check_ok_yes_tick_success-512.png)  no-repeat top center';
    else
    return 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHanyYjOjhUuellTc2444bFCtr3YE9DzCGrTXn0dDWKBagTgtr)  no-repeat top center';
    
  }
  

  onSearchAlert(e){
    this.http.get("http://16.19.50.171:8080/Components/3PAR/alerts/chercherAlert?r="+this.motCle)
    .map((resp)=>resp.json())
    .subscribe(data=> {  
      this.alerts3par=data.content;
      this.pn=1;
      
    });
  }
 
  getBKColorAlert(sev){
    if(sev.includes('Fatal')){
      return 'rgba(214, 41, 46, 0.59)';
    }else if(sev.includes('Critical')){
      return 'rgba(245, 175, 177, 0.93)';
      //#421515
    }else if(sev.includes('Major')){
      return 'rgb(234, 208, 208)';
      //#a94442
    }else if(sev.includes('Minor')){
      return '#ded292eb';
      //#655436
    }else if(sev.includes('Degraded')){
      return '#e4e1cf';
      //#846228
    }else if(sev.includes('Informational')){
      return 'rgba(199, 220, 230, 0.83)';
      //#326f8e
    }
  }
  getColorAlert(sev){
    if(sev.includes('Critical')){
      return '#612525';
      //
    }else if(sev.includes('Major')){
      return '#a94442';
      //
    }else if(sev.includes('Minor')){
      return '#655436';
      //
    }else if(sev.includes('Degraded')){
      return '#846228';
      //
    }else if(sev.includes('Informational')){
      return '#326f8e';
      //
    }
  }
  
  update(){
    this.http.get("http://16.19.50.171:8080/3PAR/update/physicals")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    this.http.get("http://16.19.50.171:8080/3PAR/update/logicals")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    this.http.get("http://16.19.50.171:8080/3PAR/update/ports")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    this.http.get("http://16.19.50.171:8080/3PAR/update/disks")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    this.http.get("http://16.19.50.171:8080/3PAR/update/alerts")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    this.http.get("http://16.19.50.171:8080/3PAR/update/nodes")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    this.http.get("http://16.19.50.171:8080/3PAR/update/batteries")
    .map((resp)=>resp)
    .subscribe(data=> {  
     
    });
    
  }
 
}

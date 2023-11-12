import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs"


import {OperationsResponseType} from "../types/operations-response.type"


export class Main{
    private result:any;
    private Month:number;
    private dateFromTo:string;
    private dateTo:string;
    private nowYear:string;
    private nowMonth:string;
    private nowDay:string;

    private canvasErn: HTMLCanvasElement | null;
    private contextErn: any;
    private canvasComs: HTMLCanvasElement | null;
    private contextCom: any;
    
   

    private comsupt:any;
    private erning:any;


    private dataCom:any;
    private amountsCom:any;
    private dataErn:any;
    private amountsErn:any;
   
    constructor(){
        let mainElement:HTMLElement|null =  document.getElementById('main')
        if(mainElement){
            mainElement.classList.remove('activ')
        }

        let buttom = document.querySelectorAll('.period-button')
        buttom.forEach((itm)=>{
            itm.addEventListener('click', function(this:HTMLElement){
                buttom.forEach((btn)=>{
                    (btn as HTMLElement).style.backgroundColor='transparent';
                    (btn as HTMLElement).style.color='#6c757d';
                });
                
                this.style.backgroundColor='#6c757d';
                this.style.color='white'
            })
        })
        

        this.result = null
        this.Month = new Date().getMonth()+1

        this.dateFromTo = new Date().getFullYear().toString()+'-'+this.Month.toString()+'-'+new Date().getDate().toString()+'&dateTo='+new Date().getFullYear().toString()+'-'+this.Month.toString()+'-'+new Date().getDate().toString()
        this.dateTo='&dateTo='+new Date().getFullYear().toString()+'-'+this.Month.toString()+'-'+new Date().getDate().toString()
        this.nowYear = new Date().getFullYear().toString()
        this.nowMonth = this.Month.toString()
        this.nowDay = new Date().getDate().toString()

        this.canvasErn = null
        this.contextErn = null
        this.canvasComs = null
        this.contextCom = null
        
       

        this.comsupt=[]
        this.erning = []


        this.dataCom =[]
        this.amountsCom = []
        this.dataErn=[]
        this.amountsErn=[]
       
        this.sorting()

    }

   private async int(data = this.dateFromTo):Promise<void>{
        try{

            const result:OperationsResponseType[] = await CustomHttp.request(configs.host+'/operations?period=interval&dateFrom='+data)
                
            if(result){

                
                this.result = result
                let canv1Element:HTMLElement|null = document.getElementById('canv1')
                let canv2Element:HTMLElement|null = document.getElementById('canv2')
                if(canv1Element&&canv2Element){
                    canv1Element.innerHTML = ``
                    canv2Element.innerHTML = ``
            
    
                    canv1Element.innerHTML = `<canvas class="" id="erning"></canvas>`
                    canv2Element.innerHTML = `<canvas  id="comsumpt"></canvas>`
    
                    
                    this.canvasErn = document.getElementById('erning') as HTMLCanvasElement
                    this.canvasComs = document.getElementById('comsumpt') as HTMLCanvasElement
                    
                    if(this.canvasErn&&this.canvasComs){
                        this.contextErn = this.canvasErn.getContext('2d')
                        this.contextCom = this.canvasComs.getContext('2d')
                    }
                }

               



                this.dataCom =[]
                this.amountsCom = []
                this.dataErn=[]
                this.amountsErn=[]
                this.comsupt=[]
                this.erning = []
                this.canv()
               
            }
        }catch(e){
            console.log(e)
        }
    }
   private canv():void{
        
        for(let i =0; i<this.result.length;i++){
            if(this.result[i].type === 'expense'){
                this.comsupt.push(this.result[i])
            }else{
                this.erning.push(this.result[i])
            }
        }

        this.sort('expense',this.comsupt)
        this.sort('income',this.erning)
    
        this.showChar(this.amountsCom,this.dataCom,this.contextCom)
        this.showChar(this.amountsErn,this.dataErn,this.contextErn)
    }

   private sorting():void{
        const that = this
        let data = new Date();

        this.int(this.dateFromTo)

        let todayElement:HTMLElement|null=document.getElementById('today')
        if(todayElement){
            todayElement.onclick = function () {
                let interval:string = that.dateFromTo
                that.int(interval)
            }
        }

        let weekElement:HTMLElement|null=document.getElementById('week')
        if(weekElement){
            weekElement.onclick = function () {
                let startDate = new Date();
                startDate.setDate(data.getDate() - 7);
    
                let interval:string = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo
                that.int(interval)
            }
        }

        let monthElement:HTMLElement|null=document.getElementById('month')
        if(monthElement){
            monthElement.onclick = function () {
                let startDate = new Date();
                startDate.setMonth(data.getMonth() - 1);
    
                let interval:string  = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo
                that.int(interval)
            }
        }

        let yearElement:HTMLElement|null=document.getElementById('year')
        if(yearElement){
            yearElement.onclick = function () {
                let interval:string  = new Date().getFullYear()-1+'-'+that.nowMonth+'-'+that.nowDay+that.dateTo
                that.int(interval)
                
            }
        }
        let allElement:HTMLElement|null=document.getElementById('all')
        if(allElement){
            allElement.onclick = function () {
                let interval:string = '1999-01-01&dateTo=2300-09-13'
                that.int(interval)
                
            }
        }
        let intervalElement:HTMLElement|null=document.getElementById('interval')
        if(intervalElement){
            intervalElement.onclick = function () {
                let dateFrom = (document.getElementById('dateFrom') as HTMLInputElement).value
                let dateTo = (document.getElementById('dateTo')as HTMLInputElement).value
                let interval:string = dateFrom+'&dateTo='+dateTo
                that.int(interval)
            }
        }


      
    }
    

   private showChar(amountsCom:number,dataCom:number, context:number):void{
        let data  = {
            labels: dataCom,
            datasets:[{
                data: amountsCom,
            }]
        }
        let config = {
            type: 'pie',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              }
            },
        }


        let chart = new Chart(context,config)
      
        
    }

   private sort(type:string,arry:any):void{
        var holder:any = {};
            
        arry.forEach(function(d:any) {
          if (holder.hasOwnProperty(d.category)) {
            holder[d.category] = holder[d.category] + d.amount;
          } else {
            holder[d.category] = d.amount;
          }
        });
        
        var sameComsart = [];
        
        for (var prop in holder) {
          sameComsart.push({ category: prop, amount: holder[prop] });
        }

        for(let i =0; i<sameComsart.length;i++){
            if(type === 'expense'){
                this.dataCom.push(sameComsart[i].category)
                this.amountsCom.push(sameComsart[i].amount)
            } else if(type === 'income'){
                this.dataErn.push(sameComsart[i].category)
                this.amountsErn.push(sameComsart[i].amount)
            }    
        }
      
    }
}
import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs";
import {Chart} from 'chart.js/auto'

import { SortingInterval } from "../utills/sorting";


import {OperationsResponseType} from "../types/operations-response.type"


export class Main extends SortingInterval{
    public sortNowInterval:string=''
    
    private result:OperationsResponseType[]|null;
    private canvasErn: HTMLCanvasElement | null;
    private contextErn: CanvasRenderingContext2D | null;
    private canvasComs: HTMLCanvasElement | null;
    private contextCom: CanvasRenderingContext2D | null;
    
   

    private comsupt:OperationsResponseType[];
    private erning:OperationsResponseType[];


    private dataCom:{}[];
    private amountsCom:{}[];
    private dataErn:{}[];
    private amountsErn:{}[];
   
    constructor(){
        super()
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
       
        this.int(this.dateFromTo)
        this.sorting(Main)

    }

   public async int(data = this.dateFromTo):Promise<void>{
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
               return
            }
            return
        }catch(e){
            console.log(e)
            return
        }
    }
   private canv():void{
        if(this.result){
            for(let i =0; i<this.result.length;i++){
                if(this.result[i].type === 'expense'){
                    this.comsupt.push(this.result[i])
                }else{
                    this.erning.push(this.result[i])
                }
            }
        }
        this.sort('expense',this.comsupt)
        this.sort('income',this.erning)
    
        this.showChar(this.amountsCom,this.dataCom,this.contextCom)
        this.showChar(this.amountsErn,this.dataErn,this.contextErn)
    }


   private showChar(amountsCom:{}[],dataCom:{}[], context:CanvasRenderingContext2D|null):void{
        let data:{labels:{}[];datasets: { data: {}[]; }[];}  = {
            labels: dataCom,
            datasets:[{
                data: amountsCom,
            }]
        }

        if(context){
            new Chart(context,{
                type: 'pie',
                data: data,
                options: {
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  }
                }
            })
        }

      
      
        
    }

   private sort(type:string,arry:OperationsResponseType[]):void{
        let holder:{[key: string]: number} = {};
            
        arry.forEach(function(d:OperationsResponseType):void {
          if (holder.hasOwnProperty(d.category)) {
            holder[d.category] = holder[d.category] + d.amount;
          } else {
            holder[d.category] = d.amount;
          }
        });
        
        let sameComsart = [];
        
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
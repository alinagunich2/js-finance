import { Main } from "../components/main";
import { MainErnings } from "../components/main-ernings-comsumption";

export class SortingInterval{
  
    public Month:number;
    public dateFromTo:string;
    public dateTo:string;
    public nowYear:string;
    public nowMonth:string;
    public nowDay:string;
    public interval:string|null

    // public sortNowInterval:string =''

    constructor(){
      

        this.interval = null

        this.Month = new Date().getMonth()+1

        this.dateFromTo = new Date().getFullYear().toString()+'-'+this.Month.toString()+'-'+new Date().getDate().toString()+'&dateTo='+new Date().getFullYear().toString()+'-'+this.Month.toString()+'-'+new Date().getDate().toString()
        this.dateTo='&dateTo='+new Date().getFullYear().toString()+'-'+this.Month.toString()+'-'+new Date().getDate().toString()
        this.nowYear = new Date().getFullYear().toString()
        this.nowMonth = this.Month.toString()
        this.nowDay = new Date().getDate().toString()
    }

    public sorting(type:typeof MainErnings | typeof Main):void{
        const that:SortingInterval = this
        let data = new Date();
        let todayElement:HTMLElement|null=document.getElementById('today')
        if(todayElement){
            todayElement.onclick = function () {
                that.interval = that.dateFromTo
                
                new type().int(that.interval)
            }
        }

        let weekElement:HTMLElement|null=document.getElementById('week')
        if(weekElement){
            weekElement.onclick = function () {
                let startDate = new Date();
                startDate.setDate(data.getDate() - 7);
    
                that.interval = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo
                new type().int(that.interval)

            }
        }

        let monthElement:HTMLElement|null=document.getElementById('month')
        if(monthElement){
            monthElement.onclick = function () {
                let startDate = new Date();
                startDate.setMonth(data.getMonth() - 1);
    
                that.interval  = startDate.getFullYear()+'-'+startDate.getMonth()+'-'+startDate.getDate()+that.dateTo
                new type().int(that.interval)

            }
        }

        let yearElement:HTMLElement|null=document.getElementById('year')
        if(yearElement){
            yearElement.onclick = function () {
                that.interval  = new Date().getFullYear()-1+'-'+that.nowMonth+'-'+that.nowDay+that.dateTo
                new type().int(that.interval)

            }
        }
        let allElement:HTMLElement|null=document.getElementById('all')
        if(allElement){
            allElement.onclick = function () {
                new type().int('1999-01-01&dateTo=2300-09-13')
                

            }
        }
        let intervalElement:HTMLElement|null=document.getElementById('interval')
        if(intervalElement){
            intervalElement.onclick = function () {
                let dateFrom = (document.getElementById('dateFrom') as HTMLInputElement).value
                let dateTo = (document.getElementById('dateTo')as HTMLInputElement).value
                that.interval = dateFrom+'&dateTo='+dateTo
                new type().int(that.interval)

            }
        }


        
    }
}
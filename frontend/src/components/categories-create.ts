import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs"

import{CategoriesResponseType} from "../types/categories-response.type"

export class CategoriesCreate{
    private page:'ernings'|'comsuption'
    private title:HTMLElement|null =document.getElementById('content-title')
    private create:HTMLElement|null  = document.getElementById('create')
    private input = document.getElementsByTagName('input')
    constructor(page:'ernings'|'comsuption'){
        this.page = page

        if(this.page ==='ernings'){
            this.erningCreate()
           
        }else {
           this.comCreate()
        }
        
        let that = this 
            this.input[0].onchange=function(){
                that.validateForm(); 
            }
        
    }

   private validateForm():void{
        if(!this.create){return}
        if(this.input[0].value){
            this.create.removeAttribute('disabled')
        }
    }

   private cancel(type:string):void{
        let cancelElement:HTMLElement|null = document.getElementById('cancel')
        if(cancelElement){
            cancelElement.onclick = function () {
                document.getElementById('form')
                location.href = '#/'+ type
            }
        }
    }

  private  erningCreate():void{
        if(!this.title){return}
        let that = this
        this.title.innerText = 'Создание категории доходов'
        this.cancel('ernings')
        if(this.create){
            this.create.onclick= function(){
                that.createCategory('income','#/ernings')
                
            }
        }
        

    }

   private comCreate():void{
        if(!this.title){return}
        let that = this
        this.title.innerText = 'Создание категории расходов'
        this.cancel('comsuption')
        if(this.create){
            this.create.onclick= function(){
                that.createCategory('expense','#/comsuption')
                
            }
        }
       
    }

   private async createCategory(type:string, page:string):Promise<void>{
        try{

            const result:CategoriesResponseType[] = await CustomHttp.request(configs.host+'/categories/'+type, 'POST',{
                title: this.input[0].value,
            })
                
            if(result){

            location.href=page
            }
        }catch(e){
            console.log(e)
        }
    }
}
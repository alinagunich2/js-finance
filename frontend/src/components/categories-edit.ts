import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs"
import { UrlManager } from "../utills/utills";

import{QueryParamsType} from"../types/query-params.type"
import{CategoriesResponseType} from "../types/categories-response.type"


export class CategoriesEdit{
    private page:'ernings'|'comsuption'
    private routeParams:QueryParamsType = UrlManager.getQueryParams()

    private title:HTMLElement|null  =document.getElementById('content-title')
    private create:HTMLElement|null  = document.getElementById('create')
    private input = document.getElementsByTagName('input')[0]
    
    constructor(page:'ernings'|'comsuption'){
        this.page = page
        this.input.value = this.routeParams.type

        if(this.page ==='ernings'){
            this.erningEdit()
           
        }else {
           this.comEdit()
        }
        

        let that = this 
            this.input.onchange=function(){
                that.validateForm(); 
            }
    }
   
   private cancel(type:string):void{
        let censelElement = document.getElementById('cancel')
        if(censelElement){
            censelElement.onclick = function () {
                document.getElementById('form')
                location.href = '#/'+ type
            }
        }
        
    }
  private  validateForm():void{
        if(this.input.value){
            if(!this.create){return}
            this.create.removeAttribute('disabled')
        }
    }
   private erningEdit():void{
        if(!this.title){return}
        let that = this
        this.title.innerText = 'Редактирование категории доходов'
        this.cancel('ernings')
        if(this.create){
            this.create.onclick= function(){
                that.editData('income','#/ernings')
               
            }
        }

    }
   private comEdit():void{
        if(!this.title){return}
        let that = this
        this.title.innerText = 'Редактирование категории расходов'
        this.cancel('comsuption')
        if(this.create){
            this.create.onclick= function(){
                that.editData('expense','#/comsuption')
            }
        }
    }

   private async editData(type:string,page:string):Promise<void>{
        try{
            const result:CategoriesResponseType = await CustomHttp.request(configs.host+'/categories/'+type+'/'+this.routeParams.id,'PUT',{
                title: this.input.value,
             })

             if(result){
                 location.href=page
             }

         }catch(e){
              console.log(e)
    }
}

}
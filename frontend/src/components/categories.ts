import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs"
import { Popap } from "../utills/popap";

import{CategoriesResponseType} from "../types/categories-response.type"
import{LogoutResponse}from "../types/logout-response.type"
export class Categories{

    private title =document.getElementById('content-title')
    private page:'ernings'|'comsuption';
    private categories:CategoriesResponseType[]|null;
    private idDelite:any;

    constructor(page:'ernings'|'comsuption'){
        this.page = page
        this.categories = null
        this.idDelite = null
        if(this.title){
            if(this.page ==='ernings'){
                this.title.innerText = 'Доходы'
                this.int('income')
               
            }else {
                this.title.innerText = 'Расходы'
                this.int('expense')
    
            }
        }

    }
   private async int(type:string):Promise<void>{
        try{

            const result:CategoriesResponseType[] = await CustomHttp.request(configs.host+'/categories/'+type)
                
            if(result){

                this.categories=result
                this.showCategories()
                this.deleteItm()

            }
        }catch(e){
            console.log(e)
        }
    }

  private  showCategories():void{
        if(!this.categories){return}
        const result = document.getElementById('cards')
        let content = '' 

        this.categories.forEach((itm)=>{
            content +=`
            <div class="cardd col-5 rounded-4" id='value="${itm.id}'>
                <div class="cards-title">${itm.title}</div>
                    <div class="d-flex">
                    <a href='#/${this.page ==='ernings'?'edit-categ-ernings':'edit-categ-com'}?id=${itm.id}&type=${itm.title}' type='button' class="button-edit btn btn-primary me-2" id='edit'>Редактировать</a>
                    <button type='button' class="button-delete btn btn-danger delete" value="${itm.id}">Удалить</button>
                </div>
            </div>
            `
         })

         content +=`
            <a href='#/${this.page ==='ernings'?'create-categ-ernings':'create-categ-com'}' class="cardd col-5 rounded-4" id='create'>
                <div>
                <img src="img/ernings-comsumption/+.svg" alt="+" >
                </div>
            </a>
            `
            if(result){
                result.innerHTML = content
            }
        
    }

   private async delete(type:string,itm:number):Promise<void>{
        try{

            const result:LogoutResponse = await CustomHttp.request(configs.host+'/categories/'+type+'/'+itm, 'DELETE')
                
            if(result){
                if(result.error){
                    throw new Error(result.message)
                }
            this.int(type)
            }
        }catch(e){
            console.log(e)
        }
    }
   private deleteItm():void{
        let that = this
     
        var deleteElms =  document.getElementsByClassName('delete');
        for(var i=0;i<deleteElms.length;i++){
            deleteElms[i].addEventListener('click', function(e){
                if(e.target){
                    that.idDelite = (e.target as HTMLElement).getAttribute('value')
                    console.log(that.idDelite)
                    that.popapShow()
                }
            })
        } 
    }
   private popapShow():void{
        Popap.popapText('Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.', 'Да, удалить', 'Не удалять')
        Popap.popapHidden()

        let that = this
        let popapElement = document.getElementById('popap-btn-f')
        if(popapElement){
            popapElement.onclick = function () {
                (document.getElementById('popap') as HTMLElement).style.display='none'
    
                if(that.page ==='ernings'){
                    that.delete('income',that.idDelite)               
                }else{
                    that.delete('expense',that.idDelite)    
                }
                
            }
        }
        
    }
}
import { CustomHttp } from "../services/custon-http";
import { UrlManager } from "../utills/utills";
import configs from "../../config/configs"

import {CategoriesResponseType} from "../types/categories-response.type"


export class Creation {
    private page:'create-ern'|'create-com'|'edit-ernings'|'edit-comsumption';

    private routeParams = UrlManager.getQueryParams();

    private categories:CategoriesResponseType[]|null;
    private categor:any;

    private input:any= document.getElementsByTagName('input')
    private itmType:HTMLCollectionOf<Element>|null = document.getElementsByClassName('dropdown-item')
    private create:HTMLElement|null = document.getElementById('create')
    private id:string
    
    constructor(page:'create-ern'|'create-com'|'edit-ernings'|'edit-comsumption'){
        this.page=page;
        this.categories =null
        this.categor = null
        this.id = document.location.href.split('=')[1]

        
        if(this.page === 'create-ern'){
            this.createErn()
        }else if (this.page === 'create-com'){
            this.createCom()
        }else if(this.page === 'edit-ernings'){
            this.editErn()
            this.showEdit()
        }else{
            this.editCom()
            this.showEdit()
        }
        this.cancel()

        let that = this
        if(this.input){
            for(let i = 0;i<this.input.length;i++){
                this.input[i].onchange=function(){
                    that.validateForm(); 
                }
            }
        }
       
      
    }
   

  private  createErn():void{
        
        this.showTitle('Создание дохода', 'доход')
        this.itmTyp('income')
        let that = this
    
        if(this.create){
            this.create.onclick = function () {
                that.savingData(that.saveCategor(that.input[1].value),'income','/operations','POST')
            }
        }
    }
   private createCom():void{
        this.showTitle('Создание расхода','расход')
        this.itmTyp('expense')
        let that = this
        if(this.create){
            this.create.onclick = function () {
                that.savingData(that.saveCategor(that.input[1].value),'expense','/operations','POST')
            }
        }
       
    }
  private  async itmTyp(data:string):Promise<void>{
        try{

            const result:CategoriesResponseType[] = await CustomHttp.request(configs.host+'/categories/'+data)
                
            if(result){
               
                this.categories = result
                
                if(this.categories){
                    this.searchType()
                }
            }
        }catch(e){
            console.log(e)
        }
    }
   private showTitle(text:string, type:any ):void{
        let input:any = this.input[0]
        (document.getElementById('content-title') as HTMLElement).innerText = text 
        input.value = type 
        input.setAttribute('disabled', 'disabled')
    }
   private cancel():void{
        (document.getElementById('cancel')as HTMLElement).onclick = function () {
            document.getElementById('form')
            location.href = '#/main-ernings-comsumption'
        }
    }
   private searchType():void{
        let that:any =this

        
        const result:HTMLElement|null = document.getElementById('dropdown-menu')
        let content = '' 
        if(this.categories){
            this.categories.forEach((itm)=>{
                content +=`<li><div class="dropdown-item" id='${itm.id}'>${itm.title}</div></li>`
        })
        }
      if(result){
        result.innerHTML = content
      }
       
      if(this.itmType){
        for(let i = 0; i<this.itmType.length;i++){
            (this.itmType[i] as HTMLElement).onclick = function () {
                that.input[1].value = that.itmType[i].textContent
            }
        }
      }

        
    }
   private validateForm():void{
        let that =this

        let y = false
        for(let i = 0;i<this.input.length-1;i++){
            if(!that.input[i].value){
                y = false
                return
            }else{
                y = true
            }
        }
        if(y === true){
            if( this.create){
                this.create.removeAttribute('disabled')
            }
        }
        

    }
   private async savingData(id:any,type:string,url:string,metod:string):Promise<void>{
        try{
            const result = await CustomHttp.request(configs.host+url,metod,{
                type: type,
                amount: this.input[2].value,
                date: this.input[3].value,
                comment: this.input[4].value ===true?this.input[4].value:' ',
                category_id:  Number(id)
             })

             if(result){
                 location.href='#/main-ernings-comsumption'
             }

         }catch(e){
              console.log(e)
    }


}



 private  async showEdit():Promise<void>{
   
        let id = this.routeParams.id

        try{
            const result:CategoriesResponseType = await CustomHttp.request(configs.host+'/operations/'+id, 'GET')
                
            if(result){
               
                this.categor = result
                this.input[1].value = this.categor.category
                this.input[2].value = this.categor.amount 
                this.input[3].value = this.categor.date
                this.input[4].value = this.categor.comment
                console.log(this.categor)
            }
        }catch(e){
            console.log(e)
        }
        console.log(id)
    }
   
   private saveCategor(type:string):any{     
        let idcategor=null
        if(this.categories){
            for(let i = 0;i<this.categories.length;i++){
                if(this.categories[i].title===type){
                    idcategor= this.categories[i].id
                    break
                }
            }
        }
        return idcategor
    }
   private editErn():void{
      
        let that = this
        this.showTitle('Редактирование дохода', 'доход')
        this.itmTyp('income')
    if(this.create){
        this.create.onclick = function () {
            that.savingData(that.saveCategor(that.input[1].value),'income','/operations/'+that.id,'PUT')
        }
    }
        
    }
  private  editCom():void{
        let that = this
        this.showTitle('Редактирование расхода','расход')
        this.itmTyp('expense')
        if(this.create){
            this.create.onclick = function () {
                that.savingData(that.saveCategor(that.input[1].value),'expense','/operations/'+that.id,'PUT')
            }
        }
       
    }
 
}
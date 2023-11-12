import {Auth} from "../services/auth"
import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs"

import { FormFieldType } from "../types/form-field.type";
import { SignupResponseType } from "../types/signup-response.type";
import { LoginResponseType } from "../types/login-response.type";


export  class Form  {

    private page:'signup'|'login';
    private processElement:HTMLElement|null;
    private fields:FormFieldType[]

    constructor(page:'signup'|'login'){
        this.page=page;
        this.processElement= null;
    
        const accessToken:string|null = localStorage.getItem(Auth.accessTokenKey)
    
        this.fields =[
            {
                name:'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            }, 
            {
                name:'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }, 
        ];
        
        if(this.page==='signup'){
            this.fields.unshift(
                {
                    name:"fullname",
                    id: 'fullname',
                    element: null,
                    regex: /^([А-Я][а-я]*\s+)+[А-Я][а-я]*\s*$/,
                    valid: false,
                },
                {
                    name:'rep-password',
                    id:'rep-password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                },
            )
        }

        const that:Form = this;

            this.fields.forEach((itm:FormFieldType)=>{
                itm.element = document.getElementById(itm.id) as HTMLInputElement
                if( itm.element){
                    itm.element.onchange=function(){
                        that.validateField.call(that, itm,<HTMLInputElement> this); 
                    }
                }
            })
            
            this.processElement = document.getElementById('process')
            if( this.processElement){
                this.processElement.onclick=function(){
                    that.processForm()
                }
            }
    
   
    }
   private validateField(field:FormFieldType,element:HTMLInputElement):void{
        if(!element.value || !element.value.match(field.regex)){ 
            element.style.borderColor = 'red'
            field.valid=false
        }else{
            element.removeAttribute('style')
            field.valid=true
        }
        if(this.page==='signup'){
            const repPassword = document.getElementById('rep-password')  as HTMLInputElement
            let password = document.getElementById('password') as HTMLInputElement

            if( this.processElement){
                if(password.value === repPassword.value){
                    this.processElement.removeAttribute('disabled')
                    repPassword.removeAttribute('style')
                }else{
                    repPassword.style.borderColor = 'red'
                    this.processElement.setAttribute('disabled', 'disabled')
                    return
                }
            }
            
        }
        this.validateForm()
    }
   private validateForm():boolean{
        const validForm:boolean = this.fields.every(itm => itm.valid)
        if(this.processElement){
            if(validForm){
                this.processElement.removeAttribute('disabled')
            }else{
                this.processElement.setAttribute('disabled', 'disabled')
            }
        }
        return validForm
    }
    
private async processForm():Promise<void>{
    if(this.validateForm()){
        const email = this.fields.find(itm=>itm.name==='email')?.element?.value
        const password = this.fields.find(itm=>itm.name==='password')?.element?.value
        if(this.page === 'signup'){
            try{

                const result:SignupResponseType = await CustomHttp.request(configs.host+'/signup', "POST", {
                        name: this.fields.find(itm => itm.name === 'fullname')?.element?.value.split(' ')[1],
                        lastName: this.fields.find(itm => itm.name === 'fullname')?.element?.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat:this.fields.find(itm => itm.name === 'rep-password')?.element?.value,
                    })
                    
                if(result){
                    if(!result.user || result.error){
                        throw new Error(result.message)
                    }
                }
            }catch(e){
              console.log(e)
              return
            }
            
                }
                    try{

                        const result:LoginResponseType = await CustomHttp.request(configs.host+'/login', "POST", {
                                email: email,
                                password: password,
                                rememberMe: false,
                            })
                            
                        if(result){
                            if(!result.tokens.accessToken || !result.tokens.refreshToken 
                                ||!result.user.name || !result.user.lastName || !result.user.id){
                                throw new Error(result.message)
                            }
                            
                            Auth.setTokens(result.tokens.accessToken,result.tokens.refreshToken)
                            
                            Auth.setUserInfo({
                                name: result.user.name,
                                lastName: result.user.lastName,
                                userId: result.user.id,
                            })
                            location.href = '#/main'
                        }
                    }catch(e){
                        console.log(e)
                    }
             }
    }
}


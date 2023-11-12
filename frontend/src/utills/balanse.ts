import { CustomHttp } from "../services/custon-http";
import configs from "../../config/configs"

import{BalansType}from"../types/balans.type"

export class Balance{
    private data:BalansType|null
    constructor(){
        this.data = null
        this.bal()
    }

   public async bal():Promise<void>{
        try{
  
            const result:BalansType = await CustomHttp.request(configs.host+'/balance')
                
            if(result){
                
  
                this.data = result
                let sumBalansElement = document.getElementById('sum-balans')
                if(sumBalansElement){
                    sumBalansElement.innerText = this.data.balance+'$'
                }
                
            }
        }catch(e){
            console.log(e)
        }
    }
}
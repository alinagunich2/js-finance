
import {Auth} from "./auth"

export class CustomHttp{
   public static async request(url:string, method:string ='GET', body:object|null = null):Promise<any>{

        // const params:RequestInit = {
        //             method:method,
        //             headers:{
        //                 'Content-type':'application/json',
        //                 'Accept':'application/json'
        //             },
        //         }
        let params:RequestInit

                let token: string | null = localStorage.getItem(Auth.accessTokenKey)
                if(token){
                    // params.headers['x-auth-token']=token
                     params= {
                        method:method,
                        headers:{
                            'Content-type':'application/json',
                            'Accept':'application/json',
                            'x-auth-token':token   
                        }
                    }
                }else{
                     params={
                        method:method,
                        headers:{
                            'Content-type':'application/json',
                            'Accept':'application/json'
                        },
                    }
                }

                if (body){
                    params.body = JSON.stringify(body)
                }
                
                const response:Response = await fetch(url, params)
    
                if(response.status < 200 || response.status >= 300){
                    if(response.status === 401){
                       const result:boolean =await Auth.processUnathorizedResponse()
                       if(result){
                        return await this.request(url,method,body)
                       }else{
                        return null
                       }
                    }
                    throw new Error(response.statusText)
                }

                return await response.json()
    }
}
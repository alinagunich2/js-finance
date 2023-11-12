import configs from "../../config/configs"


import {UserInfoType} from "../types/user-info.type"
import {RefreshResponse} from "../types/refresh-response.type"
import {LogoutResponse} from "../types/logout-response.type"


export class Auth{
   public static accessTokenKey:string='accessToken'
   private static refreshTokenKey:string='refreshToken'
   private static userInfoKey:string='userInfo'

   public static async processUnathorizedResponse():Promise<boolean>{
        const refreshToken:string|null = localStorage.getItem(this.refreshTokenKey)

        if(refreshToken){
            const response:Response=await fetch(configs.host+'/refresh',{ //Response это все ответы от сервера
                method:"POST",
                headers:{
                    'Content-type':'application/json',
                    'Accept':'application/json'
                },
                body:JSON.stringify({refreshToken:refreshToken})
            })
            if(response&&response.status===200){
                const result:RefreshResponse|null = await response.json()

                if(result){
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken)
                    return true
                }
            }
        }

        this.removeTokens()
        location.href='#/'
        return false
    }
   public static async logout():Promise<boolean>{
        const refreshToken:string|null  = localStorage.getItem(this.refreshTokenKey)

        if(refreshToken){
            const response:Response=await fetch(configs.host+'/logout',{
                method:"POST",
                headers:{
                    'Content-type':'application/json',
                    'Accept':'application/json'
                },
                body:JSON.stringify({refreshToken:refreshToken})
            })
            if(response&&response.status===200){
                const result:LogoutResponse|null = await response.json()

                if(result && !result.error){
                    Auth.removeTokens()
                    localStorage.removeItem(this.userInfoKey)
                    return true
                }
            }
        }
        return false
    }

   public static setTokens(accessToken:string,refreshToken:string):void{
        localStorage.setItem(this.accessTokenKey,accessToken)
        localStorage.setItem(this.refreshTokenKey,refreshToken)
    }

   private static removeTokens():void{
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
    }

    public static setUserInfo(info:UserInfoType):void{
        localStorage.setItem(this.userInfoKey,JSON.stringify(info))
    }

   public static getUserInfo():UserInfoType|null{
        const userInfo:string | null = localStorage.getItem(this.userInfoKey)
        if(userInfo){
            return JSON.parse(userInfo)
        }

        return null
    }
}
import {Form} from './components/form'
import {Main} from './components/main'
import {MainErnings} from './components/main-ernings-comsumption'
import { Creation } from "./components/creation";
import { Sidebar } from "./components/sidebar";
import { Categories } from "./components/categories";
import { CategoriesCreate } from "./components/categories-create";
import { CategoriesEdit } from "./components/categories-edit";
import {Auth} from "./services/auth"



import {RouteType} from "./types/route.types"
import {UserInfoType} from "./types/user-info.type"


export class Router{
    private boxElement:HTMLElement | null;
    private stylesElement:HTMLElement | null;
    private titleElement:HTMLElement | null;
    private userTitleElement:HTMLElement | null;
    private userElement:HTMLElement | null;
 
    private routes:RouteType[]

    static id = null
    constructor(){
        this.boxElement=document.getElementById('box')
        this.stylesElement=document.getElementById('styles')
        this.titleElement=document.getElementById('page-title')
        this.userTitleElement = document.getElementById('user-title')
        this.userElement = document.getElementById('user')
     
        this.routes=[
             {
                route: '#/',
                title:'Вход',
                template:'template/login.html',
                styles:'styles/login.css',
                load:()=>{
                    new Form('login')
                }
             },
             {
                route: '#/signup',
                title:'Создайте аккаунт',
                template:'template/signup.html',
                styles:'styles/signup.css',
                load:()=>{
                    new Form('signup')
                }
             },
             {
                route: '#/main',
                title:'Главная',
                template:'template/main.html',
                styles:'styles/main-ernings-comsumption.css',
                load:()=>{
                    new Sidebar('.tabs'),
                    new Main()
                }
             },
             {
                route: '#/main-ernings-comsumption',
                title:'Доходы-Расходы',
                template:'template/main-ernings-comsumption.html',
                styles:'styles/main-ernings-comsumption.css',
                load:()=>{
                    new MainErnings(),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/creation-ernings',
                title:'Создание доходов',
                template:'template/creation.html',
                styles:'styles/creation.css',
                load:()=>{
                    new Creation('create-ern'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/creation-comsumption',
                title:'Создание расходов',
                template:'template/creation.html',
                styles:'styles/creation.css',
                load:()=>{
                    new Creation('create-com'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/edit-ernings',
                title:'Редактирование доходов',
                template:'template/creation.html',
                styles:'styles/creation.css',
                load:()=>{
                    new Creation('edit-ernings'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/edit-comsumption',
                title:'Редактирование расходов',
                template:'template/creation.html',
                styles:'styles/creation.css',
                load:()=>{
                    new Creation('edit-comsumption'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/ernings',
                title:'Катехории доходов',
                template:'template/ernings-comsumption.html',
                styles:'styles/ernings-comsumption.css',
                load:()=>{
                    new Categories('ernings'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/comsuption',
                title:'Категории расходов',
                template:'template/ernings-comsumption.html',
                styles:'styles/ernings-comsumption.css',
                load:()=>{
                    new Categories('comsuption'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/create-categ-ernings',
                title:'Создание категории доходов',
                template:'template/category-use.html',
                styles:'',
                load:()=>{
                    new CategoriesCreate('ernings'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/create-categ-com',
                title:'Создание категории расходов',
                template:'template/category-use.html',
                styles:'',
                load:()=>{
                    new CategoriesCreate('comsuption'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/edit-categ-ernings',
                title:'Редактирование категории доходов',
                template:'template/category-use.html',
                styles:'',
                load:()=>{
                    new CategoriesEdit('ernings'),
                    new Sidebar('.tabs')
                }
             },
             {
                route: '#/edit-categ-com',
                title:'Редактирование категории расходов',
                template:'template/category-use.html',
                styles:'',
                load:()=>{
                    new CategoriesEdit('comsuption'),
                    new Sidebar('.tabs')
                }
             },

        ]
    }
   public async openRoute():Promise<void>{
        const urlRoute:string = window.location.hash.split('?')[0]

        if(urlRoute==='#/logout'){
           const result:boolean =  await Auth.logout()
           if(result){
            window.location.href='#/'
            return
           }
        }

        const newRoute:RouteType|undefined = this.routes.find(item=>{
            return item.route === urlRoute
        })
        
        if(!newRoute){
            window.location.href='#/'
            return
        }
        if(!this.boxElement||!this.stylesElement||!this.titleElement||
            !this.userElement||!this.userTitleElement){
                if(urlRoute==='#/logout'){
                    return
                }else{
                    window.location.href='#/'
                    return
                }
        }
        this.boxElement.innerHTML = await fetch(newRoute.template).then(response=>response.text())
        this.stylesElement.setAttribute('href',newRoute.styles)
        this.titleElement.innerText = newRoute.title

        const userInfo:UserInfoType|null = Auth.getUserInfo()
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey)

        if(userInfo&&accessToken){
            this.userElement.style.display = 'flex'
            this.userTitleElement.innerText = userInfo.name + ' '+userInfo.lastName
        }else{
            this.userElement.style.display = 'none'
        }

        newRoute.load()
    }
}
import { Balance } from "../utills/balanse";
export class Sidebar {
  private ern: any;
  private com:any;
  private _config:any; //    this._config = Object.assign(defaultConfig, config);
  private _elTabs: any;
  private _elButtons: any;
  private _elPanes :any;
  private _eventShow:any;
    constructor(target:string) {  //constructor(target, config) {

      let balance = new Balance().bal()


      this.ern = document.getElementById('ern')
      this.com = document.getElementById('com')
      

      const defaultConfig = {};
      this._config = Object.assign(defaultConfig); //    this._config = Object.assign(defaultConfig, config);
      this._elTabs = typeof target === 'string' ? document.querySelector(target) : target;
      this._elButtons = this._elTabs.querySelectorAll('.tabs__btn');
      this._elPanes = this._elTabs.querySelectorAll('.tabs__pane');
      this._eventShow = new Event('tab.itc.change');
      this._init();
      this._events();

      this.openMain();
      this.openMainSek();
      this.openErn();
      this.openCom();
    }
    _init() {
      this._elTabs.setAttribute('role', 'tablist');
      this._elButtons.forEach((el:any, index:number) => {
        el.dataset.index = index;
        el.setAttribute('role', 'tab');
        this._elPanes[index].setAttribute('role', 'tabpanel');
      });
    }
    show(elLinkTarget:any) {
      const elPaneTarget = this._elPanes[elLinkTarget.dataset.index];
      const elLinkActive = this._elTabs.querySelector('.tabs__btn_active');
      const elPaneShow = this._elTabs.querySelector('.tabs__pane_show');
      if (elLinkTarget === elLinkActive) {
        return;
      }
      elLinkActive ? elLinkActive.classList.remove('tabs__btn_active') : null;
      elPaneShow ? elPaneShow.classList.remove('tabs__pane_show') : null;
      elLinkTarget.classList.add('tabs__btn_active');
      elPaneTarget.classList.add('tabs__pane_show');
      this._elTabs.dispatchEvent(this._eventShow);
      elLinkTarget.focus();
    }
    showByIndex(index:number) {
      const elLinkTarget = this._elButtons[index];
      elLinkTarget ? this.show(elLinkTarget) : null;
    };
    _events() {
      this._elTabs.addEventListener('click', (e:any) => {
        const target = e.target.closest('.tabs__btn');
        if (target) {
          e.preventDefault();
          this.show(target);
        }
      });
    }



   private openMain():void{
      let mainElement:HTMLElement|null = document.getElementById('main')
      if(mainElement){
        mainElement.onclick = function(){
          location.href = '#/main'
      }
      }
    };
   private openMainSek():void{
      let mainSekElement:HTMLElement|null = document.getElementById('main-sek')
      if(mainSekElement){
        mainSekElement.onclick = function(){
          location.href = '#/main-ernings-comsumption'
      }
      }
        
    };
   private openErn():void{
      let that = this
      let categoryElement:HTMLElement|null  = document.getElementById('category')
      if(categoryElement){
        categoryElement.onclick = function(){
          that.com.classList.remove('activ-comsumotion')
          that.ern.classList.add('activ-comsumotion')
            location.href = '#/ernings'
        }
      }
      let ernElement:HTMLElement|null  =  document.getElementById('ern')
      if(ernElement){
        ernElement.onclick = function(){
          that.com.classList.remove('activ-comsumotion')
        that.ern.classList.add('activ-comsumotion')
            location.href = '#/ernings'
        }
      }
     
    };
   private openCom():void{
      let that = this
      let comElement =  document.getElementById('com')
      if(comElement){
        comElement.onclick = function(){
          that.com.classList.add('activ-comsumotion')
          that.ern.classList.remove('activ-comsumotion')
          location.href = '#/comsuption'
      }
      }
      
    };



    
   
  }




import { Balance } from "../utills/balanse";

export class Sidebar {
  
  private mainMenuElement: NodeListOf<Element> =document.querySelectorAll('.main-menu') 

constructor(){

  this.openMenu()
}

private openMenu(){
  new Balance()

  let that:Sidebar = this
  let menuCatiElement:NodeListOf<Element> =document.querySelectorAll('.main-menu-cati') 

  this.mainMenuElement.forEach((itm)=>{
    itm.addEventListener('click', function(this:HTMLElement){
      that.mainMenuElement.forEach((btn)=>{
        btn.classList.remove('activ-comsumotion')
      });
      this.classList.add('activ-comsumotion')
      let tabsPane:HTMLElement|null = document.getElementById('tabs__pane')

      if(tabsPane){
        if(this.classList.contains('category')){
          tabsPane.classList.add('tabs__pane-show')
          menuCatiElement[1].classList.remove('activ-ernings');
    menuCatiElement[0].classList.add('active-comsumotion')
      }else{
          tabsPane.classList.remove('tabs__pane-show')
          menuCatiElement[1].classList.add('activ-ernings');
    menuCatiElement[0].classList.remove('active-comsumotion')
      }
      }
      
    })
  });


  (menuCatiElement[1] as HTMLElement).onclick = function(){
    menuCatiElement[1].classList.add('activ-ernings');
    menuCatiElement[0].classList.remove('active-comsumotion')
  };
  (menuCatiElement[0] as HTMLElement).onclick = function(){
    menuCatiElement[1].classList.remove('activ-ernings');
    menuCatiElement[0].classList.add('active-comsumotion')
  }
}


    
   
  }




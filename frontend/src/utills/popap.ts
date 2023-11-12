export class Popap{
    constructor(){
        
    }
    static popap:HTMLElement|null =  document.getElementById('popap')
        static btn1:HTMLElement|null = document.getElementById('popap-btn-f')
        static btn2:HTMLElement|null = document.getElementById('popap-btn-s')

    static popapText(text:string, btn1:string, btn2:string){
        if( this.popap&&this.btn1&&this.btn2){
        this.popap.style.display='block';
        (document.getElementById('popap-text') as HTMLElement).innerText = text;
        this.btn1.innerText = btn1;
        this.btn2.innerText = btn2;
        }
    }
    static popapHidden(){
        let that = this
        if(this.btn2){
        this.btn2.onclick = function () {
            if(that.popap){
                that.popap.style.display='none';
            }
        }
    }
    }
}
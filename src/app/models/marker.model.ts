import { Icon } from './icon.model';
import { isNull } from 'util';

export class Marker {
    icon : Icon;
    
    constructor(public lat: number, public lng: number, public label?: string) 
    {
        if(isNull(this.label))
        {
            this.icon =  new Icon ('./assets/img/question-mark-32.ico' , 24);
            this.label = "";
            return;
        }
        if(this.label.includes("Gasolio"))
        {
            this.icon = new Icon ('./assets/img/warning-22-32.ico' , 24);
            this.label = "";
            return;
        }
        if (this.label.includes("Gas")) {
            this.icon = new Icon ( './assets/img/gas.ico', 24 );
            this.label = "";
            return;
            //console.log(this.icon);
        }
        if(this.label.includes("elettrica"))
        {
            this.icon =  new Icon ( './assets/img/electricity.ico', 24 );
            this.label = "";
            return;
        }
        if(this.label.includes("solide"))
        {
            this.icon = new Icon ( './assets/img/tree-50-32.ico', 24);
             this.label = "";
             return;
        }
        if(this.label.includes("Olio"))
        {
            this.icon = new Icon (  './assets/img/water-32.ico', 24 );
             this.label = "";
             return;
        }
        if(this.label.includes("Teleriscaldamento"))
        {
            this.icon = new Icon ( './assets/img/power-32.ico', 24 );
             this.label = "";
             return;
        }
        if(this.label.includes("RSU"))
        {
            this.icon = new Icon ('./assets/img/trash-9-32.ico', 24);
             this.label = "";
             return;
        }
        if(this.label.includes("liquide"))
        {
            this.icon = new Icon ('./assets/img/toxic-32.ico', 24 );
             this.label = "";
             return;
        }
       
        if(this.label.includes("GPL"))
        {
            this.icon = new Icon ('./assets/img/gas-pump-32.ico', 24 );
             this.label = "";
             return;
        }
        
    }

    changeIconSize(size)
    {
        this.icon.setSize(size);
    }


   



}

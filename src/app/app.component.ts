import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { Marker } from './models/marker.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ci_vettore } from './models/ci_vett.model';
import { MouseEvent } from '@agm/core'; //Importare

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 12;
  geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  markers: Marker[] = [];  //Vettore con tutti i marker
  obsGeoData: Observable<GeoFeatureCollection>;
  obsCiVett : Observable<Ci_vettore[]>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;

  circleLat : number = 0; //Latitudiene e longitudine iniziale del cerchio 
  circleLng: number = 0;
  
  maxRadius: number = 400; //Voglio evitare raggi troppo grossi

  radius : number = this.maxRadius;

  constructor(public http: HttpClient) {
  
  }

  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    console.log(this.geoJsonObject)

    /*for (let feature of this.geoJsonObject.features) {
      let lng = feature.geometry.coordinates[0][0][0];
      let lat = feature.geometry.coordinates[0][0][1];
      let id = String(this.geoJsonObject.features[0].properties.id);
      let marker: Marker = new Marker(lat, lng, id);
      this.markers.push(marker);
    }*/
  }

  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    let latTot = 0; //Uso queste due variabili per calcolare latitudine e longitudine media
    let lngTot = 0; //E centrare la mappa
    
    console.log(data);
    this.markers = [];
    
    for (const iterator of data) {
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      latTot += m.lat; //Sommo tutte le latitutidini e longitudini
      lngTot += m.lng;
      this.markers.push(m);
    }
    this.lng = lngTot/data.length; //divido per la dimensione del vettore
    this.lat = latTot/data.length;
    this.zoom = 16;
  }

  ngOnInit() {
    this.obsGeoData = this.http.get<GeoFeatureCollection>("http://localhost:3000");
    this.obsGeoData.subscribe(this.prepareData);
  }

  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value;
    this.obsCiVett = this.http.get<Ci_vettore[]>(`http://localhost:3000/ci_vettore/${val}`);
    this.obsCiVett.subscribe(this.prepareCiVettData);
    console.log(val);
    return false;
  }


  //import { MouseEvent } from '@agm/core'; <--da importare
  mapClicked($event: MouseEvent) {
    this.circleLat = $event.coords.lat;
    this.circleLng = $event.coords.lng;
    this.lat = this.circleLat;
    this.lng = this.circleLng;
    this.zoom = 16;
  }


  circleRedim(newRadius : number){
    console.log(newRadius)
    this.radius = newRadius;
  }

  circleDoubleClicked(circleCenter)
  {
    console.log(circleCenter); //Voglio ottenere solo i valori entro questo cerchio
    console.log(this.radius);
    this.circleLat = circleCenter.coords.lat;
    this.circleLng = circleCenter.coords.lng;
    if(this.radius > this.maxRadius)
    {
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
      this.radius = this.maxRadius;      
    }

    let raggioInGradi = (this.radius * 0.00001)/1.1132;

    //Posso riusare lo stesso observable e lo stesso metodo di gestione del metodo cambiaFoglio
    //poichè riceverò lo stesso tipo di dati
    //Divido l'url andando a capo per questioni di leggibilità non perchè sia necessario
    this.obsCiVett = this.http.get<Ci_vettore[]>(`http://localhost:3000/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`);
    this.obsCiVett.subscribe(this.prepareCiVettData);

    //console.log ("raggio in gradi " + (this.radius * 0.00001)/1.1132)
    
    //Voglio spedire al server una richiesta che mi ritorni tutte le abitazioni all'interno del cerchio

  }

 

  styleFunc = (feature) => {
    /*console.log(feature.i.id)
    let newColor = "#FF0000"; //RED
    if (feature.i.id == 0) newColor = "#00FF00"; //GREEN
    else newColor = "#0000FF"; //BLUE*/

    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }
  

}


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

  loading: boolean = false;
  radius : number = this.maxRadius;

  serverUrl : string = "http://localhost:3000"; //Proprietà per modificare una volta sola l'url del server

  constructor(public http: HttpClient) {
  
  }

  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data
    //console.log(this.geoJsonObject);
    this.loading = false;
  }

  prepareCiVettData = (data: Ci_vettore[]) =>
  {
    let latTot = 0; //Uso queste due variabili per calcolare latitudine e longitudine media
    let lngTot = 0; //E centrare la mappa
    //console.log(data);
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
    //this.obsGeoData = this.http.get<GeoFeatureCollection>("http://localhost:3000");
    //this.obsGeoData.subscribe(this.prepareData);
  }

  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value;
    this.obsCiVett = this.http.get<Ci_vettore[]>(`${this.serverUrl}/ci_vettore/${val}`);
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


    const urlciVett = `${this.serverUrl}/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`;

    const urlGeoGeom = `${this.serverUrl}/geogeom/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`;
    //Posso riusare lo stesso observable e lo stesso metodo di gestione del metodo cambiaFoglio
    //poichè riceverò lo stesso tipo di dati
    //Divido l'url andando a capo per questioni di leggibilità non perchè sia necessario
    this.obsCiVett = this.http.get<Ci_vettore[]>(urlciVett);
    this.obsCiVett.subscribe(this.prepareCiVettData);

    this.obsGeoData = this.http.get<GeoFeatureCollection>(urlGeoGeom);
    this.obsGeoData.subscribe(this.prepareData);

    //console.log ("raggio in gradi " + (this.radius * 0.00001)/1.1132)
    
    //Voglio spedire al server una richiesta che mi ritorni tutte le abitazioni all'interno del cerchio
    this.circleLat = 0;
    this.circleLng = 0;
  }

  getAllData() : Boolean
  {
    this.loading = true;
    //console.log("test");
    this.obsGeoData = this.http.get<GeoFeatureCollection>(`${this.serverUrl}/allSez`);
    this.obsGeoData.subscribe(this.prepareData);
    return false;
  }

  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.avgColorMap(feature.i.media),
      strokeWeight: 1,
      fillOpacity : 1  //Fill opacity 1 = opaco, fill opaticy 0 = trasparente 
    });
  }


  avgColorMap = (media) =>
  {
    if(media <= 36) return "#00FF00";
    if(36 < media && media <= 40) return "#33ff00";
    if(40 < media && media <= 58) return "#66ff00";
    if(58 < media && media <= 70) return "#99ff00";
    if(70 < media && media <= 84) return "#ccff00";
    if(84 < media && media <= 100) return "#FFFF00";
    if(100 < media && media <= 116) return "#FFCC00";
    if(116 < media && media <= 1032) return "#ff9900";
    if(1032 < media && media <= 1068) return "#ff6600";
    if(1068 < media && media <= 1948) return "#FF3300";
    if(1948 < media && media <= 3780) return "#FF0000";
    return "#FF0000"
  }

  avgColorMapGreen = (media) =>
  {
    if(media <= 36) return "#EBECDF";
    if(36 < media && media <= 40) return "#DADFC9";
    if(40 < media && media <= 58) return "#C5D2B4";
    if(58 < media && media <= 70) return "#ADC49F";
    if(75 < media && media <= 84) return "#93B68B";
    if(84 < media && media <= 100) return "#77A876";
    if(100 < media && media <= 116) return "#629A6C";
    if(116 < media && media <= 1032) return "#558869";
    if(1032 < media && media <= 1068) return "#487563";
    if(1068 < media && media <= 1948) return "#3B625B";
    if(1948 < media && media <= 3780) return "#2F4E4F";
    return "#003000" //Quasi nero
  }
  

}


import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';
import {GeoJson, GEOJSON, GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 8;
  geoJsonObject : GeoFeatureCollection;
  fillColor: string = "#FF0000";
  markers: marker[];
 
  lng: number = 9.02657833507687;
  lat: number = 45.512051524024308;

  constructor()
  {
    this.geoJsonObject = GEOJSON;
    console.log(this.geoJsonObject);
    console.log(this.geoJsonObject.features[0].geometry.coordinates);
  }

  ngOnInit() {
    this.markers =  [
      {
        lng: this.geoJsonObject.features[0].geometry.coordinates[0][0][0],
        lat: this.geoJsonObject.features[0].geometry.coordinates[0][0][1],
        label: String(this.geoJsonObject.features[0].properties.id),
      },
      {
        lng: this.geoJsonObject.features[1].geometry.coordinates[0][0][0],
        lat: this.geoJsonObject.features[1].geometry.coordinates[0][0][1],
        label: String(this.geoJsonObject.features[1].properties.id),
      }
    ]
  }

}


// future use 


/*constructor(public http: HttpClient)
  {
    //this.obsGeoJson = http.get<GeoJson>("https://my-json-server.typicode.com/malizia-g/fine_anno/relab_first_json");
    //this.obsGeoJson.subscribe(this.getGeoData);

  }

  getGeoData = (newData : GeoJson)=>
  {
    this.geoJsonObject = GEOJSON;
  }*/


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

public map;
public cityCircle;
markerOne = {lat: 19.115450, lng: 72.859937};
markerTwo = {lat: 19.125202, lng: 72.916682};

// Active Class Booleans
public isDevOneNear: boolean = false;
public isDevTwoNear: boolean = false;
public isDevThreeNear: boolean = false;

constructor(private ref: ChangeDetectorRef){}

ngOnInit() {
  console.log(this.isDevOneNear);
  this.drawMap();
  let markerOne = this.markerOne;
  let markerTwo = this.markerTwo;
  let map = this.map;
  let devCircleOne = this.drawDevCir(this.markerOne, map);
  let devCircleTwo = this.drawDevCir(this.markerTwo, map);
  let markerMoved = this.markerMoved;
  let setActClass = this.setActiveClass;

  // let image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
  let image = './assets/images/DD.png';
  let devMarkerOne = this.drawMarker(this.markerOne, map, image);
  let devMarkerTwo = this.drawMarker(this.markerTwo, map, image);    
  
  google.maps.event.addListener(devMarkerOne, 'dragend', (evt) => {
    markerOne = { lat: evt.latLng.lat(), lng: evt.latLng.lng() };
    let abc = markerMoved(evt, devCircleOne, markerOne, markerTwo);
    setActClass(abc);
  });

  google.maps.event.addListener(devMarkerTwo, 'dragend', (evt) => {
    markerTwo = { lat: evt.latLng.lat(), lng: evt.latLng.lng() };
    let abc = markerMoved(evt, devCircleTwo, markerTwo, markerOne);
    setActClass(abc);
  });
}

drawMap(){
  this.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 19.118, lng: 72.890},
    mapTypeId: 'terrain'
  });
}

drawDevCir(latlng, map){
return new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      center: latlng,
      radius: 1000
    });
}

drawMarker(place, map, image){
  return new google.maps.Marker({
    position: place,
    map: map,
    draggable: true,
    icon: image
  });
}

markerMoved(evt, cityCircle, oldLoc, otherLoc){
  let loc1 = new google.maps.LatLng(otherLoc.lat, otherLoc.lng);
  let loc2 = new google.maps.LatLng(evt.latLng.lat(),evt.latLng.lng());
  console.log('Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3));
  console.log(google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2));
  let dist = google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2)
  cityCircle.setCenter({lat: evt.latLng.lat(), lng: evt.latLng.lng()});
  if(dist < 2000){
    return true;
  } else {
    return false;
  }
  
}

setActiveClass = (value) => {
  this.isDevOneNear = value;
  this.isDevTwoNear = value;
  this.ref.detectChanges();
}

}



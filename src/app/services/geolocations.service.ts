import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
declare var google;

@Injectable({
  providedIn: 'root'
})
export class GeolocationsService {

  constructor(private geolocation: Geolocation,) { }

  getCoordsForGeoAddress(address, _default = true) {

    var self = this;
    return new Promise(resolve => {
      var self = this;
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {


            var loc = results[0].geometry.location
            var lat = loc.lat();
            var lng = loc.lng();
            resolve({ lat: lat, lng: lng })

          } else {
            resolve(null);
          }
        } else {
          console.log({results, status})
          resolve(null)
        }
      });
    })

  }

  getCoordsViaHTML5Navigator() {

    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(pos)

        }, function () {
          resolve({ lat: 51.5074, lng: 0.1278 });
        });
      } else {
        // Browser doesn't support Geolocation
        resolve({ lat: 51.5074, lng: 0.1278 });
      }
    })


  }

  getCurrentLocationCoordinates(){
    return new Promise( async resolve => {
      let coords = await this.geolocation.getCurrentPosition();

      var lt = coords.coords.latitude
      var lg = coords.coords.longitude

      resolve({lat: lt, lng: lg});
    })

  }

  

}

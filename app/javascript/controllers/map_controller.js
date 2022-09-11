import { Controller } from "@hotwired/stimulus"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    let map_style = "mapbox://styles/mapbox/streets-v10"

    if (document.getElementsByClassName("mapstyle_white").length === 1) {
      map_style = "mapbox://styles/mapbox/light-v10"
    }

    this.map = new mapboxgl.Map({
      container: this.element,
      style: map_style
    })

    // this.map.style = "mapbox://styles/mapbox/light-v10";
    this.#addMarkersToMap()
    this.#fitMapToMarkers()
    this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
                                            mapboxgl: mapboxgl }))
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      if (marker.filter_cards){
        const filter = new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat])
        .addTo(this.map);
        // filtering the marker with city_id
        filter.getElement().addEventListener('click', () => {
          this.showHideCards(marker)
        });
      }
      else if(marker.info_window) {
        const popup = new mapboxgl.Popup().setHTML(marker.info_window)
        new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(this.map)
      } else {
        new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .addTo(this.map)
      }
    });
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }

  showHideCards(marker) {
    // console.log(marker)
    let elements = document.getElementsByClassName("hide_city");
    for (let element of elements) {
      element.style.display = "none";
    }

    elements = document.getElementsByClassName("cityid_" + marker.city);
    for (let e of elements) {
      e.style.display = "block";
    }
  }
}

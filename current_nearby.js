// Created by Richard (and j o y)
function get_places(map, api_key) {
    var northLat = map.getBounds().getNorthEast().lat();
    var eastLng = map.getBounds().getNorthEast().lng();
    var southLat = map.getBounds().getSouthWest().lat();
    var westLng = map.getBounds().getSouthWest().lng();

    var viewport = new google.maps.LatLngBounds(
        new google.maps.LatLng(southLat, westLng), // SW
        new google.maps.LatLng(northLat, eastLng)  // NE
    );

    var request = {
        location: viewport
        type: 'point_of_interest'
    };

    // var Httpreq = new XMLHttpRequest(); // a new request
    // Httpreq.open("GET", url, false);
    // Httpreq.send(null);
    // return JSON.parse(Httpreq.responseText);
}
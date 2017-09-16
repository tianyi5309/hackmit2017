// To use this function, places must be an array of objects with the following properties:
// Properties 
// position : google.maps.LatLng object
// image_url : string, should be the url to the string
// other_info : Javascript object, contains all other info that you might need
function add_image_markers(places, map) {
  places.forEach(function(place) {
    console.log(place);
    var marker = new google.maps.Marker({
      position: place.position,
      icon: place.image_url,
      map: map
    });
  });
}

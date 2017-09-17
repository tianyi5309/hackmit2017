var lngMarginStandardize = function(lngMargin) {
  return (lngMargin < 0)? 360 + lngMargin : lngMargin;
};

var centerLngStandardize = function(centerLng) {
  if (centerLng < -180) {
    while (centerLng < -180) {
      centerLng += 360;
    }
  } else if (centerLng > 180) {
    while (centerLng > 180) {
      centerLng -= 360;
    }
  }
  return centerLng;
};

var getViewAreaRadius = function(m) {
  // get Latitude and Longitude for view block center
  var centerLat = m.getCenter().lat();
  var centerLng = centerLngStandardize(m.getCenter().lng());
  // console.log(centerLat, centerLng);
  
  // get for view bloc boundry
  var viewBlockBounds = m.getBounds();
  var neLat = viewBlockBounds.getNorthEast().lat();
  // var neLng = viewBlockBounds.getNorthEast().lng();
  var swLat = viewBlockBounds.getSouthWest().lat();
  var swLng = viewBlockBounds.getSouthWest().lng();

  // when in the south pole, down small up big
  // when in the north pole, down big up small
  var downMargin = centerLat - swLat;
  var upMargin = neLat - centerLat;

  // left and right are the same, but be careful for the negative values
  var marginLeft = lngMarginStandardize(centerLng-swLng)
  // var marginRight = lngMarginStandardize(neLng-centerLng);
  // console.log(marginLeft, downMargin, upMargin);

  return getViewHoriKm(centerLat, marginLeft);
  // return Math.max(marginLeft, Math.max(downMargin, upMargin));
};

var getViewHoriKm = function(centerLat, marginLeft) {
  return Math.cos(centerLat * (Math.PI / 180)) * 40075 * marginLeft * 2 / 360;
};

// function randBm() {
//     var u = Math.random(), v = Math.random();
//     while(u === 0) u = Math.random();
//     while(v === 0) v = Math.random();
//     return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
// }

var getLatRan = function(l, u) {
  return Math.random() * (u - l) + l;
  // return randBm() * (u - l) + l;
};

var getLngRan = function(l, u) {
  if (l > 0 && u < 0) {
    var r = Math.random()
    // console.log(r, (180-l+u+180)/(180-l));
    if (r > (180-l)/(180-l+u+180)) {
      return getLngRan(-180, u);
    } else {
      return getLngRan(l, 180);
    }
  }
  return Math.random() * (u - l) + l;
};

var getCenterList = function(m, num) {
  var centerList = [[m.getCenter().lat(), centerLngStandardize(m.getCenter().lng())]];

  var viewBlockBounds = m.getBounds();
  var neLat = viewBlockBounds.getNorthEast().lat();
  var neLng = viewBlockBounds.getNorthEast().lng();
  var swLat = viewBlockBounds.getSouthWest().lat();
  var swLng = viewBlockBounds.getSouthWest().lng();
  for (var i = 0; i < num; i++) {
    centerList.push([getLatRan(swLat, neLat), getLngRan(swLng, neLng)]);
  }
  return centerList;
};

var getJSON = function(url) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", url, false);
  Httpreq.send(null);
  return JSON.parse(Httpreq.responseText);
}

var getPlaceList = function(centerLat, centerLng) {
  // console.log(centerLat, centerLng);
  url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
  url += "location=" + centerLat + "," + centerLng;
  url += "&radius=50000&type=point_of_interest&key=AIzaSyCCVvBb0A_6MeuNwTWGoVlEVb39gzWy1sY&rankby=prominence";

  var placeList = [];
  var locList = getJSON(url)["results"];
  for (var i = 0; i < locList.length; i++) {
    placeList.push(locList[i]);
  }
  //console.log(placeList);

  return placeList;
};

var getImageUrl = function(max_width, photo_reference) {
  url = "https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyCCVvBb0A_6MeuNwTWGoVlEVb39gzWy1sY&photoreference=";
  url += photo_reference;
  url += "&maxwidth=";
  url += max_width;
  return url;
}

var getPlaceDetails = function(map, place) {
  var request = {
    placeId: place.id
  };

  service = new google.maps.places.PlacesService(map);
  place_result = service.getDetails(request, callback);
  //console.log(place_result);
  return place_result;
}

function createMarker(place, place_result, map) {
  var marker = new google.maps.Marker({
    position: place.geometry.location,
    icon: getImageUrl(70, place.photos[0].photo_reference),
    url: getImageUrl(400, place.photos[0].photo_reference),
    title: place.name,
    address: place_result[0].formatted_address,
    hours: place_result[0].opening_hours.weekday_text,
    rating: places_result[0].rating,
    map: map
  });
  return marker;
}

function addImages(places, map, markerList, numPer) {
  var BreakException = {};

  var iconCount = 0;
  try {
    places.forEach(function(place) {
      if (place.hasOwnProperty('photos')) {
        console.log(place.id);
        var request = {
          placeId: place.id
        };
        service = new google.maps.places.PlacesService(map);
        service.getDetails(request, function(place_result, status) {
          console.log(status);
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(place_result);
            markerList.push(createMarker(place, place_result, map));
            iconCount++;
            if (iconCount > numPer) {
              throw BreakException;
            }
          }
        });
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
}

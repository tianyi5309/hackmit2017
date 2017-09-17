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
  console.log(placeList);

  return placeList;
};

function addImages(places, map, markerList, numPer) {
  var BreakException = {};

  var iconCount = 0;
  url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=70&key=AIzaSyCCVvBb0A_6MeuNwTWGoVlEVb39gzWy1sY&photoreference="
  try {
    places.forEach(function(place) {
      if (place.hasOwnProperty('photos')) {
        var marker = new google.maps.Marker({
          position: place.geometry.location,
          icon: url + place.photos[0].photo_reference,
          map: map
        });
        markerList.push(marker);

        iconCount++;
        if (iconCount > numPer) {
          throw BreakException;
        }
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
}

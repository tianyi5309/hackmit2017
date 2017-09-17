// Created by Joy (09/16/2017)

function parsePhoto(photo, max_width, api_key) {
  var photo_reference = photo['photo_reference'];
  var hash = {
    'maxwidth': max_width,
    'photoreference': photo_reference,
    'key': api_key
  };
  var url = 'https://maps.googleapis.com/maps/api/place/photo?' + hashToUrlParams(hash);
  return url;
}

function parsePosition(geometry) {
  var loc = geometry['location'];
  var position = new google.maps.LatLng(loc['latitude'], loc['longitude']);
  return position;
}

function hashToUrlParams(hash) {
  var str = '';
  Object.keys(hash).forEach(function(key) { 
    str = str + key + '=' + hash[key] + '&';
  });
  return str.slice(0, -1);
}

function getImageArray(json, max_width, api_key) {
  var results = [];
  json['results'].forEach(function(addr) {
    addr['photos'].forEach(function(photo) {
      var img_info = {};
      img_info['position'] = parsePosition(addr['geometry']);
      img_info['image_url'] = parsePhoto(photo, max_width, api_key); 
      results.push(img_info);
    });
  });
  return results;
}

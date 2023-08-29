let infowindow;
let map;
let service;
let marker;

function searchMap(query) {
  const request = {
    query,
    fields: ['name', 'geometry', 'icon', 'place_id'],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
      const ZOOM_LEVEL = 18;
      map.setZoom(ZOOM_LEVEL);
      document.getElementById("placeId").value = results[0].place_id;
    }
  });
}

function initMap() {
  /* 初期位置の設定 */
  const tokyo = new google.maps.LatLng(35.5042959, 138.4505002);

  infowindow = new google.maps.InfoWindow();

  const INIT_ZOOM_LEVEL = 8;

  map = new google.maps.Map(document.getElementById('map'), {center: tokyo, zoom: INIT_ZOOM_LEVEL});

  const initWords = ["東京スカイツリー駅", "すみだ水族館", "東京ビックサイト", "蔵前橋", "東京駅"];

  const initWord = initWords[Math.floor(Math.random() * initWords.length)];

  document.getElementById("searchSpot").value = initWord;
  searchMap(initWord);
}

function searchByInputValue() {
  const query = document.getElementById("searchSpot").value;

  marker.setMap(null);

  searchMap(query);
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });


  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}

window.initMap = initMap;

window.searchByInputValue = searchByInputValue;

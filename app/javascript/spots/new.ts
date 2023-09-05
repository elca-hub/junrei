import GoogleMapsError from "../errors/GoogleMapsError";
import NoHTMLElementError from "../errors/NoHTMLElementError";
import InewWindow from "../interfaces/window/new";

declare global {
  interface Window extends InewWindow { }
}

let infowindow: google.maps.InfoWindow;
let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let marker: google.maps.Marker;

/* HTMLエレメントを取得するためのidを格納するオブジェクト */
const elementIdObj: {
  map: string,
  searchSpot: string,
  placeId: string,
} = {
  map: "map",
  searchSpot: "searchSpot",
  placeId: "placeId",
}

function searchMap(query: string) {
  const request = {
    query,
    fields: ["name", "geometry", "icon", "place_id"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      results.forEach(res => createMarker(res));

      // 一番上の検索結果を中心に表示
      const centerViewResult = results[0];

      if (centerViewResult.geometry?.location === undefined) throw new GoogleMapsError("location is undefined");

      map.setCenter(centerViewResult.geometry.location);
      const ZOOM_LEVEL = 18;
      map.setZoom(ZOOM_LEVEL);

      const placeIdEle = document.getElementById(elementIdObj.placeId) as HTMLInputElement;

      if (placeIdEle === null) throw new NoHTMLElementError(elementIdObj.placeId);

      if (centerViewResult.place_id === undefined) throw new GoogleMapsError("place_id is undefined");

      placeIdEle.value = centerViewResult.place_id;
    }
  });
}

function initMap() {
  /* 初期位置の設定 */
  const tokyo = new google.maps.LatLng(35.5042959, 138.4505002);

  infowindow = new google.maps.InfoWindow();

  const INIT_ZOOM_LEVEL = 8;

  const mapEle = document.getElementById(elementIdObj.map);

  if (mapEle === null) throw new NoHTMLElementError(elementIdObj.map);

  map = new google.maps.Map(mapEle, { center: tokyo, zoom: INIT_ZOOM_LEVEL });

  const initWords = [
    "東京スカイツリー駅",
    "すみだ水族館",
    "東京ビックサイト",
    "蔵前橋",
    "東京駅",
  ];

  const initWord = initWords[Math.floor(Math.random() * initWords.length)];

  const formTextEle = document.getElementById(elementIdObj.searchSpot) as HTMLInputElement;

  if (formTextEle === null) throw new NoHTMLElementError(elementIdObj.searchSpot);

  if (formTextEle.value === "") formTextEle.value = initWord;

  searchMap(formTextEle.value);
}

function searchByInputValue() {
  const searchSpotEle = document.getElementById(elementIdObj.searchSpot) as HTMLInputElement;

  if (searchSpotEle === null) return;

  const query = searchSpotEle.value;

  marker.setMap(null);

  searchMap(query);
}

function createMarker(place: google.maps.places.PlaceResult) {
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

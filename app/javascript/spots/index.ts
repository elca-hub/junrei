import onclickModule from "../modules/onclickModule";
import IndexController from "../core/controller/spots/indexController";
import GetDirectionUsecase from "../core/usecase/spots/index/getDirectionUsecase";
import GetDirectionPresenter from "../core/presenter/spots/getDirectionPresenter";
import GoogleMapsApi from "../core/infrastructure/api/googleMapsApi";
import innerTextModule from "../modules/innerTextModule";
import getCsrfTokenModule from "../modules/getCsrfTokenModule";
import { SpotType } from "../types/spots/index/spot";
import ChangeSpotSortUsecase from "../core/usecase/spots/index/changeSpotSortUsecase";
import ChangeSpotSortPresenter from "../core/presenter/spots/changeSpotSortPresenter";
import JunreiApi from "../core/infrastructure/api/junreiApi";
import { createErrorElement } from "../modules/createErrorElementModule";
import NoHTMLElementError from "../errors/NoHTMLElementError";

/* windowオブジェクトにgonを設定 */
declare global {
  interface Window {
    gon: {
      spots: {
          id: number;
          sort_index: number;
          place_id: string;
      }[];
      google_api: string;
      group_id: number;
    };
  }
}

const gon = window.gon;

let spots: SpotType[] = gon.spots.map((ele) => {
  return {
    id: ele.id,
    sort_index: ele.sort_index,
    place_id: ele.place_id,
  };
});

/* infrastructure */
const googleMapsFetchApi = new GoogleMapsApi(gon.google_api);
const junreiApi = new JunreiApi(getCsrfTokenModule(), gon.group_id);

/* controller */
const indexController = new IndexController(
  new GetDirectionUsecase(new GetDirectionPresenter(), googleMapsFetchApi),
  new ChangeSpotSortUsecase(new ChangeSpotSortPresenter(), junreiApi)
);

async function pushToCalcDirection(i: number, travelMode: google.maps.TravelMode) {
  await innerTextModule(
    `viewDirection${i}`,
    async () => {
      return await indexController.getDirection(
        spots[i].place_id,
        spots[i + 1].place_id,
        travelMode
      ).then((viewModel) => viewModel.getDirection())
    }
  );
}

async function changeSpotSort(i: number) {
  const res = await indexController.changeSpotSort(spots, i);

  spots = res.getSpots();

  if (res.getAlertMessage() !== null) {
    createErrorElement(res.getAlertMessage() as string);
    return;
  }

  const moveBox = document.getElementById(`spotBox${i}`);
  const targetBox = document.getElementById(`spotBox${i + 1}`);

  if (moveBox === null) throw new NoHTMLElementError(`spotBox${i}`);
  if (targetBox === null) throw new NoHTMLElementError(`spotBox${i + 1}`);

  // 移動対象の要素の左上の高さを取得
  const upperSpotTop = targetBox.getBoundingClientRect().top;
  const lowerSpotTop = moveBox.getBoundingClientRect().top;

  // 500msかけて移動
  $(targetBox).animate({ top: lowerSpotTop - upperSpotTop }, 500);
  $(moveBox).animate({ top: upperSpotTop - lowerSpotTop }, 500);
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 要素の入れ替え
  [moveBox.innerHTML, targetBox.innerHTML] = [
    targetBox.innerHTML,
    moveBox.innerHTML,
  ];

  // 位置のリセット
  $(targetBox).animate({ top: 0 }, 0);
  $(moveBox).animate({ top: 0 }, 0);

  // idの入れ替え
  [moveBox.id, targetBox.id] = [targetBox.id, moveBox.id];

  // 再計算
  pushToCalcDirection(i, google.maps.TravelMode.DRIVING);

  if (i + 1 < spots.length - 1) pushToCalcDirection(i + 1, google.maps.TravelMode.DRIVING);
  else if (i > 0) pushToCalcDirection(i - 1, google.maps.TravelMode.DRIVING);
}

async function init() {
  for (let i = 0; i < spots.length - 1; i++) {
    pushToCalcDirection(i, google.maps.TravelMode.DRIVING);

    const AchievedButtonEle = document.getElementById(`isAchievedButton${i}`);

    AchievedButtonEle?.addEventListener("click", () => {
      // switchIsAchieved(i);
    });

    onclickModule(`calcDirection-${i}-Drive`, () => { pushToCalcDirection(i, google.maps.TravelMode.DRIVING) });
    onclickModule(`calcDirection-${i}-Walk`, () => { pushToCalcDirection(i, google.maps.TravelMode.WALKING) });
    onclickModule(`calcDirection-${i}-Transit`, () => { pushToCalcDirection(i, google.maps.TravelMode.TRANSIT) });

    onclickModule(`changeSpotSort${i}`, () => { changeSpotSort(i) });
  }
}

init();

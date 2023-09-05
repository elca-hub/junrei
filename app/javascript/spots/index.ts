import OnclickModule from "../modules/onclickModule";
import { travelModeType } from "../unions/travelModeType";

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
    } | undefined;
  }
}

if (window.gon === undefined) throw new Error("gon is undefined");

const gon = window.gon;
 
const spots: {
  id: number;
  sort_index: number;
  place_id: string;
}[] = gon.spots.map((ele) => {
  return {
    id: ele.id,
    sort_index: ele.sort_index,
    place_id: ele.place_id,
  };
});

/**
 * `originPlaceId`から`destinationPlaceId`への移動時間を取得し、HTML要素に表示する。
 * @param originPlaceId 出発点のplaceId
 * @param destinationPlaceId 到着点のplaceId
 * @param travelMode 移動手段
 * @param i 移動時間を表示するためのHTML要素のidに付与する番号
 * @return {Promise<void>}
 */
async function getDirection(
  originPlaceId: string,
  destinationPlaceId: string,
  travelMode: travelModeType,
  i: number
): Promise<void> {
  const res = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": gon.google_api,
        "X-Goog-FieldMask": "routes.localized_values",
      },
      body: JSON.stringify({
        origin: {
          placeId: originPlaceId,
        },
        destination: {
          placeId: destinationPlaceId,
        },
        travelMode: travelMode,
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        languageCode: "ja",
      }),
    },
  );

  const data = await res.json();

  const viewDurationEle = document.getElementById(`viewDuration${i}`);

  if (viewDurationEle === null) return;

  viewDurationEle.innerText = data.routes
    ? data.routes[0].localizedValues.duration.text
    : "-";
}

function init() {
  for (let i = 0; i < spots.length - 1; i++) {
    getDirection(spots[i].place_id, spots[i + 1].place_id, "DRIVE", i);

    const AchievedButtonEle = document.getElementById(`isAchievedButton${i}`);

    AchievedButtonEle?.addEventListener("click", () => {
      // switchIsAchieved(i);
    });

    OnclickModule(`calcDirection-${i}-Drive`, () => { pushToCalcDirection(i, "DRIVE") });
    OnclickModule(`calcDirection-${i}-Walk`, () => { pushToCalcDirection(i, "WALK") });
    OnclickModule(`calcDirection-${i}-Transit`, () => { pushToCalcDirection(i, "TRANSIT") });

    OnclickModule(`changeSpotSort${i}`, () => { changeSpotSort(i) });
  }
}

function pushToCalcDirection(i: number, travelMode: travelModeType) {
  getDirection(spots[i].place_id, spots[i + 1].place_id, travelMode, i);
}

async function changeSpotSort(i: number) {
  if (i > spots.length - 1) {
    return;
  }

  [spots[i], spots[i + 1]] = [spots[i + 1], spots[i]];

  [spots[i].sort_index, spots[i + 1].sort_index] = [
    spots[i + 1].sort_index,
    spots[i].sort_index,
  ];

  const isSortDone = await sendSortIndex();

  if (!isSortDone) {
    [spots[i], spots[i + 1]] = [spots[i + 1], spots[i]];
    [spots[i].sort_index, spots[i + 1].sort_index] = [
      spots[i + 1].sort_index,
      spots[i].sort_index,
    ];

    return;
  }

  const moveBox = document.getElementById(`spotBox${i}`);
  const targetBox = document.getElementById(`spotBox${i + 1}`);

  if (moveBox === null || targetBox === null) return;

  // upperSpotの上の座標を取得
  const upperSpotTop = targetBox.getBoundingClientRect().top;

  // lowerSpotの左上の座標を取得
  const lowerSpotTop = moveBox.getBoundingClientRect().top;

  // jqueryでupperSpotをlowerSpotの位置まで移動
  $(targetBox).animate(
    {
      top: lowerSpotTop - upperSpotTop,
    },
    500,
  );

  // jqueryでlowerSpotをupperSpotの位置まで移動
  $(moveBox).animate(
    {
      top: upperSpotTop - lowerSpotTop,
    },
    500,
  );

  // 500ms後に実行
  await new Promise((resolve) => setTimeout(resolve, 500));

  [moveBox.innerHTML, targetBox.innerHTML] = [
    targetBox.innerHTML,
    moveBox.innerHTML,
  ];

  $(targetBox).animate(
    {
      top: 0,
    },
    0,
  );

  $(moveBox).animate(
    {
      top: 0,
    },
    0,
  );

  // idの入れ替え
  targetBox.id = `spotBox${i + 1}`;
  moveBox.id = `spotBox${i}`;

  pushToCalcDirection(i, "DRIVE");

  if (i + 1 < spots.length - 1) pushToCalcDirection(i + 1, "DRIVE");
  else if (i > 0) pushToCalcDirection(i - 1, "DRIVE");
}

async function sendSortIndex() {
  const headers: HeadersInit = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("X-CSRF-Token", getCsrfToken());

  const res = await fetch(
    `${location.origin}/groups/${gon.group_id}/update_sort`,
    {
      method: "PATCH",
      credentials: "same-origin",
      headers,
      body: JSON.stringify({ spots }),
    },
  );

  if (res.status === 200) return true;

  const data = await res.json();

  createErrorElement(data.message);

  return false;
}

function createErrorElement(message: string) {
  const ele = `
    <div class="alert alert-danger alert-dismissible fade show custom-alert" role="alert">
        <p>${message}</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
  document.body.insertAdjacentHTML("afterbegin", ele);
}

function getCsrfToken() {
  const csrfTokenMeta = document.getElementsByTagName("meta").namedItem("csrf-token");

  return csrfTokenMeta?.getAttribute("content") ??  ""; 
}

init();

import onclickModule from "../modules/onclickModule"
import IndexController from "../core/controller/spots/indexController"
import GetDurationUsecase from "../core/usecase/spots/index/getDurationUsecase"
import GetDurationPresenter from "../core/presenter/spots/getDurationPresenter"
import GoogleMapsApi from "../core/infrastructure/api/googleMapsApi"
import innerTextModule from "../modules/innerTextModule"
import getCsrfTokenModule from "../modules/getCsrfTokenModule"
import { type SpotType } from "../types/spots/index/spot"
import ChangeSpotSortUsecase from "../core/usecase/spots/index/changeSpotSortUsecase"
import ChangeSpotSortPresenter from "../core/presenter/spots/changeSpotSortPresenter"
import JunreiApi from "../core/infrastructure/api/junreiApi"
import { createErrorElement } from "../modules/createErrorElementModule"
import NoHTMLElementError from "../errors/NoHTMLElementError"
import {
  TravelModeEnum,
  type TravelModeType,
} from "../types/spots/index/travelMode"

/* windowオブジェクトにgonを設定 */
declare global {
  interface Window {
    gon: {
      spots: Array<{
        id: number
        sort_index: number
        place_id: string
      }>
      google_api: string
      group_id: number
    }
  }
}

const gon = window.gon

let spots: SpotType[] = gon.spots.map((ele) => {
  return { id: ele.id, sort_index: ele.sort_index, place_id: ele.place_id }
})

/* infrastructure */
const googleMapsFetchApi = new GoogleMapsApi(gon.google_api)
const junreiApi = new JunreiApi(getCsrfTokenModule(), gon.group_id)

/* controller */
const indexController = new IndexController(
  new GetDurationUsecase(new GetDurationPresenter(), googleMapsFetchApi),
  new ChangeSpotSortUsecase(new ChangeSpotSortPresenter(), junreiApi),
)

async function pushToCalcDuration(
  i: number,
  travelMode: TravelModeType,
): Promise<void> {
  await innerTextModule(`viewDuration${i}`, async () => {
    return await indexController
      .getDirection(spots[i].place_id, spots[i + 1].place_id, travelMode)
      .then((viewModel) => viewModel.getDuration())
  })
}

async function changeSpotSort(i: number): Promise<void> {
  const res = await indexController.changeSpotSort(spots, i)

  spots = res.getSpots()

  if (res.getAlertMessage() !== null) {
    createErrorElement(res.getAlertMessage() as string)
    return
  }

  const moveBox = document.getElementById(`spotBox${i}`)
  const targetBox = document.getElementById(`spotBox${i + 1}`)

  if (moveBox === null) throw new NoHTMLElementError(`spotBox${i}`)
  if (targetBox === null) throw new NoHTMLElementError(`spotBox${i + 1}`)

  // 移動対象の要素の左上の高さを取得
  const upperSpotTop = targetBox.getBoundingClientRect().top
  const lowerSpotTop = moveBox.getBoundingClientRect().top

  // 500msかけて移動
  const moveTime = 500
  $(targetBox).animate({ top: lowerSpotTop - upperSpotTop }, moveTime)
  $(moveBox).animate({ top: upperSpotTop - lowerSpotTop }, moveTime)
  await new Promise((resolve) => setTimeout(resolve, moveTime))

  // 要素の入れ替え
  ;[moveBox.innerHTML, targetBox.innerHTML] = [
    targetBox.innerHTML,
    moveBox.innerHTML,
  ]

  // 位置のリセット
  $(targetBox).animate({ top: 0 }, 0)
  $(moveBox).animate({ top: 0 }, 0)

  // 再計算
  await pushToCalcDuration(i, TravelModeEnum.DRIVE)

  if (i + 1 < spots.length - 1)
    await pushToCalcDuration(i + 1, TravelModeEnum.DRIVE)
  else if (i > 0) await pushToCalcDuration(i - 1, TravelModeEnum.DRIVE)
}

async function init(): Promise<void> {
  for (let i = 0; i < spots.length - 1; i++) {
    await pushToCalcDuration(i, TravelModeEnum.DRIVE)

    const AchievedButtonEle = document.getElementById(`isAchievedButton${i}`)

    AchievedButtonEle?.addEventListener("click", () => {
      // switchIsAchieved(i);
    })

    onclickModule(`calcDirection-${i}-Drive`, () => {
      void pushToCalcDuration(i, TravelModeEnum.DRIVE)
    })
    onclickModule(`calcDirection-${i}-Walk`, () => {
      void pushToCalcDuration(i, TravelModeEnum.WALK)
    })
    onclickModule(`calcDirection-${i}-Transit`, () => {
      void pushToCalcDuration(i, TravelModeEnum.TRANSIT)
    })

    onclickModule(`changeSpotSort${i}`, () => {
      void changeSpotSort(i)
    })
  }
}

void init()

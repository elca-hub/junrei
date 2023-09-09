import PlaceId from "../../../domain/placeId"
import Spot from "../../../domain/spot"
import {
  type ChangeSortSpotInput,
  ChangeSortSpotOutput,
} from "../../../dto/spots/changeSortSpotDto"
import type JunreiApi from "../../../infrastructure/api/junreiApi"
import type ChangeSpotSortPresenter from "../../../presenter/spots/changeSpotSortPresenter"
import type ChangeSpotSortViewModel from "../../../viewmodel/spots/changeSpotSortViewModel"
import { type IUsecase } from "../../IUsecase"

export default class ChangeSpotSortUsecase
  implements IUsecase<ChangeSortSpotInput, Promise<ChangeSpotSortViewModel>>
{
  private readonly presenter: ChangeSpotSortPresenter
  private readonly junreiApi: JunreiApi

  constructor(presenter: ChangeSpotSortPresenter, junreiApi: JunreiApi) {
    this.presenter = presenter
    this.junreiApi = junreiApi
  }

  public async execute(
    input: ChangeSortSpotInput,
  ): Promise<ChangeSpotSortViewModel> {
    const inputSpots = input.getSpots()
    const index = input.getIndex()

    const spots = inputSpots.map(
      (spot) => new Spot(spot.id, spot.sort_index, new PlaceId(spot.place_id)),
    )

    // ロールバック用
    const rollback = spots

    if (index > inputSpots.length - 1)
      return this.presenter.fail(
        new ChangeSortSpotOutput(spots, "エラーが発生しました。"),
      )
    ;[spots[index], spots[index + 1]] = [spots[index + 1], spots[index]]

    const temp = spots[index].getSortIndex()
    spots[index].changeSortIndex(spots[index + 1].getSortIndex())
    spots[index + 1].changeSortIndex(temp)

    const apiRes = await this.junreiApi.sendSortIndex(spots)
    const statusCode = apiRes.status

    const successStatusCode = 200

    if (statusCode === successStatusCode)
      return this.presenter.complete(new ChangeSortSpotOutput(spots, null))

    return this.presenter.fail(
      new ChangeSortSpotOutput(
        rollback,
        apiRes.message ?? "サーバーエラーが発生しました。",
      ),
    )
  }
}

import { type SpotType } from "../../../types/spots/index/spot"
import { type TravelModeType } from "../../../types/spots/index/travelMode"
import { ChangeSortSpotInput } from "../../dto/spots/changeSortSpotDto"
import { GetDurationInput } from "../../dto/spots/getDurationDto"
import type ChangeSpotSortUsecase from "../../usecase/spots/index/changeSpotSortUsecase"
import type GetDurationUsecase from "../../usecase/spots/index/getDurationUsecase"
import type ChangeSpotSortViewModel from "../../viewmodel/spots/changeSpotSortViewModel"
import type GetDurationViewModel from "../../viewmodel/spots/getDurationViewModel"

export default class IndexController {
  private readonly getDurationUsecase: GetDurationUsecase
  private readonly changeSortSpotUsecase: ChangeSpotSortUsecase

  constructor(
    getDurationUsecase: GetDurationUsecase,
    changeSortSpotUsecase: ChangeSpotSortUsecase,
  ) {
    this.getDurationUsecase = getDurationUsecase
    this.changeSortSpotUsecase = changeSortSpotUsecase
  }

  /**
   * travelModeに応じた、出発点から到着点までの所要時間を取得する
   * 
   * @param originPlaceId 出発点のplaceId
   * @param destinationPlaceId 到着点のplaceId
   * @param travelMode 公共交通機関の種類
   * @returns 
   */
  public async getDirection(
    originPlaceId: string,
    destinationPlaceId: string,
    travelMode: TravelModeType,
  ): Promise<GetDurationViewModel> {
    const input = new GetDurationInput(
      originPlaceId,
      destinationPlaceId,
      travelMode,
    )

    return await this.getDurationUsecase.execute(input)
  }

  /**
   * indexとindex + 1のスポットの順番を入れ替える
   * 
   * @param spots スポット全体の配列
   * @param index 変更対象のスポットのインデックス
   * @returns 
   */
  public async changeSpotSort(
    spots: SpotType[],
    index: number,
  ): Promise<ChangeSpotSortViewModel> {
    const input = new ChangeSortSpotInput(spots, index)

    return await this.changeSortSpotUsecase.execute(input)
  }
}

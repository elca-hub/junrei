import { type SpotType } from "../../../types/spots/index/spot"
import { type TravelModeType } from "../../../types/spots/index/travelMode"
import { ChangeSortSpotInput } from "../../dto/spots/changeSortSpotDto"
import { getDurationInput as GetDurationInput } from "../../dto/spots/getDurationDto"
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

  public async changeSpotSort(
    spots: SpotType[],
    index: number,
  ): Promise<ChangeSpotSortViewModel> {
    const input = new ChangeSortSpotInput(spots, index)

    return await this.changeSortSpotUsecase.execute(input)
  }
}

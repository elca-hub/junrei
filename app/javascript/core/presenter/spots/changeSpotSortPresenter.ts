import { type SpotType } from "../../../types/spots/index/spot"
import { type ChangeSortSpotOutput } from "../../dto/spots/changeSortSpotDto"
import ChangeSpotSortViewModel from "../../viewmodel/spots/changeSpotSortViewModel"

export default class ChangeSpotSortPresenter {
  public complete(output: ChangeSortSpotOutput): ChangeSpotSortViewModel {
    const spots = output.getSpots()

    const spotType: SpotType[] = spots.map((spot) => {
      return {
        id: spot.getId(),
        sort_index: spot.getSortIndex(),
        place_id: spot.getPlaceId().getPlaceId(),
      }
    })

    return new ChangeSpotSortViewModel(spotType)
  }

  public fail(output: ChangeSortSpotOutput): ChangeSpotSortViewModel {
    const spots = output.getSpots()

    const spotType: SpotType[] = spots.map((spot) => {
      return {
        id: spot.getId(),
        sort_index: spot.getSortIndex(),
        place_id: spot.getPlaceId().getPlaceId(),
      }
    })
    return new ChangeSpotSortViewModel(spotType, output.getAlertMessage())
  }
}

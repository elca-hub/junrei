import PlaceId from "../../../domain/placeId"
import TravelMode from "../../../domain/travelMode"
import {
  type GetDurationInput,
  GetDurationOutput,
} from "../../../dto/spots/getDurationDto"
import type GoogleMaps from "../../../infrastructure/api/googleMapsApi"
import type GetDurationPresenter from "../../../presenter/spots/getDurationPresenter"
import type GetDurationViewModel from "../../../viewmodel/spots/getDurationViewModel"
import { type IUsecase } from "../../IUsecase"

export default class GetDurationUsecase
  implements IUsecase<GetDurationInput, Promise<GetDurationViewModel>>
{
  private readonly googleMapsApi: GoogleMaps
  private readonly getDurationPresenter: GetDurationPresenter

  constructor(
    getDurationPresenter: GetDurationPresenter,
    googleMapsApi: GoogleMaps,
  ) {
    this.googleMapsApi = googleMapsApi
    this.getDurationPresenter = getDurationPresenter
  }

  public async execute(input: GetDurationInput): Promise<GetDurationViewModel> {
    const duration = await this.googleMapsApi.getDuration(
      new PlaceId(input.getOriginPlaceId()),
      new PlaceId(input.getDestinationPlaceId()),
      new TravelMode(input.getTravelMode()),
    )
    return this.getDurationPresenter.complete(new GetDurationOutput(duration))
  }
}

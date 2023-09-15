import PlaceId from "../../../domain/placeId"
import Spot from "../../../domain/spot"
import {
  SwitchIsAchievedOutput,
  type SwitchIsAchievedInput,
} from "../../../dto/spots/switchIsAchievedDto"
import type JunreiApi from "../../../infrastructure/api/junreiApi"
import type SwitchIsAchievedPresenter from "../../../presenter/spots/switchIsAchievedPresenter"
import type SwitchIsAchievedViewModel from "../../../viewmodel/spots/switchIsAchievedViewModel"
import { type IUsecase } from "../../IUsecase"

export default class SwitchIsAchievedUsecase
  implements
    IUsecase<SwitchIsAchievedInput, Promise<SwitchIsAchievedViewModel>>
{
  private readonly junreiApi: JunreiApi
  private readonly switchIsAchievedPresenter: SwitchIsAchievedPresenter

  constructor(
    switchIsAchievedPresenter: SwitchIsAchievedPresenter,
    junreiApi: JunreiApi,
  ) {
    this.junreiApi = junreiApi

    this.switchIsAchievedPresenter = switchIsAchievedPresenter
  }

  public async execute(
    input: SwitchIsAchievedInput,
  ): Promise<SwitchIsAchievedViewModel> {
    const spot = new Spot(
      input.getSpot().id,
      input.getSpot().sort_index,
      new PlaceId(input.getSpot().place_id),
    )

    const apiData = await this.junreiApi.sendIsAchieved(spot)

    const successStatusCode = 200

    if (apiData.status !== successStatusCode)
      return this.switchIsAchievedPresenter.fail(
        new SwitchIsAchievedOutput(apiData.message),
      )
    else return this.switchIsAchievedPresenter.complete()
  }
}

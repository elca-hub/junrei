import { type GetDurationOutput } from "../../dto/spots/getDurationDto"
import GetDurationViewModel from "../../viewmodel/spots/getDurationViewModel"

export default class GetDurationPresenter {
  public complete(output: GetDurationOutput): GetDurationViewModel {
    const duration = output.getDuration()

    return new GetDurationViewModel(duration)
  }
}

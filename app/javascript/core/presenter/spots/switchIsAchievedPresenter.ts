import { type SwitchIsAchievedOutput } from "../../dto/spots/switchIsAchievedDto"
import SwitchIsAchievedViewModel from "../../viewmodel/spots/switchIsAchievedViewModel"

export default class SwitchIsAchievedPresenter {
  public complete(): SwitchIsAchievedViewModel {
    return new SwitchIsAchievedViewModel(null)
  }

  public fail(output: SwitchIsAchievedOutput): SwitchIsAchievedViewModel {
    const alertMessage = output.getAlertMessage()

    return new SwitchIsAchievedViewModel(alertMessage)
  }
}

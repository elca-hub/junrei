import { getDirectionOutput } from "../../dto/spots/getDirectionDto";
import GetDirectionViewModel from "../../viewmodel/spots/getDirectionViewModel";

export default class GetDirectionPresenter {
    public complete(output: getDirectionOutput): GetDirectionViewModel {
        const direction = output.getDuration();

        return new GetDirectionViewModel(direction);
    }
}

import { SpotType } from "../../../types/spots/index/spot";
import { changeSortSpotInput } from "../../dto/spots/changeSortSpotDto";
import { getDirectionInput } from "../../dto/spots/getDirectionDto";
import ChangeSpotSortUsecase from "../../usecase/spots/index/changeSpotSortUsecase";
import GetDirectionUsecase from "../../usecase/spots/index/getDirectionUsecase";
import ChangeSpotSortViewModel from "../../viewmodel/spots/changeSpotSortViewModel";
import GetDirectionViewModel from "../../viewmodel/spots/getDirectionViewModel";

export default class IndexController {
    private readonly getDirectionUsecase: GetDirectionUsecase;
    private readonly changeSortSpotUsecase: ChangeSpotSortUsecase;

    constructor(
        getDirectionUsecase: GetDirectionUsecase,
        changeSortSpotUsecase: ChangeSpotSortUsecase
    ) {
        this.getDirectionUsecase = getDirectionUsecase;
        this.changeSortSpotUsecase = changeSortSpotUsecase;
    }

    public async getDirection(
        originPlaceId: string,
        destinationPlaceId: string,
        travelMode: google.maps.TravelMode
    ): Promise<GetDirectionViewModel> {
        const input = new getDirectionInput(originPlaceId, destinationPlaceId, travelMode);

        return await this.getDirectionUsecase.execute(input);
    }

    public async changeSpotSort(
        spots: SpotType[],
        index: number
    ): Promise<ChangeSpotSortViewModel> {
        const input = new changeSortSpotInput(spots, index);

        return await this.changeSortSpotUsecase.execute(input);
    }
}

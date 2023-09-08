import { SpotType } from "../../../types/spots/index/spot";
import { TravelModeType } from "../../../types/spots/index/travelMode";
import { changeSortSpotInput } from "../../dto/spots/changeSortSpotDto";
import { getDurationInput } from "../../dto/spots/getDurationDto";
import ChangeSpotSortUsecase from "../../usecase/spots/index/changeSpotSortUsecase";
import getDurationUsecase from "../../usecase/spots/index/getDurationUsecase";
import ChangeSpotSortViewModel from "../../viewmodel/spots/changeSpotSortViewModel";
import GetDurationViewModel from "../../viewmodel/spots/getDurationViewModel";

export default class IndexController {
    private readonly getDurationUsecase: getDurationUsecase;
    private readonly changeSortSpotUsecase: ChangeSpotSortUsecase;

    constructor(
        getDurationUsecase: getDurationUsecase,
        changeSortSpotUsecase: ChangeSpotSortUsecase
    ) {
        this.getDurationUsecase = getDurationUsecase;
        this.changeSortSpotUsecase = changeSortSpotUsecase;
    }

    public async getDirection(
        originPlaceId: string,
        destinationPlaceId: string,
        travelMode: TravelModeType
    ): Promise<GetDurationViewModel> {
        const input = new getDurationInput(originPlaceId, destinationPlaceId, travelMode);

        return await this.getDurationUsecase.execute(input);
    }

    public async changeSpotSort(
        spots: SpotType[],
        index: number
    ): Promise<ChangeSpotSortViewModel> {
        const input = new changeSortSpotInput(spots, index);

        return await this.changeSortSpotUsecase.execute(input);
    }
}

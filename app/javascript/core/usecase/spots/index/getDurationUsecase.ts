import PlaceId from "../../../domain/placeId";
import TravelMode from "../../../domain/travelMode";
import { getDurationInput, getDurationOutput } from "../../../dto/spots/getDurationDto";
import GoogleMaps from "../../../infrastructure/api/googleMapsApi";
import GetDurationPresenter from "../../../presenter/spots/getDurationPresenter";
import GetDurationViewModel from "../../../viewmodel/spots/getDurationViewModel";
import { IUsecase } from "../../IUsecase";

export default class getDurationUsecase implements IUsecase<getDurationInput, Promise<GetDurationViewModel>> {
    private readonly googleMapsApi: GoogleMaps;
    private readonly getDurationPresenter: GetDurationPresenter;

    constructor(getDurationPresenter: GetDurationPresenter, googleMapsApi: GoogleMaps) {
        this.googleMapsApi = googleMapsApi;
        this.getDurationPresenter = getDurationPresenter;
    }

    public async execute(input: getDurationInput): Promise<GetDurationViewModel> {
        const duration = await this.googleMapsApi.getDuration(
            new PlaceId(input.getOriginPlaceId()),
            new PlaceId(input.getDestinationPlaceId()),
            new TravelMode(input.getTravelMode()),
        );
        return this.getDurationPresenter.complete(new getDurationOutput(duration));
    }
}

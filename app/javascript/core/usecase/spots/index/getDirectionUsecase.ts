import PlaceId from "../../../domain/placeId";
import TravelMode from "../../../domain/travelMode";
import { getDirectionInput, getDirectionOutput } from "../../../dto/spots/getDirectionDto";
import GoogleMaps from "../../../infrastructure/api/googleMapsApi";
import GetDirectionPresenter from "../../../presenter/spots/getDirectionPresenter";
import GetDirectionViewModel from "../../../viewmodel/spots/getDirectionViewModel";
import { IUsecase } from "../../IUsecase";

export default class GetDirectionUsecase implements IUsecase<getDirectionInput, Promise<GetDirectionViewModel>> {
    private readonly googleMapsApi: GoogleMaps;
    private readonly getDirectionPresenter: GetDirectionPresenter;

    constructor(getDirectionPresenter: GetDirectionPresenter, googleMapsApi: GoogleMaps) {
        this.googleMapsApi = googleMapsApi;
        this.getDirectionPresenter = getDirectionPresenter;
    }

    public async execute(input: getDirectionInput): Promise<GetDirectionViewModel> {
        const direction = await this.googleMapsApi.getDuration(
            new PlaceId(input.getOriginPlaceId()),
            new PlaceId(input.getDestinationPlaceId()),
            new TravelMode(input.getTravelMode()),
        );
        return this.getDirectionPresenter.complete(new getDirectionOutput(direction));
    }
}

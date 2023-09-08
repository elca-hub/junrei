import { SpotType } from "../../../types/spots/index/spot";

export default class ChangeSpotSortViewModel {
    private readonly alertMessage: string | null;
    private readonly spots: SpotType[];

    constructor(spots: SpotType[], alertMessage: string | null = null) {
        this.spots = spots;
        this.alertMessage = alertMessage;
    }

    public getSpots(): SpotType[] { return this.spots; }

    public getAlertMessage(): string | null { return this.alertMessage; }
}

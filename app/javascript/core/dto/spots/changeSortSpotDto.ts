import { SpotType } from "../../../types/spots/index/spot";
import Spot from "../../domain/spot";

export class changeSortSpotInput {
    private readonly spots: SpotType[];
    private readonly index: number;

    constructor(spots: SpotType[], index: number) {
        this.spots = spots;
        this.index = index;
    }

    public getSpots(): SpotType[] { return this.spots; }

    public getIndex(): number { return this.index; }
}

export class changeSortSpotOutput {
    private readonly spots: Spot[];
    private readonly alertMessage: string | null;

    constructor(spots: Spot[], alertMessage: string | null) {
        this.spots = spots;
        this.alertMessage = alertMessage;
    }

    public getSpots(): Spot[] { return this.spots; }

    public getAlertMessage(): string | null { return this.alertMessage; }
}

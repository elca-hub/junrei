import { type SpotType } from "../../../types/spots/index/spot";

export class SwitchIsAchievedInput {
    private readonly spot: SpotType;

    constructor(spot: SpotType) {
        this.spot = spot;
    }

    public getSpot(): SpotType {
        return this.spot;
    }
}

export class SwitchIsAchievedOutput {
    private readonly alertMessage: string | null;

    constructor(alertMessage: string | null) {
        this.alertMessage = alertMessage;
    }

    public getAlertMessage(): string | null {
        return this.alertMessage;
    }
}

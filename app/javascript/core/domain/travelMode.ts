type domainTravelModeType = 'DRIVE' | 'WALK' | 'TRANSIT';

export default class TravelMode {
    private readonly travelMode: domainTravelModeType;

    constructor(travelMode: domainTravelModeType) {
        this.travelMode = travelMode;
    }

    public getTravelMode(): domainTravelModeType {
        return this.travelMode;
    }
}

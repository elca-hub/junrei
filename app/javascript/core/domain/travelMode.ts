export default class TravelMode {
    private readonly travelMode: google.maps.TravelMode;

    constructor(travelMode: google.maps.TravelMode) {
        this.travelMode = travelMode;
    }

    public getTravelMode(): google.maps.TravelMode {
        return this.travelMode;
    }
}

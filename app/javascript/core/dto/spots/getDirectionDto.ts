export class getDirectionInput {
    private readonly originPlaceId: string;
    private readonly destinationPlaceId: string;
    private readonly travelMode: google.maps.TravelMode;

    constructor(
        originPlaceId: string,
        destinationPlaceId: string,
        travelMode: google.maps.TravelMode
    ) {
        this.originPlaceId = originPlaceId;
        this.destinationPlaceId = destinationPlaceId;
        this.travelMode = travelMode;
    }

    public getOriginPlaceId(): string { return this.originPlaceId; }

    public getDestinationPlaceId(): string { return this.destinationPlaceId; }

    public getTravelMode(): google.maps.TravelMode { return this.travelMode; }
}

export class getDirectionOutput {
    private readonly duration: string;

    constructor(duration: string) {
        this.duration = duration;
    }

    public getDuration(): string { return this.duration; }
}

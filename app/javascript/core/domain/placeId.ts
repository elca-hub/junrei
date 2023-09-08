export default class PlaceId {
    private readonly placeId: string;

    constructor(placeId: string) {
        this.placeId = placeId;
    }

    public getPlaceId(): string {
        return this.placeId;
    }
}

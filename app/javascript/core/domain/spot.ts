import PlaceId from "./placeId";

export default class Spot {
    private readonly id: number;
    private sortIndex: number;
    private readonly placeId: PlaceId;

    constructor(id: number, sortIndex: number, placeId: PlaceId) {
        this.id = id;
        this.sortIndex = sortIndex;
        this.placeId = placeId;
    }

    public getId(): number { return this.id; }

    public getSortIndex(): number { return this.sortIndex; }

    public getPlaceId(): PlaceId { return this.placeId; }

    public changeSortIndex(sortIndex: number): void {
        this.sortIndex = sortIndex;
    }
}

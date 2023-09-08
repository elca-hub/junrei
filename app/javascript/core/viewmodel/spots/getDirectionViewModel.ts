export default class GetDirectionViewModel {
    private readonly direction: string;

    constructor(direction: string) {
        this.direction = direction;
    }

    public getDirection(): string { return this.direction; }
}

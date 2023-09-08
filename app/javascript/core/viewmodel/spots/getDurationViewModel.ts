export default class GetDurationViewModel {
    private readonly duration: string;

    constructor(duration: string) {
        this.duration = duration;
    }

    public getDuration(): string { return this.duration; }
}

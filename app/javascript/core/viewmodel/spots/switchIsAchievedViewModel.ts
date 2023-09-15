export default class SwitchIsAchievedViewModel {
    private readonly alertMessage: string | null;

    constructor(alertMessage: string | null) {
        this.alertMessage = alertMessage;
    }

    public getAlertMessage(): string | null {
        return this.alertMessage;
    }
}

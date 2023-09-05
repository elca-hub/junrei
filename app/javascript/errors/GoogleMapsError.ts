export default class GoogleMapsError extends Error {
    constructor(message: string) {
        super(`Google Maps error: ${message}`);
    }
}
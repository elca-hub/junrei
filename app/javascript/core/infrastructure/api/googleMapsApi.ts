import type PlaceId from "../../domain/placeId"
import type TravelMode from "../../domain/travelMode"

export default class GoogleMapsApi {
  private readonly googleMapsApiKey: string

  constructor(googleMapsApiKey: string) {
    this.googleMapsApiKey = googleMapsApiKey
  }

  public async getDuration(
    originPlaceId: PlaceId,
    destinationPlaceId: PlaceId,
    travelMode: TravelMode,
  ): Promise<string> {
    const res = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": this.googleMapsApiKey,
          "X-Goog-FieldMask": "routes.localized_values",
        },
        body: JSON.stringify({
          origin: { placeId: originPlaceId.getPlaceId() },
          destination: { placeId: destinationPlaceId.getPlaceId() },
          travelMode: travelMode.getTravelMode(),
          computeAlternativeRoutes: false,
          routeModifiers: {
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
          },
          languageCode: "ja",
        }),
      },
    )
    const data = await res.json()

    if (data.routes === undefined) throw new Error("routes is undefined")

    if (data.routes.length === 0) throw new Error("routes is empty")

    return data.routes[0].localizedValues.duration.text as string
  }
}

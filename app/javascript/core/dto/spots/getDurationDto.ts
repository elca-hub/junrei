import { type TravelModeType } from "../../../types/spots/index/travelMode"

export class GetDurationInput {
  private readonly originPlaceId: string
  private readonly destinationPlaceId: string
  private readonly travelMode: TravelModeType

  constructor(
    originPlaceId: string,
    destinationPlaceId: string,
    travelMode: TravelModeType,
  ) {
    this.originPlaceId = originPlaceId
    this.destinationPlaceId = destinationPlaceId
    this.travelMode = travelMode
  }

  public getOriginPlaceId(): string {
    return this.originPlaceId
  }

  public getDestinationPlaceId(): string {
    return this.destinationPlaceId
  }

  public getTravelMode(): TravelModeType {
    return this.travelMode
  }
}

export class GetDurationOutput {
  private readonly duration: string

  constructor(duration: string) {
    this.duration = duration
  }

  public getDuration(): string {
    return this.duration
  }
}

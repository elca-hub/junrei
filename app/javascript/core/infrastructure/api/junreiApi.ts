import Spot from "../../domain/spot";

export default class JunreiApi {
    private readonly csrfToken: string;
    private readonly groupId: number;

    constructor(csrfToken: string, groupId: number) {
        this.csrfToken = csrfToken;
        this.groupId = groupId;
    }

    public async sendSortIndex(spots: Spot[]): Promise<{status: number, message: string | null}> {
        const headers: HeadersInit = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("X-CSRF-Token", this.csrfToken);

        const sendSpots: {id: number, sort_index: number}[] = spots.map((spot) => {
            return {id: spot.getId(), sort_index: spot.getSortIndex()};
        });

        const res = await fetch(
          `${location.origin}/groups/${this.groupId}/update_sort`,
          {
            method: "PATCH",
            credentials: "same-origin",
            headers,
            body: JSON.stringify({ spots: sendSpots }),
          },
        );

        if (res.status === 200) {
            return {status: res.status, message: null};
        } else {
            const errorMessage = await res.json();

            return {status: res.status, message: errorMessage.message};
        }
    }
}

import Spot from "../../domain/spot";

export default class JunreiApi {
    private readonly csrfToken: string;
    private readonly groupId: number;

    constructor(csrfToken: string, groupId: number) {
        this.csrfToken = csrfToken;
        this.groupId = groupId;
    }

    public async sendSortIndex(spots: Spot[]): Promise<number> {
        const headers: HeadersInit = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("X-CSRF-Token", this.csrfToken);

        const res = await fetch(
          `${location.origin}/groups/${this.groupId}/update_sort`,
          {
            method: "PATCH",
            credentials: "same-origin",
            headers,
            body: JSON.stringify({ spots }),
          },
        );

        return res.status;
    }
}

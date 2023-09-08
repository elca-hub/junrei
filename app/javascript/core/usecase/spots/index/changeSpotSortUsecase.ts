import PlaceId from "../../../domain/placeId";
import Spot from "../../../domain/spot";
import { changeSortSpotInput, changeSortSpotOutput } from "../../../dto/spots/changeSortSpotDto";
import JunreiApi from "../../../infrastructure/api/junreiApi";
import ChangeSpotSortPresenter from "../../../presenter/spots/changeSpotSortPresenter";
import ChangeSpotSortViewModel from "../../../viewmodel/spots/changeSpotSortViewModel";
import { IUsecase } from "../../IUsecase";

export default class ChangeSpotSortUsecase implements IUsecase<changeSortSpotInput, Promise<ChangeSpotSortViewModel>> {
    private readonly presenter: ChangeSpotSortPresenter;
    private readonly junreiApi: JunreiApi;

    constructor(presenter: ChangeSpotSortPresenter, junreiApi: JunreiApi) {
        this.presenter = presenter;
        this.junreiApi = junreiApi;
    }

    public async execute(input: changeSortSpotInput): Promise<ChangeSpotSortViewModel> {
        const inputSpots = input.getSpots();
        const index = input.getIndex();

        const spots = inputSpots.map((spot) => new Spot(
            spot.id,
            spot.sort_index,
            new PlaceId(spot.place_id)
        ));

        const rollback = spots; // ロールバック用

        if (index > inputSpots.length - 1) return this.presenter.fail(new changeSortSpotOutput(spots, "エラーが発生しました。"));

        [spots[index], spots[index + 1]] = [spots[index + 1], spots[index]];

        const temp = spots[index].getSortIndex();
        spots[index].changeSortIndex(spots[index + 1].getSortIndex());
        spots[index + 1].changeSortIndex(temp);
        
        const apiRes = await this.junreiApi.sendSortIndex(spots);
        const statusCode = apiRes.status;

        if (statusCode === 200) return this.presenter.complete(new changeSortSpotOutput(spots, null));
        
        return this.presenter.fail(new changeSortSpotOutput(rollback, apiRes.message ?? "サーバーエラーが発生しました。"));
    }
}

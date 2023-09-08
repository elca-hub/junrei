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

        [spots[index], spots[index + 1]] = [spots[index + 1], spots[index]];

        const temp = spots[index].getSortIndex();
        spots[index].changeSortIndex(spots[index + 1].getSortIndex());
        spots[index + 1].changeSortIndex(temp);
        
        const statusCode: number = await this.junreiApi.sendSortIndex(spots);

        if (statusCode === 200) {
            return this.presenter.complete(new changeSortSpotOutput(spots, null));
        } else {
            const status = Math.floor(statusCode / 100);
            const rollback = spots;

            if (status === 4) {
                return this.presenter.fail(new changeSortSpotOutput(rollback, "エラーが発生しました。時間をおいて再度お試しください。"));
            } else if (status === 5) {
                return this.presenter.fail(new changeSortSpotOutput(rollback, "サーバーでエラーが発生しました。時間をおいて再度お試しください。"));
            } else {
                return this.presenter.fail(new changeSortSpotOutput(rollback, "予期せぬエラーが発生しました。時間をおいて再度お試しください。"));
            }
        }
    }
}

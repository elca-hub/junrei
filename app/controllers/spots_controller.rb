class SpotsController < ApplicationController
    before_action :authenticate_user!
    before_action :check_group_exists
    before_action :check_spot_exists, only: [:show, :edit, :update, :destroy]

    def new
        @spot = Spot.new
        @group = User.find(current_user.id).groups.find(params[:group_id])
    end

    def index
        @group = Group.find(params[:group_id])
        @spots = @group.spots.order(:sort_index)

        gon.spots = @spots
        gon.group_id = @group.id
        gon.google_api = ENV['GOOGLE_API']
    end

    def show
        @group = User.find(current_user.id).groups.find(params[:group_id])
        @spot = @group.spots.find(params[:id])
    end

    def create
        @spot = Spot.new(spot_params)

        user_group = User.find(current_user.id).groups.find(params[:group_id])

        @spot.group = user_group

        if user_group.spots.count == 0
            @spot.sort_index = 0
        else
            @spot.sort_index = user_group.spots.maximum(:sort_index) + 1
        end

        if @spot.invalid?
            redirect_to new_group_spot_path, alert: @spot.errors.full_messages[0]
            return
        end

        begin
            @spot.save!
      
            redirect_to group_spots_path, notice: "スポットの追加に成功しました。"
        rescue
            redirect_to new_group_spot_path, alert: "スポットの登録中にエラーが発生しました。再度やり直してください。"
        end
    end

    def edit
        @group = User.find(current_user.id).groups.find(params[:group_id])
        @spot = @group.spots.find(params[:id])
    end

    def update
        @group = User.find(current_user.id).groups.find(params[:group_id])
        @spot = @group.spots.find(params[:id])
        @spot.update(spot_params)

        redirect_to group_spot_path(@group.id, @spot.id), notice: "スポットの編集に成功しました。"
    end
    

    private
    def spot_params
        params.require(:spot).permit(:name, :memo, :place_id)
    end
end

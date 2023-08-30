class GroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_group_exists

  def index
    # TODO: kaminariによるページネーション
    @groups = User.find(current_user.id).groups
  end

  def show
    @group = User.find(current_user.id).groups.find(params[:id])
  rescue StandardError => e
    if e.instance_of?(ActiveRecord::RecordNotFound)
      redirect_to groups_path, alert: '指定されたグループは存在しません。'
    else
      redirect_to groups_path, alert: 'グループの取得中にエラーが発生しました。再度やり直してください。'
    end
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)
    @group.user = current_user


    if @group.save
      redirect_to groups_path, notice: 'グループの追加に成功しました。'
    else
      redirect_to new_group_path, alert: @group.errors.full_messages
    end
  end

  def edit
    @group = User.find(current_user.id).groups.find(params[:id])
  end

  def update
    @group = User.find(current_user.id).groups.find(params[:id])
    if @group.update(group_params)
      redirect_to groups_path, notice: 'グループの編集に成功しました。'
    else
      redirect_to edit_group_path(@group), alert: @group.errors.full_messages
    end
  end

  def destroy
    @group = User.find(current_user.id).groups.find(params[:id])

    if @group.destroy
      redirect_to groups_path, notice: 'グループの削除に成功しました。'
    else
      redirect_to groups_path, alert: @group.errors.full_messages
    end

  end

  def destroy_all_spots
    @group = User.find(current_user.id).groups.find(params[:group_id])

    if @group.spots.destroy_all
      redirect_to group_path(@group), notice: 'スポットの全削除に成功しました。'
    else
      redirect_to group_path(@group), alert: @group.errors.full_messages
    end
  end

  def update_sort
    data = params[:spots]

    if data.nil? || data.empty?
      render json: { status: 'empty', error_message: '送信されたデータがありませんでした。' }, status: :bad_request
      return
    end

    data.each do |d|
      if d[:id].nil? || d[:sort_index].nil?
        render json: {status: 'unacceptable', error_message: '送信されたデータが不正です。'}, status: :bad_request
        return
      end

      begin
        spot = Spot.find(d[:id])
        spot.sort_index = d[:sort_index]
      rescue
        render json: { status: 'error', error_message: 'スポットの並び替えに失敗しました。' }, status: :internal_server_error
      end

      unless spot.save(context: :update_sort)
        render json: { status: 'error', error_message: 'スポットの並び替えに失敗しました。' }, status: :internal_server_error

        return
      end
    end

    render json: { status: 'success'}, status: :ok
  end

  private

  def group_params
    params.require(:group).permit(:name, :comment)
  end
end

class GroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_group_exists, only: %i[show edit update destroy]

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

    if @group.invalid?
      redirect_to new_group_path, alert: 'グループ情報を正しく入力してください。'
      return
    end

    begin
      @group.save!

      redirect_to groups_path, notice: 'グループの追加に成功しました。'
    rescue StandardError
      redirect_to new_group_path, alert: 'グループの登録中にエラーが発生しました。再度やり直してください。'
    end
  end

  def edit
    @group = User.find(current_user.id).groups.find(params[:id])
  end

  def update
    @group = User.find(current_user.id).groups.find(params[:id])
    @group.update(group_params)

    redirect_to groups_path, notice: 'グループの編集に成功しました。'
  end

  def destroy
    @group = User.find(current_user.id).groups.find(params[:id])

    @group.destroy

    redirect_to groups_path, notice: 'グループの削除に成功しました。'
  end

  def update_sort
    data = params[:spots]

    if data.nil? || data.empty?
      render json: { status: 'empty' }
      return
    end

    begin
      data.each do |d|
        spot = Spot.find(d[:id])
        spot.sort_index = d[:sort_index]

        spot.save!
      end

      render json: { status: 'success' }
    rescue StandardError
      render json: { status: 'error' }
    end
  end

  private

  def group_params
    params.require(:group).permit(:name, :comment)
  end
end

class GroupsController < ApplicationController
  before_action :authenticate_user!

  def index
    # TODO: kaminariによるページネーション
    @groups = User.find(current_user.id).groups
  end

  def show
    @group = User.find(current_user.id).groups.find(params[:id])
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)
    @group.user = current_user

    if @group.invalid?
      redirect_to new_group_path, alert: "グループ情報を正しく入力してください。"
      return
    end

    begin
      @group.save!

      redirect_to groups_path, notice: "グループの追加に成功しました。"
    rescue
      redirect_to new_group_path, alert: "グループの登録中にエラーが発生しました。再度やり直してください。"
    end
  end

  private
  def group_params
    params.require(:group).permit(:name, :comment)
  end
end

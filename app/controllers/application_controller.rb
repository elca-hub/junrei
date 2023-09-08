class ApplicationController < ActionController::Base
  before_action :configure_permitted_parameters, if: :devise_controller?

  # グループidがユーザが保有しているグループのidかどうかをチェックする
  def check_group_exists
    @user = User.find(current_user.id)

    group_id = params[:group_id] || params[:id]

    return unless !group_id.nil? && !@user.groups.exists?(id: group_id)

    if params[:action] == 'update_sort'
      render status: :unauthorized, json: { status: 'unauthorized', message: '指定されたグループは存在しません。' }
      return
    end

    redirect_to groups_path, alert: '指定されたグループは存在しません。'
  end

  def check_spot_exists
    @user = User.find(current_user.id)
    group_id = params[:group_id]
    @group = @user.groups.find(group_id)

    return unless !params[:id].nil? && !@group.spots.exists?(id: params[:id])

    redirect_to group_spots_path(@group), alert: '指定されたスポットは存在しません。'
  end

  private

  def after_sign_in_path_for(_resource)
    '/users'
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end

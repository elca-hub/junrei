class ApplicationController < ActionController::Base
    before_action :configure_permitted_parameters, if: :devise_controller?

    # グループidがユーザが保有しているグループのidかどうかをチェックする
    def check_group_exists
      @user = User.find(current_user.id)

      group_id = params[:group_id] || params[:id]

      if group_id != nil && !@user.groups.exists?(group_id)
        redirect_to groups_path, alert: "指定されたグループは存在しません。" 
      end
    end

    private
    def after_sign_in_path_for(resource_or_scope)
      "/users"
    end

    protected
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
      devise_parameter_sanitizer.permit(:account_update, keys: [:name])
    end
end

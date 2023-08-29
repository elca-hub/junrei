require 'rails_helper'

RSpec.describe "Groups", type: :request do
  let(:user) {create(:user)}
  let(:group) {create(:group, user: user)}

  describe "GET /groups" do
    context "ログインしている時" do
      before do
        sign_in user
      end

      it "HTTP Status 200" do
        get groups_path

        expect(response).to have_http_status 200
      end
    end


    context "未ログインのとき" do
      it "/users/sign_inへリダイレクト" do
        get groups_path

        expect(response).to redirect_to user_session_path
      end
    end
  end

  describe "GET /groups/:id" do
    context "ログインしている時" do
      before do
        sign_in user
      end

      it "HTTP Status 200" do
        get group_path(group)

        expect(response).to have_http_status 200
      end
    end

    context "未ログイン時" do
      it "/users/sign_inへリダイレクト" do
        get group_path(group)

        expect(response).to redirect_to user_session_path
      end
    end

    context "自身のグループでない時" do
      before do
        sign_in user
        
        @other_user = create(:user)
        @other_group = create(:group, user: @other_user)
      end
      it "/groupsへリダイレクト" do
        get group_path(@other_group)

        expect(response).to redirect_to groups_path
      end
    end
  end
end

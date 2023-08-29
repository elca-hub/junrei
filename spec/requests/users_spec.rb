require 'rails_helper'

RSpec.describe "Users", type: :request do
  let(:user) {create(:user)}

  describe 'GET /users' do
    context "ログインのとき" do
      before do
        sign_in user
      end

      it "HTTP Status 200" do
        get users_path

        expect(response).to have_http_status 200
      end
    end


    context "未ログインのとき" do
      it "/users/sign_inへリダイレクト" do
        get users_path

        expect(response).to redirect_to user_session_path
      end
    end
  end
end

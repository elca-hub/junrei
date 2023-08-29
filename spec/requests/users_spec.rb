require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user) }

  describe 'GET /users' do
    context 'ログインのとき' do
      before do
        sign_in user
      end

      it 'HTTP Status 200' do
        get users_path

        expect(response).to have_http_status :ok
      end
    end

    context '未ログインのとき' do
      it '/users/sign_inへリダイレクト' do
        get users_path

        expect(response).to redirect_to user_session_path
      end
    end
  end

  describe 'POST /users' do
    before do
      sign_in user
    end

    context 'パラメータが正常なとき' do
      before do
        post user_registration_path, params: { user: attributes_for(:user) }
      end

      it '/userへリダイレクト' do
        expect(response).to redirect_to users_path
      end
    end
  end

  describe 'DELETE /users' do
    let!(:deleted_user) { create(:user) }

    context 'ログインのとき' do
      before do
        sign_in deleted_user

        delete user_registration_path
      end

      it 'rootへリダイレクト' do
        expect(response).to redirect_to root_path
      end

      it 'ユーザーが削除される' do
        expect(User.find_by(id: deleted_user.id)).to be_nil
      end
    end

    context '未ログインのとき' do
      before do
        delete user_registration_path
      end

      it '/users/sign_inへリダイレクト' do
        expect(response).to redirect_to user_session_path
      end

      it 'ユーザーが削除されない' do
        expect(User.find_by(id: deleted_user.id)).not_to be_nil
      end
    end
  end
end

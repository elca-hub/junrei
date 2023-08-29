require 'rails_helper'

RSpec.describe 'Spots', type: :request do
  let(:user) { create(:user) }
  let(:group) { create(:group, user:) }
  let(:spot) { create(:spot, group:) }

  describe 'GET /group/:id/spot' do
    context 'ログインしている時' do
      before do
        sign_in user
      end

      it 'HTTP Status 200' do
        get group_spots_path(group)

        expect(response).to have_http_status 200
      end
    end

    context '未ログインのとき' do
      it '/users/sign_inへリダイレクト' do
        get group_spots_path(group)

        expect(response).to redirect_to user_session_path
      end
    end

    context '自身のグループでない時' do
      before do
        sign_in user

        @other_user = create(:user)
        @other_group = create(:group, user: @other_user)
      end

      it '/groupsへリダイレクト' do
        get group_spots_path(@other_group)

        expect(response).to redirect_to groups_path
      end
    end
  end

  describe 'GET /group/:id/spot/:id' do
    context 'ログインしている時' do
      before do
        sign_in user
      end

      it 'HTTP Status 200' do
        get group_spot_path(group, spot)

        expect(response).to have_http_status 200
      end
    end

    context '未ログインのとき' do
      it '/users/sign_inへリダイレクト' do
        get group_spot_path(group, spot)

        expect(response).to redirect_to user_session_path
      end
    end

    context '自身のグループでない時' do
      before do
        sign_in user

        @other_user = create(:user)
        @other_group = create(:group, user: @other_user)
      end

      it '/groupへリダイレクト' do
        get group_spot_path(@other_group, spot)

        expect(response).to redirect_to groups_path
      end
    end

    context 'スポットのidが存在しない時' do
      before do
        sign_in user

        @other_spot = create(:spot)
      end

      it '/group/:id/spotへリダイレクト' do
        get group_spot_path(group, @other_spot)

        expect(response).to redirect_to group_spots_path(group)
      end
    end
  end
end

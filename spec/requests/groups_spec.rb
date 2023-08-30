require 'rails_helper'

RSpec.describe 'Groups', type: :request do
  let(:user) { create(:user) }
  let(:group) { create(:group, user:) }

  describe 'GET /groups' do
    context 'ログインしている時' do
      before do
        sign_in user
      end

      it 'HTTP Status 200' do
        get groups_path

        expect(response).to have_http_status :ok
      end
    end

    context '未ログインのとき' do
      it '/users/sign_inへリダイレクト' do
        get groups_path

        expect(response).to redirect_to user_session_path
      end
    end
  end

  describe 'GET /groups/:id' do
    context 'ログインしている時' do
      before do
        sign_in user
      end

      it 'HTTP Status 200' do
        get group_path(group)

        expect(response).to have_http_status :ok
      end
    end

    context '未ログイン時' do
      it '/users/sign_inへリダイレクト' do
        get group_path(group)

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
        get group_path(@other_group)

        expect(response).to redirect_to groups_path
      end
    end
  end

  describe 'DELETE /groups/:group_id/delete_all_spots' do

    context '自身のグループのとき' do
      before do
        sign_in user

        @group = create(:group, user:)
        create_list(:spot, 3, group: @group)

        delete group_destroy_all_spots_path(@group)
      end

      it 'スポットが全て削除される' do
        expect(@group.spots.count).to eq 0
      end

      it '/groups/:group_idへリダイレクト' do
        expect(response).to redirect_to group_path(@group)
      end
    end

    context '自身のグループでないとき' do
      before do
        sign_in user

        @other_user = create(:user)
        @other_group = create(:group, user: @other_user)

        create_list(:spot, 3, group: @other_group)

        delete group_destroy_all_spots_path(@other_group)
      end

      it 'スポットが削除されない' do
        expect(@other_group.spots.count).to eq 3
      end

      it '/groupsへリダイレクト' do
        expect(response).to redirect_to groups_path
      end
    end
  end
end

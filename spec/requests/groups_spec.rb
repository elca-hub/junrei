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

  describe 'PATCH /groups/:group_id/update_sort' do
    describe 'ログインしている時' do
      before do
        sign_in user

        create_list(:spot, 3, group: group)

        @spots = group.spots.order(:sort_index)

        @spots[0].sort_index, @spots[1].sort_index = @spots[1].sort_index, @spots[0].sort_index
      end

      describe '自身のグループの場合' do
        context '正常なパラメータのとき' do
          before do
            @send_data = @spots.map do |spot|
              { id: spot.id, sort_index: spot.sort_index }
            end
          end
  
          it 'HTTP Status 200' do
            patch group_update_sort_path(group), params: { spots: @send_data }, as: :json
  
            expect(response).to have_http_status :ok
          end
        end
  
        context '不正なパラメータのとき' do
          before do
            @send_data = @spots.map do |spot|
              {hogehoge: spot.id, fugafuga: spot.sort_index}
            end
          end
  
          it 'HTTP Status 400' do
            patch group_update_sort_path(group), params: { spots: @send_data }, as: :json
  
            expect(response).to have_http_status :bad_request
          end
        end
      end

      describe '自身のグループでない場合' do
        context '正常なパラメータの場合' do
          before do
            @other_user = create(:user)
            @other_group = create(:group, user: @other_user)

            create_list(:spot, 3, group: @other_group)

            @spots = @other_group.spots.order(:sort_index)

            @send_data = @spots.map do |spot|
              { id: spot.id, sort_index: spot.sort_index }
            end
          end

          it '無効' do
            patch group_update_sort_path(@other_group), params: { spots: @send_data }, as: :json

            expect(response).to have_http_status :unauthorized
          end
        end
      end
    end

    context '未ログインのとき' do
      before do
        create_list(:spot, 3, group: group)

        @spots = group.spots.order(:sort_index)

        @spots[0].sort_index, @spots[1].sort_index = @spots[1].sort_index, @spots[0].sort_index
      end

      it 'HTTP Status 401' do
        patch group_update_sort_path(group), params: { spots: @send_data }, as: :json

        expect(response).to have_http_status :unauthorized
      end
    end
  end
end

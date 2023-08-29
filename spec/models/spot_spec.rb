require 'rails_helper'

RSpec.describe Spot, type: :model do
  let(:spot) { build(:spot) }
  subject { spot }

  describe 'バリデーション' do
    context '全ての要素が天才的なスポット様の場合' do
      it '有効' do
        is_expected.to be_valid
      end
    end

    describe 'name' do
      context '値が100文字以内の場合' do
        it '有効' do
          spot.name = 'a' * 100

          is_expected.to be_valid
        end
      end

      context '値が101文字以上の場合' do
        it '無効' do
          spot.name = 'a' * 101

          is_expected.to be_invalid
        end
      end

      context '値が空の場合' do
        it '無効' do
          spot.name = ''

          is_expected.to be_invalid
        end
      end

      context '値が重複している場合' do
        @DUPLICATE_SPOT_NAME = 'duplicate spot'
        before { create(:spot, name: @DUPLICATE_SPOT_NAME) }

        it '有効' do
          spot.name = @DUPLICATE_SPOT_NAME

          is_expected.to be_valid
        end
      end
    end

    describe 'memo' do
      context '値が200文字以内の場合' do
        it '有効' do
          spot.memo = 'a' * 200

          is_expected.to be_valid
        end
      end

      context '値が201文字以上の場合' do
        it '無効' do
          spot.memo = 'a' * 201

          is_expected.to be_invalid
        end
      end

      context '値が空の場合' do
        it '有効' do
          spot.memo = ''

          is_expected.to be_valid
        end
      end

      context '値が重複している場合' do
        @DUPLICATE_SPOT_MEMO = 'duplicate spot memo'
        before { create(:spot, memo: @DUPLICATE_SPOT_MEMO) }

        it '有効' do
          spot.memo = @DUPLICATE_SPOT_MEMO

          is_expected.to be_valid
        end
      end
    end

    describe 'is_achieved' do
      context '値がtrueの場合' do
        it '有効' do
          spot.is_achieved = true

          is_expected.to be_valid
        end
      end

      context '値がfalseの場合' do
        it '有効' do
          spot.is_achieved = false

          is_expected.to be_valid
        end
      end

      context '値がnilの場合' do
        it '無効' do
          spot.is_achieved = nil

          is_expected.to be_invalid
        end
      end
    end

    describe 'sort_index' do
      context '値が0以上の場合' do
        it '有効' do
          spot.sort_index = 0

          is_expected.to be_valid
        end
      end

      context '値が0未満の場合' do
        it '無効' do
          spot.sort_index = -1

          is_expected.to be_invalid
        end
      end

      describe '重複するsort_indexが存在する' do
        @DUPLICATE_SORT_INDEX = 0
        before do
          @group = create(:group)
          create(:spot, sort_index:@DUPLICATE_SORT_INDEX, group: @group)
        end

        context '異なるグループの場合' do
          it '有効' do
            spot.sort_index = @DUPLICATE_SORT_INDEX

            is_expected.to be_valid
          end
        end

        context '同じグループの場合' do
          it '無効' do
            spot.sort_index = @DUPLICATE_SORT_INDEX
            spot.group = @group

            is_expected.to be_invalid
          end
        end
      end
    end
  end
end

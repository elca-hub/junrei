require 'rails_helper'

RSpec.describe Spot, type: :model do
  subject { spot }

  let(:spot) { build(:spot) }

  describe 'バリデーション' do
    context '全ての要素が天才的なスポット様の場合' do
      it '有効' do
        expect(subject).to be_valid
      end
    end

    describe 'name' do
      context '値が100文字以内の場合' do
        it '有効' do
          spot.name = 'a' * 100

          expect(subject).to be_valid
        end
      end

      context '値が101文字以上の場合' do
        it '無効' do
          spot.name = 'a' * 101

          expect(subject).to be_invalid
        end
      end

      context '値が空の場合' do
        it '無効' do
          spot.name = ''

          expect(subject).to be_invalid
        end
      end

      context '値が重複している場合' do
        duplicate_spot_name = 'duplicate spot'
        before { create(:spot, name: duplicate_spot_name) }

        it '有効' do
          spot.name = duplicate_spot_name

          expect(subject).to be_valid
        end
      end
    end

    describe 'memo' do
      context '値が200文字以内の場合' do
        it '有効' do
          spot.memo = 'a' * 200

          expect(subject).to be_valid
        end
      end

      context '値が201文字以上の場合' do
        it '無効' do
          spot.memo = 'a' * 201

          expect(subject).to be_invalid
        end
      end

      context '値が空の場合' do
        it '有効' do
          spot.memo = ''

          expect(subject).to be_valid
        end
      end

      context '値が重複している場合' do
        duplicate_spot_memo = 'duplicate spot memo'
        before { create(:spot, memo: duplicate_spot_memo) }

        it '有効' do
          spot.memo = duplicate_spot_memo

          expect(subject).to be_valid
        end
      end
    end

    describe 'is_achieved' do
      context '値がtrueの場合' do
        it '有効' do
          spot.is_achieved = true

          expect(subject).to be_valid
        end
      end

      context '値がfalseの場合' do
        it '有効' do
          spot.is_achieved = false

          expect(subject).to be_valid
        end
      end

      context '値がnilの場合' do
        it '無効' do
          spot.is_achieved = nil

          expect(subject).to be_invalid
        end
      end
    end

    describe 'sort_index' do
      context '値が0以上の場合' do
        it '有効' do
          spot.sort_index = 0

          expect(subject).to be_valid
        end
      end

      context '値が0未満の場合' do
        it '無効' do
          spot.sort_index = -1

          expect(subject).to be_invalid
        end
      end

      describe '重複するsort_indexが存在する' do
        duplicate_sort_index = 0
        before do
          @group = create(:group)
          create(:spot, sort_index: duplicate_sort_index, group: @group)
        end

        context '異なるグループの場合' do
          it '有効' do
            spot.sort_index = duplicate_sort_index

            expect(subject).to be_valid
          end
        end

        context '同じグループの場合' do
          it '無効' do
            spot.sort_index = duplicate_sort_index
            spot.group = @group

            expect(subject).to be_invalid
          end
        end
      end
    end

    context 'グループのspotが上限を超えた場合' do
      before do
        create_list(:spot, Settings.max_spot_count, group: spot.group)
      end

      it '無効' do
        expect(subject).to be_invalid
      end
    end
  end
end

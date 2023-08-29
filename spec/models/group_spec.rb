require 'rails_helper'

RSpec.describe Group, type: :model do
  subject { group }

  let(:user) { build(:user) }
  let(:group) { build(:group, user:) }

  describe 'バリデーション' do
    context '全ての要素が天才的なグループ様の場合' do
      it '有効' do
        expect(subject).to be_valid
      end
    end

    describe 'name' do
      context '値が30文字以内の場合' do
        it '有効' do
          group.name = 'a' * 30

          expect(subject).to be_valid
        end
      end

      context '値が31文字以上の場合' do
        it '無効' do
          group.name = 'a' * 31

          expect(subject).to be_invalid
        end
      end

      context '値が空の場合' do
        it '無効' do
          group.name = ''

          expect(subject).to be_invalid
        end
      end

      describe '値が重複している場合' do
        duplicate_group_name = 'duplicate'

        context '自身のグループの場合' do
          before { create(:group, name: duplicate_group_name, user:) }

          it '無効' do
            group.name = duplicate_group_name

            expect(subject).to be_invalid
          end
        end

        context '他人のグループの場合' do
          before do
            other_user = create(:user)
            create(:group, name: duplicate_group_name, user: other_user)
          end

          it '有効' do
            group.name = duplicate_group_name

            expect(subject).to be_valid
          end
        end
      end
    end

    describe 'comment' do
      context '値が100文字以内の場合' do
        it '有効' do
          group.comment = 'a' * 100

          expect(subject).to be_valid
        end
      end

      context '値が101文字以上の場合' do
        it '無効' do
          group.comment = 'a' * 101

          expect(subject).to be_invalid
        end
      end

      context '値が空の場合' do
        it '有効' do
          group.comment = ''

          expect(subject).to be_valid
        end
      end

      context '値が重複している場合' do
        duplicate_comment = 'duplicate comment'
        before { create(:group, comment: duplicate_comment) }

        it '有効' do
          group.comment = duplicate_comment

          expect(subject).to be_valid
        end
      end
    end

    describe 'is_achieved' do
      context '値がtrueの場合' do
        it '有効' do
          group.is_achieved = true

          expect(subject).to be_valid
        end
      end

      context '値がfalseの場合' do
        it '有効' do
          group.is_achieved = false

          expect(subject).to be_valid
        end
      end

      context '値がnilの場合' do
        it '無効' do
          group.is_achieved = nil

          expect(subject).to be_invalid
        end
      end
    end
  end

  context 'ユーザが所持しているグループ数が上限を超えている場合' do
    before do
      create_list(:group, Settings.max_group_count, user:)
    end

    it '無効' do
      expect(subject).to be_invalid
    end
  end
end

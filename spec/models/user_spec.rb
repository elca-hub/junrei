require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }
  subject { user }

  describe 'バリデーション' do
    context 'すべての属性が完璧で究極の場合' do
      it '有効' do
        is_expected.to be_valid
      end
    end

    describe 'name' do
      name_length = 30
      context "値が#{name_length}文字以内の場合" do
        it '有効' do
          user.name = 'a' * name_length

          is_expected.to be_valid
        end
      end

      context "値が#{name_length + 1}文字以上の場合" do
        it '無効' do
          user.name = 'a' * (name_length + 1)

          is_expected.to be_invalid
        end
      end

      context '値が空の場合' do
        it '無効' do
          user.name = ''

          is_expected.to be_invalid
        end
      end

      context '値がnilの場合' do
        it '無効' do
          user.name = nil

          is_expected.to be_invalid
        end
      end

      context '値が重複している場合' do
        duplicate_name = 'duplicate'
        before { create(:user, name: duplicate_name) }

        it '無効' do
          user.name = duplicate_name

          is_expected.to be_invalid
        end
      end
    end

    describe 'email' do
      context '値が255文字以内の場合' do
        it '有効' do
          user.email = 'a' * 243 + '@example.com'

          is_expected.to be_valid
        end
      end

      context '値が256文字以上の場合' do
        it '無効' do
          user.email = 'a' * 244 + '@example.com'

          is_expected.to be_invalid
        end
      end

      context '値が空の場合' do
        it '無効' do
          user.email = ''

          is_expected.to be_invalid
        end
      end

      context '値がnilの場合' do
        it '無効' do
          user.email = nil

          is_expected.to be_invalid
        end
      end

      context '値が重複している場合' do
        duplicate_email = 'duplicate@test.com'
        before { create(:user, email: duplicate_email) }

        it '無効' do
          user.email = duplicate_email
          is_expected.to be_invalid
        end
      end

      context '形式が正しくない場合' do
        it '無効' do
          user.email = 'test'

          is_expected.to be_invalid
        end
      end
    end

    describe 'password' do
      min_password_length = 6
      context "値が#{min_password_length}文字以上の場合" do
        it '有効' do
          user.password = 'a' * min_password_length

          is_expected.to be_valid
        end
      end

      context "値が#{min_password_length - 1}文字以下の場合" do
        it '無効' do
          user.password = 'a' * (min_password_length - 1)

          is_expected.to be_invalid
        end
      end

      context '値が空の場合' do
        it '無効' do
          user.password = ''

          is_expected.to be_invalid
        end
      end

      context '値がnilの場合' do
        it '無効' do
          user.password = nil

          is_expected.to be_invalid
        end
      end
    end
  end
end

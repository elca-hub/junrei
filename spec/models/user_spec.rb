require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }
  subject { user }

  describe "バリデーション"  do
    context "すべての属性が完璧で究極の場合" do
      it "有効" do
        is_expected.to be_valid
      end
    end

    describe "name" do
      NAME_LENGH = 30
      context "値が#{NAME_LENGH}文字以内の場合" do
        it "有効" do
          user.name = "a" * NAME_LENGH

          is_expected.to be_valid
        end
      end

      context "値が#{NAME_LENGH + 1}文字以上の場合" do
        it "無効" do
          user.name = "a" * (NAME_LENGH + 1)

          is_expected.to be_invalid
        end
      end

      context "値が空の場合" do
        it "無効" do
          user.name = ""

          is_expected.to be_invalid
        end
      end

      context "値がnilの場合" do
        it "無効" do
          user.name = nil

          is_expected.to be_invalid
        end
      end

      context "値が重複している場合" do
        DUPLICATE_NAME = "duplicate"
        before { create(:user, name: DUPLICATE_NAME) }

        it "無効" do
          user.name = DUPLICATE_NAME

          is_expected.to be_invalid
        end
      end
    end

    describe "email" do
      context "値が255文字以内の場合" do
        it "有効" do
          user.email = "a" * 243 + "@example.com"

          is_expected.to be_valid
        end
      end

      context "値が256文字以上の場合" do
        it "無効" do
          user.email = "a" * 244 + "@example.com"

          is_expected.to be_invalid
        end
      end

      context "値が空の場合" do
        it "無効" do
          user.email = ""

          is_expected.to be_invalid
        end
      end

      context "値がnilの場合" do
        it "無効" do
          user.email = nil

          is_expected.to be_invalid
        end
      end

      context "値が重複している場合" do
        DUPLICATE_EMAIL = "duplicate@test.com"
        before { create(:user, email: DUPLICATE_EMAIL) }

        it "無効" do
          user.email = DUPLICATE_EMAIL
          is_expected.to be_invalid
        end
      end

      context "形式が正しくない場合" do
        it "無効" do
          user.email = "test"

          is_expected.to be_invalid
        end
      end
    end

    describe "password" do
      MIN_PASSWORD_LENGTH = 6
      context "値が#{MIN_PASSWORD_LENGTH}文字以上の場合" do
        it "有効" do
          user.password = "a" * MIN_PASSWORD_LENGTH
  
          is_expected.to be_valid
        end
      end

      context "値が#{MIN_PASSWORD_LENGTH - 1}文字以下の場合" do
        it "無効" do
          user.password = "a" * (MIN_PASSWORD_LENGTH - 1)

          is_expected.to be_invalid
        end
      end

      context "値が空の場合" do
        it "無効" do
          user.password = ""

          is_expected.to be_invalid
        end
      end

      context "値がnilの場合" do
        it "無効" do
          user.password = nil

          is_expected.to be_invalid
        end
      end
    end
  end
end

require 'rails_helper'

RSpec.describe Group, type: :model do
  let(:group) { build(:group) }
  subject { group }

  describe "バリデーション" do
    context  "全ての要素が天才的なグループ様の場合" do
      it "有効" do
        is_expected.to be_valid
      end
    end
  end

  describe "name" do
    context "値が30文字以内の場合" do
      it "有効" do
        group.name = "a" * 30

        is_expected.to be_valid
      end
    end

    context "値が31文字以上の場合" do
      it "無効" do
        group.name = "a" * 31

        is_expected.to be_invalid
      end
    end

    context "値が空の場合" do
      it "無効" do
        group.name = ""

        is_expected.to be_invalid
      end
    end

    context "値が重複している場合" do
      DUPLICATE_GROUP_NAME = "duplicate"
      before { create(:group, name: DUPLICATE_GROUP_NAME) }

      it "有効" do
        group.name = DUPLICATE_GROUP_NAME

        is_expected.to be_valid
      end
    end
  end

  describe "comment" do
    context "値が100文字以内の場合" do
      it "有効" do
        group.comment = "a" * 100

        is_expected.to be_valid
      end
    end

    context "値が101文字以上の場合" do
      it "無効" do
        group.comment = "a" * 101

        is_expected.to be_invalid
      end
    end

    context "値が空の場合" do
      it "有効" do
        group.comment = ""

        is_expected.to be_valid
      end
    end

    context "値が重複している場合" do
      DUPLICATE_COMMENT = "duplicate comment"
      before { create(:group, comment: DUPLICATE_COMMENT) }

      it "有効" do
        group.comment = DUPLICATE_COMMENT

        is_expected.to be_valid
      end
    end
  end

  describe "is_achieved" do
    context "値がtrueの場合" do
      it "有効" do
        group.is_achieved = true

        is_expected.to be_valid
      end
    end

    context "値がfalseの場合" do
      it "有効" do
        group.is_achieved = false

        is_expected.to be_valid
      end
    end

    context "値がnilの場合" do
      it "無効" do
        group.is_achieved = nil

        is_expected.to be_invalid
      end
    end
  end
end

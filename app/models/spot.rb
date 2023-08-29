class Spot < ApplicationRecord
    belongs_to :group

    before_create do
        self.is_achieved = false
    end

    validates :name, presence: true, length: {maximum: 100}
    validates :place_id, presence: true
    validates :memo, length: {maximum: 200}
    validates :is_achieved, inclusion: {in: [true, false]}
    validates :sort_index, presence: true, numericality: {only_integer: true, greater_than_or_equal_to: 0}

    # 同じグループで同じsort_indexが存在しないかチェックする
    validate :check_duplicate_sort_index

    def check_duplicate_sort_index
        if self.group.spots.where(sort_index: self.sort_index).where.not(id: self.id).count > 0
            errors.add(:sort_index, "is duplicated")
        end
    end
end

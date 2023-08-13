class Spot < ApplicationRecord
    belong_to :group

    before_create do
        self.is_achieved = false
    end

    validates :title, presence: true, length: {maximum: 100}
    validates :address, presence: true, length: {maximum:  150}
    validates :memo, length: {maximum: 200}
    validates :is_achieved, inclusion: {in: [true, false]}
end

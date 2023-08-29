class Group < ApplicationRecord
  belongs_to :user
  has_many :spots, dependent: :destroy

  before_create do
    self.uuid = SecureRandom.uuid
    self.is_achieved = false
  end

  validates :name, presence: true, length: { maximum: 30 }, uniqueness: { scope: :user }
  validates :comment, length: { maximum: 100 }
  validates :is_achieved, inclusion: { in: [true, false] }
end

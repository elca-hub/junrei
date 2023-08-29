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

  validate :check_overflow_group_count, on: :create

  # グループ数がmax_group_countを超えていないかチェックする
  def check_overflow_group_count
    return unless user.groups.count >= Settings.max_group_count

    errors.add(:user, 'is overflow')
  end
end

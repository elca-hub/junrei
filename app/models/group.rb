class Group < ApplicationRecord
  belongs_to :user

  before_create do
    self.uuid = SecureRandom.uuid
    self.is_achieved = false
  end

  validates :name, presence: true, length: {maximum: 30}, uniqueness: { scope: :user }
end

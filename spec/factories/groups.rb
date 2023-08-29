FactoryBot.define do
  factory :group do
    association :user
    sequence(:name) { |n| "testGroup#{n}" }
    comment { 'testComment' }
    is_achieved { false }
  end
end

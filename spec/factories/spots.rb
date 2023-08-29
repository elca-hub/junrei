FactoryBot.define do
  factory :spot do
    association :group
    sequence(:name) { |n| "testSpot#{n}" }
    place_id { 'testPlaceId' }
    memo { 'testMemo' }
    is_achieved  { false }
    sequence(:sort_index) { |n| n }
  end
end

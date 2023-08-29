FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "test#{n}" }
    sequence(:email) { |n| "test#{n}@test.com" }
    password { "password" }

    trait :invalid do
      name { '' }
    end
  end
end

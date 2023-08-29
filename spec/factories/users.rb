FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "test#{n}" }
    sequence(:email) { |n| "test#{n}@test.com" }
    password { "password" }

    trait :invalid do
      name { nil }
      email { nil }
    end
  end
end

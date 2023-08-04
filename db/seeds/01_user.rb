if Rails.env.development?
  TEST_USER_NAME = "テストユーザー"
  User.where(name: TEST_USER_NAME).first_or_create do |user|
    user.name = TEST_USER_NAME
    user.password = "password"
    user.email = "test-user@gmail.com"
  end
end

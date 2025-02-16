# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 20_230_828_044_836) do
  create_table 'groups', charset: 'utf8mb4', collation: 'utf8mb4_0900_ai_ci', force: :cascade do |t|
    t.bigint 'user_id'
    t.string 'name', null: false
    t.boolean 'is_achieved', default: false, null: false
    t.string 'uuid', null: false
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'comment', default: ''
    t.index ['user_id'], name: 'index_groups_on_user_id'
    t.index ['uuid'], name: 'index_groups_on_uuid'
  end

  create_table 'spots', charset: 'utf8mb4', collation: 'utf8mb4_0900_ai_ci', force: :cascade do |t|
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'name', null: false
    t.string 'memo', default: ''
    t.boolean 'is_achieved', default: false
    t.string 'place_id', null: false
    t.bigint 'group_id'
    t.integer 'sort_index', null: false
    t.index ['group_id'], name: 'index_spots_on_group_id'
  end

  create_table 'users', charset: 'utf8mb4', collation: 'utf8mb4_0900_ai_ci', force: :cascade do |t|
    t.string 'email', default: '', null: false
    t.string 'encrypted_password', default: '', null: false
    t.string 'reset_password_token'
    t.datetime 'reset_password_sent_at'
    t.datetime 'remember_created_at'
    t.datetime 'created_at', null: false
    t.datetime 'updated_at', null: false
    t.string 'name', null: false
    t.index ['email'], name: 'index_users_on_email', unique: true
    t.index ['reset_password_token'], name: 'index_users_on_reset_password_token', unique: true
  end

  add_foreign_key 'groups', 'users'
  add_foreign_key 'spots', 'groups'
end

class CreateGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :groups do |t|
      t.belongs_to :user, index: true, foreign_key: true
      t.string :name, null: false
      t.boolean :is_achieved, null: false, default: false
      t.string :uuid, null: false
      t.timestamps

      t.index :uuid
    end
  end
end

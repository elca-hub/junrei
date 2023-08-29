class AddForeignKeyBetweenGroupToSpot < ActiveRecord::Migration[7.0]
  def change
    add_reference :spots, :group, foreign_key: true
  end
end

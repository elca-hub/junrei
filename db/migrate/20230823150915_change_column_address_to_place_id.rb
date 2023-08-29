class ChangeColumnAddressToPlaceId < ActiveRecord::Migration[7.0]
  def up
    remove_column :spots, :address
    add_column :spots, :place_id, :string, null: false
  end

  def down
    remove_column :spots, :place_id
    add_column :spots, :address, :string, null: false
  end
end

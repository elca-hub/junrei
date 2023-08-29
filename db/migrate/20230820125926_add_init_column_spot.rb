class AddInitColumnSpot < ActiveRecord::Migration[7.0]
  def change
    add_column :spots, :name, :string, null: false
    add_column :spots, :address, :string, null: false
    add_column :spots, :memo, :string, default: ''
    add_column :spots, :is_achieved, :boolean, default: false
  end
end

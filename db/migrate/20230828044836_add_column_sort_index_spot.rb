class AddColumnSortIndexSpot < ActiveRecord::Migration[7.0]
  def change
    add_column :spots, :sort_index, :integer, null: false
  end
end

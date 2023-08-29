class AddColumnGroupComment < ActiveRecord::Migration[7.0]
  def change
    add_column :groups, :comment, :string, default: ''
  end
end

class AddStatusToFriendships < ActiveRecord::Migration[6.1]
  def change
    add_column :friendships, :status, :string, default: 'pending'
  end
end

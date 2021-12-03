class AddFriendsListToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :friends_list, :text, default: ''
  end
end

class AddRecipientIdToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :recipient_id, :integer
  end
end

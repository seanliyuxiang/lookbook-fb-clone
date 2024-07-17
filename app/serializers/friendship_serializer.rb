class FriendshipSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :friend_id, :created_at, :updated_at, :status

  belongs_to :friend

  belongs_to :user
end

class FriendshipSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :friend_id, :created_at, :updated_at
end

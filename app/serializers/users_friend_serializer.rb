class UsersFriendSerializer < ActiveModel::Serializer
  # custom serializer

  attributes :id, :first_name, :last_name, :email, :gender, :birthday

  has_many :posts
end

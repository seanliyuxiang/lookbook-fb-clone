class UserSerializer < ActiveModel::Serializer
  attributes(
    :id, :first_name, :last_name, :email, :gender,
    :birthday, :created_at, :updated_at, :friends_list, :friends_full_names
  )

  def friends_full_names
    self.object.friends.map do |friend|
      "#{friend.first_name} #{friend.last_name}"
    end
  end

  has_many :posts

  has_many :assertive_friendships

end

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  first_name      :string
#  last_name       :string
#  email           :string
#  password_digest :string
#  gender          :string
#  birthday        :date
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  friends_list    :text             default("")
#
class User < ApplicationRecord

  validates :email, uniqueness: true

  has_secure_password

  has_many :authored_posts,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Post,
    dependent: :destroy
  
  has_many :comments,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Comment
  
  has_many :assertive_friendships,  # may need to change this method name later
    primary_key: :id,
    foreign_key: :user_id,
    class_name: :Friendship
  
  has_many :passive_friendships,  # may need to change this method name later
    primary_key: :id,
    foreign_key: :friend_id,
    class_name: :Friendship

  has_many :friends,
    through: :assertive_friendships,
    source: :friend
  
  has_many :likes,
    primary_key: :id,
    foreign_key: :liker_id,
    class_name: :Like
  
  has_many :liked_posts,
    through: :likes,
    source: :post
  
  has_many :wall_posts,
    primary_key: :id,
    foreign_key: :recipient_id,
    class_name: :Post,
    dependent: :destroy

  has_one_attached :profile_picture

  has_one_attached :cover_photo
  
end

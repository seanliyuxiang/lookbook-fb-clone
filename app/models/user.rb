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

  validates :first_name, presence: true, length: { maximum: 40 }
  validates :last_name, presence: true, length: { maximum: 40 }
  validates :email, presence: true, uniqueness: true, length: { maximum: 80 }
  validates :password, length: { minimum: 12, message: 'must have minimum 12 and maximum 72 characters' }
  validates :gender, presence: true, inclusion: { in: %w(Female Male) }
  validates :birthday, presence: true

  # automatically checks password for presence true and length to be less than or equal to 72 characters
  # https://api.rubyonrails.org/v6.1.7.8/classes/ActiveModel/SecurePassword/ClassMethods.html#method-i-has_secure_password
  has_secure_password

  has_many :authored_posts,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Post,
    dependent: :destroy
  
  has_many :comments,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Comment,
    dependent: :destroy
  
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

  # If the `:dependent` option isn't set, the attachment will be purged (i.e. destroyed) whenever the record is destroyed.
  #   - https://api.rubyonrails.org/v6.1.7.8/classes/ActiveStorage/Attached/Model.html#method-i-has_one_attached
  has_one_attached :profile_picture

  # If the `:dependent` option isn't set, the attachment will be purged (i.e. destroyed) whenever the record is destroyed.
  #   - https://api.rubyonrails.org/v6.1.7.8/classes/ActiveStorage/Attached/Model.html#method-i-has_one_attached
  has_one_attached :cover_photo
  
end

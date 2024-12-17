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
  validate :password_length_minimum
  validates :gender, presence: true, inclusion: { in: %w(Female Male) }
  validates :birthday, presence: true
  validate :profile_picture_file_extension_must_be_valid, :profile_picture_file_size_maximum
  validate :cover_photo_file_extension_must_be_valid, :cover_photo_file_size_maximum

  # using custom method to validate password minimum length
  # because the built-in Active Record validation helper
  # results in the following when user uploads profile picture and cover photo:
  # TRANSACTION ROLLBACK
  # Filter chain halted as :set_blob rendered or redirected
  # Completed 404 Not Found
  def password_length_minimum
    if password && password.length < 12
      errors.add(:password, 'must have minimum 12 and maximum 72 characters')
    end
  end

  def profile_picture_file_extension_must_be_valid
    valid_file_extensions = ['jpeg', 'jpg', 'png']

    # maybe use `profile_picture.present?` instead of just `profile_picture`
    # to check if there is an attachment
    if profile_picture && profile_picture.blob
      file_extension = profile_picture.blob.content_type.split('/')[1].downcase

      if !valid_file_extensions.include?(file_extension)
        errors.add(:profile_picture, 'must be jpeg, jpg, or png')
      end
    end
  end

  def profile_picture_file_size_maximum
    max_file_size = 3 * (10 ** 6) # 3 MB

    # maybe use `profile_picture.present?` instead of just `profile_picture`
    # to check if there is an attachment
    if profile_picture && profile_picture.blob
      file_size = profile_picture.blob.byte_size

      if file_size > max_file_size
        errors.add(:profile_picture, 'cannot be greater than 3 MB')
      end
    end
  end

  def cover_photo_file_extension_must_be_valid
    valid_file_extensions = ['jpeg', 'jpg', 'png']

    # maybe use `cover_photo.present?` instead of just `cover_photo`
    # to check if there is an attachment
    if cover_photo && cover_photo.blob
      file_extension = cover_photo.blob.content_type.split('/')[1].downcase

      if !valid_file_extensions.include?(file_extension)
        errors.add(:cover_photo, 'must be jpeg, jpg, or png')
      end
    end
  end

  def cover_photo_file_size_maximum
    max_file_size = 3 * (10 ** 6) # 3 MB

    # maybe use `cover_photo.present?` instead of just `cover_photo`
    # to check if there is an attachment
    if cover_photo && cover_photo.blob
      file_size = cover_photo.blob.byte_size

      if file_size > max_file_size
        errors.add(:cover_photo, 'cannot be greater than 3 MB')
      end
    end
  end

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

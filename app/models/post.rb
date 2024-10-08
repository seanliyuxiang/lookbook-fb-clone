# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  author_id    :integer
#  body         :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  recipient_id :integer
#
class Post < ApplicationRecord

  validates :author_id, presence: true
  validates :body, presence: true, length: { maximum: 500 }
  validates :recipient_id, presence: true

  belongs_to :author,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :User
  
  has_many :comments,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: :Comment,
    dependent: :destroy
  
  has_many :likes,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: :Like,
    dependent: :destroy
  
  has_many :likers,
    through: :likes,
    source: :liker

  belongs_to :wall,
    primary_key: :id,
    foreign_key: :recipient_id,
    class_name: :User
  
  # If the `:dependent` option isn't set, the attachment will be purged (i.e. destroyed) whenever the record is destroyed.
  #   - https://api.rubyonrails.org/v6.1.7.8/classes/ActiveStorage/Attached/Model.html#method-i-has_one_attached
  has_one_attached :post_photo

end

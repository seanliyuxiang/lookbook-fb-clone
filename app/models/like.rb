# == Schema Information
#
# Table name: likes
#
#  id         :bigint           not null, primary key
#  liker_id   :integer
#  post_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Like < ApplicationRecord

  validates :liker_id, presence: true
  validates :post_id, presence: true

  belongs_to :liker,
    primary_key: :id,
    foreign_key: :liker_id,
    class_name: :User
  
  belongs_to :post,
    primary_key: :id,
    foreign_key: :post_id,
    class_name: :Post

end

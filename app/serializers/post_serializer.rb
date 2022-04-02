class PostSerializer < ActiveModel::Serializer
  attributes(
    :id, :author_id, :author_full_name, :body, :created_at,
    :updated_at, :recipient_id, :count_likes, :post_photo_url
  )

  def author_full_name
    "#{self.object.author.first_name} #{self.object.author.last_name}"
  end

  # count total number of likes for a post
  def count_likes
    Like.where(post_id: self.object.id).count
  end

  has_many :comments

  has_many :likes

  def post_photo_url
    if self.object.post_photo.attached?
      Rails.application.routes.url_helpers.url_for(self.object.post_photo)
    end
  end

  belongs_to :author
end

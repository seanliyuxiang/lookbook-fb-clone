class PostSerializer < ActiveModel::Serializer
  attributes :id, :author_id, :author_full_name, :body, :created_at, :updated_at, :count_likes

  def author_full_name
    "#{self.object.author.first_name} #{self.object.author.last_name}"
  end

  # count total number of likes for a post
  def count_likes
    Like.where(post_id: self.object.id).count
  end

  has_many :comments
end

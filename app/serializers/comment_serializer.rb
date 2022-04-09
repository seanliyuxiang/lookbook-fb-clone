class CommentSerializer < ActiveModel::Serializer
  attributes :id, :author_id, :author_full_name, :post_id, :body, :created_at, :updated_at

  def author_full_name
    "#{self.object.author.first_name} #{self.object.author.last_name}"
  end

  belongs_to :author
end

class Api::CommentsController < ApplicationController

  def create
    comment = Comment.new(comment_params)
    if comment.save
      render json: comment, status: :created
    else
      render json: {error: 'Comment unsuccessful'}, status: :unprocessable_entity
    end
  end

  private

  def comment_params
    params.permit(:author_id, :post_id, :body)
  end

end

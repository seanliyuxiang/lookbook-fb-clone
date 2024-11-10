class Api::CommentsController < ApplicationController

  def create
    comment = Comment.new(comment_params)
    if comment.save
      render json: comment, status: :created
    else
      render(
        json: {
          author_id: comment.errors[:author_id].map { |message| "Author #{message}." },
          post_id: comment.errors[:post_id].map { |message| "Post #{message}." },
          body: comment.errors[:body].map { |message| "Body #{message}." }
        },
        status: :unprocessable_entity
      )
    end
  end

  def destroy
    comment = Comment.find_by(id: params[:id])
    comment.destroy
    render json: comment
  end

  def update
    comment = Comment.find_by(id: params[:id])
    if comment.update(comment_params)
      render json: comment
    else
      render(
        json: {
          author_id: comment.errors[:author_id].map { |message| "Author #{message}." },
          post_id: comment.errors[:post_id].map { |message| "Post #{message}." },
          body: comment.errors[:body].map { |message| "Body #{message}." }
        },
        status: :unprocessable_entity
      )
    end
  end

  private

  def comment_params
    params.permit(:author_id, :post_id, :body)
  end

end

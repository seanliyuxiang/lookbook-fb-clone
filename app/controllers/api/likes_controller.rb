class Api::LikesController < ApplicationController

  def create
    like = Like.new(like_params)
    if like.save
      render json: like, status: :created
    else
      render json: {error: 'Like unsuccessful'}, status: :unprocessable_entity
    end
  end

  private

  def like_params
    params.permit(:liker_id, :post_id)
  end

end

class Api::FriendshipsController < ApplicationController

  def create
    friendship = Friendship.new(friendship_params)
    if friendship.save
      render json: friendship, status: :created
    else
      render json: {error: 'Friendship unsuccessful'}, status: :unprocessable_entity
    end
  end

  private

  def friendship_params
    params.permit(:user_id, :friend_id)
  end

end

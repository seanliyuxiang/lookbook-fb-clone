class Api::FriendshipsController < ApplicationController

  def create
    friendship = Friendship.new(friendship_params)
    if friendship.save
      render json: friendship, include: [], status: :created # render an instance of User, don't need to serialize this instance's posts and friends
    else
      render json: {error: 'Friendship unsuccessful'}, status: :unprocessable_entity
    end
  end

  private

  def friendship_params
    params.permit(:user_id, :friend_id)
  end

end

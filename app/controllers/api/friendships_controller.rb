class Api::FriendshipsController < ApplicationController

  def create
    friendship = Friendship.new(friendship_params)
    if friendship.save
      render json: friendship, status: :created
    else
      render json: {error: 'Friendship unsuccessful'}, status: :unprocessable_entity
    end
  end

  def destroy
    friendship = Friendship.find_by(id: params[:id])
    friendship.destroy
    render json: friendship
  end

  def update
    friendship = Friendship.find_by(id: params[:id])
    if friendship.update(friendship_params)
      render json: friendship
    else
      render json: {error: 'Edit unsuccessful'}, status: :unprocessable_entity
    end
  end

  private

  def friendship_params
    params.permit(:user_id, :friend_id, :status)
  end

end

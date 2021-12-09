class Api::UsersController < ApplicationController

  def create
    user = User.new(user_params)
    if user.save
      session[:user_id] ||= user.id
      render json: user, status: :created
    else
      render json: {errors: user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # def show_home_feed
  #   user = User.find_by(id: session[:user_id])
  #   if user
  #     render json: user, include: ['friends', 'friends.posts.comments']
  #   else
  #     render json: {error: 'Not authorized'}, status: :unauthorized
  #   end
  # end

  def show_home_feed
    user = User.find_by(id: session[:user_id])
    if user
      render json: user.friends, each_serializer: UsersFriendSerializer, include: ['posts', 'posts.comments']
    else
      render json: {error: 'Not authorized'}, status: :unauthorized
    end
  end

  private

  def user_params
    params.permit(
      :first_name,
      :last_name,
      :email,
      :password,
      :password_confirmation,
      :gender,
      :birthday
    )
  end

end

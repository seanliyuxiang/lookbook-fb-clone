class Api::SessionsController < ApplicationController

  skip_before_action :authorized, only: [:create, :auto_login]

  def create
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: user, include: ['wall_posts', 'assertive_friendships', 'assertive_friendships.friend', 'passive_friendships', 'passive_friendships.user'], status: :created
    else
      render json: {error: 'Invalid email and/or password'}, status: :unauthorized
    end
  end

  def destroy
    if session[:user_id]
      session.delete(:user_id)  # Ruby method to delete a key-value pair from a hash
      head :no_content
    else
      render json: {error: 'No logged in user'}, status: :unauthorized
    end
  end

  def auto_login
    user = User.find_by(id: session[:user_id])
    if user
      render json: user, include: ['wall_posts', 'assertive_friendships', 'assertive_friendships.friend', 'passive_friendships', 'passive_friendships.user'], status: :created
    else
      render json: {error: 'No logged in user'}, status: :unauthorized
    end
  end

end

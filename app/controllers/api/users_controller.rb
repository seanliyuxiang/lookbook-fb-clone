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

  def show
    user = User.find_by(id: params[:id])
    render json: user, include: ['posts', 'posts.comments', 'posts.likers']
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

class Api::UsersController < ApplicationController

  skip_before_action :authorized, only: [:create]

  def index
    users = User.all
    render json: users, status: :ok
  end

  def create
    user = User.new(user_params)
    if user.save
      session[:user_id] ||= user.id
      render json: user, status: :created
    else
      render(
        json: {
          first_name: user.errors[:first_name].map { |message| "First name #{message}." },
          last_name: user.errors[:last_name].map { |message| "Last name #{message}." },
          email: user.errors[:email].map { |message| "Email #{message}." },
          password: user.errors[:password].map { |message| "Password #{message}." },
          gender: user.errors[:gender].map { |message| "Gender #{message}." },
          birthday: user.errors[:birthday].map { |message| "Birthday #{message}." }
        },
        status: :unprocessable_entity
      )
    end
  end

  def show
    user = User.find_by(id: params[:id])
    render json: user, include: ['wall_posts', 'wall_posts.comments', 'wall_posts.comments.author', 'wall_posts.likes', 'wall_posts.author', 'assertive_friendships', 'assertive_friendships.friend', 'passive_friendships', 'passive_friendships.user']
  end

  def attach_new_profile_picture
    user = User.find_by(id: params[:id])
    
    if user.profile_picture.attach(params[:profile_picture])
      render json: user, include: ['wall_posts', 'wall_posts.comments', 'wall_posts.comments.author', 'wall_posts.likes', 'wall_posts.author', 'assertive_friendships', 'assertive_friendships.friend', 'passive_friendships', 'passive_friendships.user']
    else
      render(
        json: {
          profile_picture: user.errors[:profile_picture].map { |message| "Profile picture #{message}." }
        },
        status: :unprocessable_entity
      )
    end
  end

  def attach_new_cover_photo
    user = User.find_by(id: params[:id])

    if user.cover_photo.attach(params[:cover_photo])
      render json: user, include: ['wall_posts', 'wall_posts.comments', 'wall_posts.comments.author', 'wall_posts.likes', 'wall_posts.author', 'assertive_friendships', 'assertive_friendships.friend', 'passive_friendships', 'passive_friendships.user']
    else
      render(
        json: {
          cover_photo: user.errors[:cover_photo].map { |message| "Cover photo #{message}." }
        },
        status: :unprocessable_entity
      )
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
      :birthday,
      :profile_picture,
      :cover_photo
    )
  end

end

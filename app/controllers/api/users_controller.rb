class Api::UsersController < ApplicationController

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
      render json: {errors: user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def show
    user = User.find_by(id: params[:id])
    render json: user, include: ['wall_posts', 'wall_posts.comments', 'wall_posts.comments.author', 'wall_posts.likes', 'wall_posts.author', 'assertive_friendships', 'assertive_friendships.friend']
  end

  def attach_new_profile_picture
    user = User.find_by(id: params[:id])
    if user.profile_picture.attached?   # need to remove the attachment from the model first before attaching another
      user.profile_picture.purge_later  # `.purge_later` or `.purge` ???; purging deletes the blob and the file from the storage service
    end
    user.profile_picture.attach(params[:profile_picture])
    render json: user, include: ['wall_posts', 'wall_posts.comments', 'wall_posts.comments.author', 'wall_posts.likes', 'wall_posts.author', 'assertive_friendships', 'assertive_friendships.friend']
  end

  def attach_new_cover_photo
    user = User.find_by(id: params[:id])
    if user.cover_photo.attached?   # need to remove the attachment from the model first before attaching another
      user.cover_photo.purge_later  # `.purge_later` or `.purge` ???; purging deletes the blob and the file from the storage service
    end
    user.cover_photo.attach(params[:cover_photo])
    render json: user, include: ['wall_posts', 'wall_posts.comments', 'wall_posts.comments.author', 'wall_posts.likes', 'wall_posts.author', 'assertive_friendships', 'assertive_friendships.friend']
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

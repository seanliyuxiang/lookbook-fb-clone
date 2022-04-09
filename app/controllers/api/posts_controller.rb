class Api::PostsController < ApplicationController

  def create
    post = Post.new(post_params)
    if post.save
      render json: post, status: :created
    else
      render json: {error: 'Post unsuccessful'}, status: :unprocessable_entity
    end
  end

  # logged-in user's friends' authored posts ---> friends' authored posts' comments
  def show_home_feed
    user = User.find_by(id: session[:user_id])

    if user
      friends_authored_posts = []

      user.friends.each do |users_friend|
        users_friend.authored_posts.each do |users_friends_authored_post|
          friends_authored_posts << users_friends_authored_post
        end
      end

      friends_authored_posts_ids = friends_authored_posts.map { |friends_authored_post| friends_authored_post.id }
      friends_authored_posts_new_to_old = Post.where(id: friends_authored_posts_ids).order(created_at: :desc)

      render json: friends_authored_posts_new_to_old, include: ['comments', 'comments.author', 'likes', 'author']
    else
      render json: {error: 'Not authorized'}, status: :unauthorized
    end
  end

  def destroy
    post = Post.find_by(id: params[:id])
    post.destroy
    render json: post
  end

  def update
    post = Post.find_by(id: params[:id])
    if post.update(post_params)
      render json: post
    else
      render json: {error: 'Edit unsuccessful'}, status: :unprocessable_entity
    end
  end

  private

  def post_params
    params.permit(:author_id, :body, :recipient_id, :post_photo)
  end

end

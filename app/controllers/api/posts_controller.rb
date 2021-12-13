class Api::PostsController < ApplicationController

  def create
    post = Post.new(post_params)
    if post.save
      render json: post, status: :created
    else
      render json: {error: 'Post unsuccessful'}, status: :unprocessable_entity
    end
  end

  # logged-in user's friends' posts ---> friends' posts' comments
  def show_home_feed
    user = User.find_by(id: session[:user_id])

    if user
      friends_posts = []

      user.friends.each do |users_friend|
        users_friend.posts.each do |users_friends_post|
          friends_posts << users_friends_post
        end
      end

      friends_posts_ids = friends_posts.map { |friends_post| friends_post.id }
      friends_posts_new_to_old = Post.where(id: friends_posts_ids).order(created_at: :desc)

      render json: friends_posts_new_to_old
    else
      render json: {error: 'Not authorized'}, status: :unauthorized
    end
  end

  private

  def post_params
    params.permit(:author_id, :body)
  end

end

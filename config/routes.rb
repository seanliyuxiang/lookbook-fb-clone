Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do

    # comments
    resources :comments, only: [:create, :destroy, :update]

    # friendships
    resources :friendships, only: [:create, :destroy]

    # likes
    resources :likes, only: [:create, :destroy]

    # posts
    get '/home_feed', to: 'posts#show_home_feed'
    resources :posts, only: [:create, :destroy, :update]
    
    # sessions
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/auto_login', to: 'sessions#auto_login'
    
    # users
    post '/signup', to: 'users#create'
    resources :users, only: [:index, :show]
    post '/users/:id/attach_new_profile_picture', to: 'users#attach_new_profile_picture'
    post '/users/:id/attach_new_cover_photo', to: 'users#attach_new_cover_photo'

  end
end

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do

    # comments
    resources :comments, only: [:create]

    # posts
    get '/home_feed', to: 'posts#show_home_feed'
    resources :posts, only: [:create, :destroy]
    
    # sessions
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    
    # users
    post '/signup', to: 'users#create'
    resources :users, only: [:show]

  end
end

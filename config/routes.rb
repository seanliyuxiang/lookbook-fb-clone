Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do

    # posts
    get '/home_feed', to: 'posts#show_home_feed'
    
    # sessions
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    
    # users
    post '/signup', to: 'users#create'
    resources :users, only: [:show]

  end
end

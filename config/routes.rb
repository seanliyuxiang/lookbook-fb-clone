Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do

    # create a new user, show home feed page
    post '/signup', to: 'users#create'
    get '/home_feed', to: 'users#show_home_feed'

    # RESTful routes for users controller
    resources :users, only: [:show]

    # create a session, destroy a session
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    
  end
end

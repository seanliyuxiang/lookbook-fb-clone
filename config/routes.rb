Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do

    # create a new user, show user profile page
    post '/signup', to: 'users#create'
    get '/me', to: 'users#show'

    # create a session, destroy a session
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    
  end
end

Rails.application.routes.draw do
  devise_for :users, controllers: {
    registrations: 'users/registrations'
  }
  root 'top#index'

  resource :users

  resources :groups do
    resources :spots do
    end
    patch 'update_sort'
  end
end

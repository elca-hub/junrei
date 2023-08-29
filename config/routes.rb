Rails.application.routes.draw do
  devise_for :users
  root "top#index"

  resources :users

  resources :groups do
    resources :spots do
    end
    patch "update_sort"
  end
end

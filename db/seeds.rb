# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'date'  # seem to not need it when creating demo user's birthday

User.destroy_all
Post.destroy_all
Comment.destroy_all
Like.destroy_all
Friendship.destroy_all

puts '🌱🌱🌱 Seeding users... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding posts... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding comments... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding friendships... 🌱🌱🌱'

# create demo user
User.create(
  first_name: 'Mark',
  last_name: 'Zuckerberg',
  email: 'zuckerberg@fb.com',
  password: 'password1234',
  gender: 'Male',
  birthday: Date.new(1984, 5, 14)
)

# create 4 random users
4.times do
  User.create(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.email,
    password: 'password1234',
    gender: Faker::Gender.binary_type,
    birthday: Faker::Date.birthday(min_age: 16, max_age: 100)
  )
end
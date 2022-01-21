# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Post.destroy_all
Comment.destroy_all
Like.destroy_all
Friendship.destroy_all

puts '🌱🌱🌱 Seeding users... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding posts... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding comments... 🌱🌱🌱'

# create 5 random users
5.times do
  User.create(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.email,
    password: 'password',
    gender: Faker::Gender.binary_type,
    birthday: Faker::Date.birthday(min_age: 16, max_age: 100)
  )
end

# create 5 random posts on each user's wall with random authors
User.all.each do |user|
  5.times do
    Post.create(
      author_id: rand(User.all.length)+1,
      body: Faker::Quote.famous_last_words,
      recipient_id: user.id
    )
  end
end

# create 5 random comments for each post with random authors
Post.all.each do |post|
  5.times do
    Comment.create(
      author_id: rand(User.all.length)+1,
      post_id: post.id,
      body: Faker::Quote.famous_last_words
    )
  end
end

# create random friendships for each user
User.all.each do |user|
  total_friends = rand(User.all.length)

  # possible user id's that can be friends
  possible_friend_ids = (1..(User.all.length)).to_a
  possible_friend_ids.delete(user.id)

  # random user id's that are friends
  random_friend_ids = possible_friend_ids.sample(total_friends).sort

  # create `friends_list` column in `users` table
  user.friends_list = random_friend_ids.join(',')
  user.save


  # create friendships in `friendships` table
  if !random_friend_ids.empty?
    random_friend_ids.each do |id|
      Friendship.create(user_id: user.id, friend_id: id)
    end
  end
end
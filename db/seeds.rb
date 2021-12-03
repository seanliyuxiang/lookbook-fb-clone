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

puts '🌱🌱🌱 Seeding users... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding posts... 🌱🌱🌱'
puts '🌱🌱🌱 Seeding comments... 🌱🌱🌱'

# create 5 random users
5.times do
  user = User.create(
    first_name: Faker::Name.first_name,
    last_name: Faker::Name.last_name,
    email: Faker::Internet.email,
    password: 'password',
    gender: Faker::Gender.binary_type,
    birthday: Faker::Date.birthday(min_age: 16, max_age: 100)
  )

  # create 5 random posts for each user
  5.times do
    post = Post.create(
      author_id: user.id,
      body: Faker::Quote.famous_last_words
    )
  end
end

# create 5 random comments for each post
Post.all.each do |post|
  5.times do
    Comment.create(
      author_id: rand(User.all.length)+1,
      post_id: post.id,
      body: Faker::Quote.famous_last_words
    )
  end
end

# create random friends for each user
User.all.each do |user|
  total_friends = rand(User.all.length)

  # possible user id's that can be friends
  possible_friend_ids = (1..(User.all.length)).to_a
  possible_friend_ids.delete(user.id)

  user.friends_list = possible_friend_ids.sample(total_friends).sort.join(',')
  user.save
end
class AddInterchangeableUniqueIndexToFriendships < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        connection.execute(%q(
          create unique index index_friendships_on_interchangeable_user_id_and_friend_id on friendships(greatest(user_id,friend_id), least(user_id,friend_id));
          create unique index index_friendships_on_interchangeable_friend_id_and_user_id on friendships(least(user_id,friend_id), greatest(user_id,friend_id));
        ))
      end

      dir.down do
        connection.execute(%q(
          drop index index_friendships_on_interchangeable_user_id_and_friend_id;
          drop index index_friendships_on_interchangeable_friend_id_and_user_id;
        ))
      end
    end
  end
end

# References:
# https://www.freecodecamp.org/news/how-to-set-unique-interchangeable-index-constraint-in-rails/
# https://www.bomberbot.com/ruby-on-rails/rails-how-to-set-a-unique-interchangeable-index-constraint/
# https://softwareengineering.stackexchange.com/questions/325284/specifying-a-bi-directional-unique-constraint-on-a-join-table-in-postgres

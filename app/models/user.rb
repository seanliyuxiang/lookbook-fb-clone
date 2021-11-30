# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  first_name      :string
#  last_name       :string
#  email           :string
#  password_digest :string
#  gender          :string
#  birthday        :date
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord

  has_secure_password

  has_many :posts,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Post
  
  has_many :comments,
    primary_key: :id,
    foreign_key: :author_id,
    class_name: :Comment

end

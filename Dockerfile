FROM ruby:3.2.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs vim npm

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
      echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
      apt-get update && apt-get install -y yarn

RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp
RUN yarn install
RUN bundle install

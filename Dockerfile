FROM debian:bookworm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before other files
# Utilize cache to save Docker build time
COPY package.json package-lock.json ./

# Install dependencies
RUN apt-get update && apt-get install -y curl sudo gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
    sudo apt-get install -y nodejs && \
    sudo apt install -y npm && \
    sudo npm install --global yarn

# Install app dependencies
RUN npm install next react@latest react-dom

# Copy other application files
COPY . .

# Build the application for production
RUN yarn install && yarn build

# Specify the command to run on container start
CMD [ "yarn", "start" ]

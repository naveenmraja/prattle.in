## [Prattle](https://prattle.in)

[Prattle](https://prattle.in) is an anonymous chat app and a great way to meet new people. Prattle will pick someone random for you and create a private chat session. If you prefer to add your interests, Prattle will look to connect you with someone who shares some of your interests.

[![gwFSAx.md.png](https://iili.io/gwFSAx.md.png)](https://freeimage.host/i/gwFSAx)
[![gwF89j.md.png](https://iili.io/gwF89j.md.png)](https://freeimage.host/i/gwF89j)

**Technologies Used:**

- Node.js (Express)
- React+Redux
- MongoDB
- Redis
- Nginx
- Docker-compose

**To run the app in development mode :**

- Register `localhost` domain in Google reCaptcha v3  site [here](https://www.google.com/recaptcha/admin/create) and copy your Site key and Secret key. Create a new file in the project root directory `.env.front.dev`  with following content :

       REACT_APP_GOOGLE_SITE_KEY="$YOUR_GOOGLE_SITE_KEY"

- Create another file  in the project root directory  `.env.backend.dev` with the following content :

      NODE_ENV=development  
      REDIS_URL="redis://redis-dev-server"  
      MONGODB_URL="mongodb://root:example@mongo-dev-server:27017/"  
      GOOGLE_SECRET_KEY="$YOUR_GOOGLE_SECRET_KEY"

- Run the following command in the root directory to start up the development server :
       
       docker-compose -f docker-compose.dev.yml up --build

**For Production build and deployment :**

- Create the following files in root directory :

    - **`.env.backend`**

          NODE_ENV=production  
          REDIS_URL="redis://redis-server"  
          MONGODB_URL="mongodb://user:password@mongo-server:27017/"  
          GOOGLE_SECRET_KEY="YOUR_GOOGLE_SECRET_KEY"

    - **`.env`**

          REACT_APP_GOOGLE_SITE_KEY="YOUR_GOOGLE_SITE_KEY"  
          AWS_PRIVATE_SUBNET="YOUR_PRIVATE_SUBNET_ID"  
          AWS_PUBLIC_SUBNET_1="YOUR_PUBLIC_SUBNET_ID_1"  
          AWS_PUBLIC_SUBNET_2="YOUR_PUBLIC_SUBNET_ID_2"

    - **`.env.mongo`**

            MONGO_INITDB_ROOT_USERNAME=user
            MONGO_INITDB_ROOT_PASSWORD=password

- Update the image names of `prattle-backend` and `nginx` services in `docker-compose.yml` and build the images and push it to your docker repository using the following commands

      docker-compose build --pull
      docker-compose push

- You can update the AWS Cloud formation overlay in `docker-compose.yml` file as per your needs. Create a Docker ECS context using :

       docker context create ecs myecscontext

- If you're deploying your containers in a private subnet, make sure the subnet is attached to a NAT Gateway since the containers will need access to the internet to pull docker images.
- To deploy the application to ECS cluster run :

       docker compose up

- You should see your resources created and the application running. To access the application, simply get the load balancer dns name and use it in browser.

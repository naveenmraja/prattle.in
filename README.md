## [Prattle](http://prattle.in)

[Prattle](http://prattle.in) is an anonymous chat app and a great way to meet new people. Prattle will pick someone random for you and create a private chat session. If you prefer to add your interests, Prattle will look to connect you with someone who shares some of your interests.

| [![gwFSAx.md.png](https://iili.io/gwFSAx.md.png)](https://freeimage.host/i/gwFSAx) |[![gwF89j.md.png](https://iili.io/gwF89j.md.png)](https://freeimage.host/i/gwF89j)  |
|--|--|

**Technologies Used:**

- Node.js (Express)
- React+Redux
- MongoDB
- Redis
- Nginx
- Docker
- Kubernetes

**To run the app in development mode :**

- Register `localhost` domain in Google reCaptcha v3  site [here](https://www.google.com/recaptcha/admin/create) and copy your Site key and Secret key. Create a new file in the project root directory `.env.front.dev` with following content :

      REACT_APP_GOOGLE_SITE_KEY="$YOUR_GOOGLE_SITE_KEY"  

- Create another file  in the project root directory  `.env.backend.dev` with the following content :

      NODE_ENV=development    
      REDIS_URL="redis://redis-dev-server"    
      MONGODB_URL="mongodb://root:example@mongo-dev-server:27017/"    
      GOOGLE_SECRET_KEY="$YOUR_GOOGLE_SECRET_KEY"  

- Run the following command in the root directory to start up the development server :

      docker-compose -f docker-compose.dev.yml up --build

**For Production build and deployment :**


- Create the following files in /k8s directory :

    - **`backend-env-secrets.yml`**

            apiVersion: v1  
            kind: Secret  
            metadata:  
              name: backend-env-secrets  
            type: Opaque  
            stringData:  
              REDIS_URL: "redis://username:password@host:port"  
              MONGODB_URL: "mongodb://username:password@host/"  
              GOOGLE_SECRET_KEY: "$YOUR_GOOGLE_SECRET_KEY"

- Update the image names of `mysecrets-backend` and `nginx` services in `docker-compose.yml` and build the images and push it to your docker repository using the following commands

      docker-compose build --pull
      docker-compose push

- Set your gcloud project id using the following command :

      gcloud config set project $PROJECT_ID

- Generate kubectl config using the following command :

      gcloud container clusters get-credentials $CLUSTER_NAME --zone $ZONE --project $PROJECT_ID

- Create cluster role binding to use ingress-nginx using the following command:

      kubectl create clusterrolebinding cluster-admin-binding \
  	  --clusterrole cluster-admin \
  	  --user $(gcloud config get-value account)

- Install ingress-nginx :

      kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.3.0/deploy/static/provider/cloud/deploy.yaml

- To deploy to gcloud, run the following command from root directory :

      kubectl apply -f ./k8s

- You should see your resources created and the application running. To access the application, simply get the ingress service IP Address and use it in browser.

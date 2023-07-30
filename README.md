# Project CD: Simplifying URL Navigation

![Url-Shortner](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vseaj2mpoktp4rd0b7xm.png)

## About the Project

The opensource self-hostable alternative to [oslash](oslash.com).

You are in charge of your own data, workflow and appearance.

URLs serve as the pathways that lead us to our desired destinations on the internet. However, traditionally, we have had limited control over the routes we take to reach those destinations. With Project CD, we strive to revolutionize URL navigation by making it as effortless as using the "cd" command in a terminal.

## Built with

- [Prisma](prisma.io)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)


## Prerequisite

- Node.js (version 16.18.1)
- yarn (recommended)
- Docker
- MYSQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

- clone the repository:
```
git clone https://github.com/ckmonish2000/docker-services.git
```

-  now go to the project folder

- Configuration:
  1. Create a `.env` file in the root directory and update the environment variables listed 
     below with entries for your Session, MySQL and Redis instance.

```
MYSQL_ROOT_PASSWORD="7596"
MYSQL_DATABASE="cd"
DATABASE_URL="mysql://root:7596@mysql:3306/cd"
REDIS_HOST="redis"
REDIS_PORT="6379"
SESSION_SECRET="M0BjQDRiVXRUJjVzJnY0ekpvTnh0VXV3WjRBNFJic15RSUtrZ0VDVnRQNXJ5WFRzUHQ="
```

## Running with docker 

To run the application using Docker, follow these steps:

- Make sure you have Docker installed and running on your machine.

- To run the application in development mode:
```
cd project-directory
cd docker
docker-compose -f .\docker-compose.dev.yml up
```

- To run the application in production mode:
```
cd project-directory
cd docker
docker-compose -f .\docker-compose.dev.yml -f .\docker-compose.prod.yml up
```



## API Documentation

- Once the application container is running you can access it from http://localhost:3000

- You can access the Swagger API documentation by visiting `/docs/` endpoint.

- For example:
```
Visit: http://localhost:3000/docs/
```

[**Note**: you can also use the postman file provided in the root directory.]

## Metrics

- The application exposes default metrics at port `9100`.
- For Example:
```
Visit: http://localhost:9100
```
[**Note**: You can use this endpoint to configure Prometheus.]
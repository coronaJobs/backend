# Sequelize and Apollo Graphql Dockerized template

## Setup for Development Environment

- create a file named ".env" in the root of this project with this content

```
RDS_USERNAME=postgres
RDS_PASSWORD=postgres
DB_DIALECT=postgres
RDS_DB_NAME=postgres
RDS_PORT=5432
RDS_HOSTNAME=database
DB_LOGGING=1
APP_PORT=8080
PLAYGROUND=1
```

- create a file named ".db.env" in the root of this project with this content

```
POSTGRES_PASSWORD=postgres
```

- `npm install`
- `sudo docker-compose build`
- `sudo docker-compose run --rm app sequelize db:migrate`
- `sudo docker-compose run --rm app sequelize db:seed:all`
- `sudo docker-compose up`

## Try it! :fire:
Go to http://localhost:8080/

Use this in the playground

```
mutation createMessage {
    createMessage(data: "hello world") {
        data
    }
}
```

```
{
    getMessages {
        data
    }
}
```



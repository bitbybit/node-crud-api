# CRUD API

## Preparations

### Install dependencies

```
npm ci
```

### Set port in `.env` file

```
PORT=4000
```

## Run

### Prod

```
npm run start:prod
```

### Dev

```
npm run start:dev
```

### Cluster

```
npm run start:multi
```

### Tests

```
npm run test
```

## Endpoints

### Get users

```
curl --location --request GET 'http://localhost:4000/api/users'
```

### Get user

```
curl --location --request GET 'http://localhost:4000/api/users/64f0c7b1-2738-42fb-b5d6-7897c3f11935'
```

### Create user

```
curl --location 'http://localhost:4000/api/users' \
--header 'Content-Type: application/json' \
--data '{
    "age": 21,
    "hobbies": ["a", "b"],
    "username": "John"
}'
```

### Update user

```
curl --location --request PUT 'http://localhost:4000/api/users/64f0c7b1-2738-42fb-b5d6-7897c3f11935' \
--header 'Content-Type: application/json' \
--data '{
    "age": 22,
    "hobbies": ["a", "b", "c"],
    "username": "John"
}'
```

### Delete user

```
curl --location --request DELETE 'http://localhost:4000/api/users/64f0c7b1-2738-42fb-b5d6-7897c3f11935'
```

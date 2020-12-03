# basic-query-generator

## Requirements
To build and run this app you just need [Node.js LTS](https://nodejs.org/en/) installed.

OR

Docker and Docker Compose

## Getting started
- Clone the repository
```
git clone --depth=1 https://github.com/MarcosSpessatto/basic-query-generator
```
- Server
```
Copy .env.template to a new file named .env
Define your environment variables according to your needs
Install dependencies with "npm install"
Run the server with "npm run dev"
```

## Run (development)
```
npm run dev
```

### Watch
```
npm run watch
```

## Run (build)

```
npm run build
npm start
```

## Run (Docker)
```
docker-compose up
```

## Test

```
npm run test
```
### Test watch
```
npm run watch-test
```

## Lint
```
npm run lint
```

## Entrypoints

### REST (POST)
```
{{serverUrl}}/query-generator/document-based/generateUpdateStatement

{
  "document": {}, // See tests for more information about the payload
  "mutation": {}
}

curl -H "Content-type:application/json" \
     http://localhost:3000/query-generator/document-based/generateUpdateStatement \
     -d '{ "document": {}, "mutation": {} }'
```

## Improvements

* Better input validation
* Reduce the code complexity for the traverse function
* Support other entrypoints (e.g CLI)
* Support more commands
* Generate queries for other DBMS tools

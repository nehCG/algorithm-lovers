# Instruction before contributing

### Install Node.js

[Node.js](https://nodejs.org/en)

### Add a default.json file in config folder with the following

```json
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
  "githubToken": "<yoursecrectaccesstoken>"
}
```

### Install server dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd client
npm install
```

# To do before opening a PR

### Please add tests for any new features under tests folder

### Debug workflows
```bash
npm run build
npm run lint
npm run test
```

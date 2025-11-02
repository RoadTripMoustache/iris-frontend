# Iris Frontend

![Iris logo](./docs/logo.png)

![Docker Image Version](https://img.shields.io/docker/v/roadtripmoustache/iris-front?sort=semver)
[![GitHub stars](https://img.shields.io/github/stars/RoadTripMoustache/iris-front?style=social)](https://github.com/RoadTripMoustache/iris-front/stargazers)

**Iris Front** provides a VueJs/Nuxt interface to create, retrieve, and manage ideas, votes, and comments from users.
It powers the feedback system of Iris, enabling efficient collection of bug reports and feature requests directly from your user base.

---

This repository contains the VueJs code for the Iris Front application.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Configuration

Two json configurations files are required:
- `config.json`
- `firebase-config.json`

### config.json
```json
{
  "apiBaseUrl": "Mandatory - Base url of the Iris API",
  "appTitle": "Optional - App title to display instead of the default one",
  "appLoginTitle": "Optional - Login title to display instead of the default one",
  "appIcon": "Optional - App icon to display instead of the default one"
}
```

### firebase-config.json
```json
{
  "apiKey": "Mandatory - Firebase API key",
  "authDomain": "Mandatory - Firebase Auth domain",
  "databaseURL": "Mandatory - Firebase database URL",
  "projectId": "Mandatory - Firebase project ID",
  "storageBucket": "Mandatory - Firebase storage bucket",
  "messagingSenderId": "Mandatory - Firebase messaging sender ID",
  "appId": "Mandatory - Firebase app ID"
}
```

---

## Start locally

To start the application locally, run the application with docker.

```cmd
docker run -d \
  --name iris_front \
  --restart always \
  -p 9105:3000 \
  -v "$(pwd)/firebase-config.json:/app/server/files/firebase-config.json:ro" \
  -v "$(pwd)/config.json:/app/server/files/config.json:ro" \
  --label name=iris_front \
  roadtripmoustache/iris-front:latest
```
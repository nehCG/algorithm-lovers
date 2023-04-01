# Algorithm-lovers
A web platform to share and discuss algorithms.

[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/nehCG/algorithm-lovers/blob/main/LICENSE)

[![Build Status](https://github.com/nehCG/algorithm-lovers/workflows/Build%20Status/badge.svg?branch=main)](https://github.com/nehCG/algorithm-lovers/actions?query=workflow%3A%22Build+Status%22)
[![codecov](https://codecov.io/gh/nehCG/algorithm-lovers/branch/main/graph/badge.svg)](https://codecov.io/gh/nehCG/algorithm-lovers)

## Overview
Algorithm is a topic that everyone who studies computer science cannot avoid. 
When I first learned algorithms, greedy, divide and conquer, and dynamic 
programming all made me miserable. However, I gradually became addicted to them. 
Especially when I apply the learned algorithms to my own projects, the echo of 
theory and practice makes my interest in algorithms soar. I am participating 
in competitive programming this semester. After being exposed to many novel 
problems in the contest, I wrote some novel algorithms. 

I plan to build a web platform that

1. Shares the algorithms I created to more people who love algorithms.
2. Creates a community where you can discuss algorithms and share opinions.

# Instruction to run the program

## Install Node.js

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

### Run both Express & React from root

```bash
npm run dev
```

### Build for production

```bash
cd src
npm run server
```
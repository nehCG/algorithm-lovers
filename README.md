# Algorithm-lovers
A web platform to share and discuss algorithms.

[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/nehCG/algorithm-lovers/blob/main/LICENSE)
[![Build Status](https://github.com/nehCG/algorithm-lovers/workflows/Build%20Status/badge.svg?branch=main)](https://github.com/nehCG/algorithm-lovers/actions?query=workflow%3A%22Build+Status%22)
[![codecov](https://codecov.io/gh/nehCG/algorithm-lovers/branch/main/graph/badge.svg)](https://codecov.io/gh/nehCG/algorithm-lovers)
[![npm](https://img.shields.io/npm/v/algorithm-lovers)](https://www.npmjs.com/package/algorithm-lovers)
[![Github Pages](https://img.shields.io/badge/Github-Pages-blue)](https://nehcg.github.io/algorithm-lovers/)

## Overview
Algorithm is a topic that everyone who studies computer science cannot avoid. 
When I first learned algorithms, greedy, divide and conquer, and dynamic 
programming all made me miserable. However, I gradually became addicted to them. 
Especially when I apply the learned algorithms to my own projects, the echo of 
theory and practice makes my interest in algorithms soar. I am participating 
in competitive programming this semester. After being exposed to many novel 
problems in the contest, I wrote some novel algorithms. 

Therefore, I build a web platform that:

1. Shares the algorithms I created to more people who love algorithms.
2. Creates a community where you can discuss algorithms and share opinions.

# Instruction to run the program

### Install Node.js

[Node.js](https://nodejs.org/en)

### Add a default.json file in config folder with the following

```json
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
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

### Run the web platform locally from root

```bash
npm run dev
```

# Instructions on how to use the application

After you run the web platform locally, the web application will launch on your ```localhost:3000```. It is very similar to the usual social network, with features such as registration, login, browsing, posting, etc.

##  Functionalites and APIs

### CREATE
- ```api/auth```
- ```api/posts```
- ```api/posts/comment/:id```
- ```api/profile```
- ```api/users```

### READ
- ```api/auth```
- ```api/profile/me```
- ```api/posts```
- ```api/posts/:id```
- ```api/profile```
- ```api/profile/user/:user_id```

### UPDATE
- ```api/posts/like/:id```
- ```api/posts/unlike/:id```
- ```api/profile/experience```
- ```api/profile/education```

### DELETE
- ```api/posts/:id```
- ```/comment/:id/:comment_id```
- ```api/profile```
- ```api/profile/experience/:exp_id```
- ```api/profile/education/:edu_id```

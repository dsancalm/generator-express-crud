# generator-express-crud

A NPX tool that allows to the developer to deploy fast TypeScript backend apps only passing a few arguments:

 - Backend port
 - Mongo URL Database || Docker Mongo Database
 - Entity model in YAML format

## Stack

 - ExpressJS
 - Swagger
 - Typescript 4
 - Tsoa
 - Mongoose
 - Docker





## Installation and execution example

Steps to reproduce:

 1. Create test folder
 2. Execute `npm i generator-express-crud`
 3. Execute `npx express-crud`
 4. Generate Swagger API documentation and running it by execution `npm run dev`

```Bash
-@Mac-Mini-M1 testFolder % npm i generator-express-crud

up to date, audited 454 packages in 670ms

51 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
-@Mac-Mini-M1 testFolder % npx express-crud            

     _-----_     
    |       |    
    |--(o)--|    ╭──────────────────────────╮
   `---------´   │  generator-express-crud  │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? Insert you model .yaml filename that contains your data model business:  model.yaml
? Insert the port where you want to startup your app:  8080
? Insert your URL MongoDB database:  mongodb://mongo:dBIuBRCsFztpbBLdGpX5@containers-us-west-67.railway.app:6754
Documentation API Generated via Swagger
You can check it by executing 'npm run dev' and checking http://localhost:8080/docs
 conflict package.json
? Overwrite package.json? overwrite
    force package.json
   create src/database.ts
   create tsconfig.json
   create tsconfig-build.json
   create tsoa.json
   create nodemon.json
   create src/ioc/ioc.ts
   create src/dao/repository/AlumnoRepository.ts

Changes to package.json were detected.

Running npm install for you to install the required dependencies.
   create src/interfaces/dao/IAlumnoDao.ts
   create src/dao/AlumnoDaoImpl.ts
   create src/models/entities/Alumno.ts
   create src/interfaces/service/IAlumnoService.ts
   create src/service/AlumnoServiceImpl.ts
   create src/controllers/Alumno/AlumnoController.ts
   create src/dao/repository/ProfesorRepository.ts
   create src/interfaces/dao/IProfesorDao.ts
   create src/dao/ProfesorDaoImpl.ts
   create src/models/entities/Profesor.ts
   create src/interfaces/service/IProfesorService.ts
   create src/service/ProfesorServiceImpl.ts
   create src/controllers/Profesor/ProfesorController.ts
   create src/common/exception/DaoError.ts
   create src/common/exception/ServiceError.ts
   create src/index.ts

added 604 packages, removed 328 packages, and audited 730 packages in 41s

101 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
-@Mac-Mini-M1 testFolder % npm run dev

> backend@1.0.0 dev
> npm run generate && ./node_modules/nodemon/bin/nodemon.js


> backend@1.0.0 generate
> tsoa routes && tsoa swagger

[nodemon] 2.0.19
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts
[nodemon] starting `npm start`

> backend@1.0.0 prestart
> npm run build


> backend@1.0.0 build
> npm run clean && tsc -p tsconfig-build.json


> backend@1.0.0 clean
> rm -rf dist


> backend@1.0.0 start
> node ./dist

connecting to database
connected to database
Server started at http://localhost:8080
```
  ### Example entity model in YAML format
```YAML
Alumno:
 nombre: String
 apellidos: String
 edad: Number
 nota: Number
Profesor:
 nombre: String
 apellidos: String
 edad: Number
```
## NPM Package
You can check this package too in [NPMJS](https://www.npmjs.com/package/generator-express-crud  "npm")
  



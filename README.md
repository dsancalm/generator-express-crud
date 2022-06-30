# generator-express-crud
 A NPX tool that allows to the developer to deploy fast backend apps only passing a few arguments, like the port, url database or entity model in yaml format
 
Execution example:
```Bash
mkdir test
cd test
npm i generator-express-crud
npm i yeoman-environment
npx express-crud
-@Mac-Mini-M1 test % npx express-crud           

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to the prime   │
    |--(o)--|    │  generator-express-crud  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? Introduce el nombre del fichero .yaml que contiene el modelo de datos de todas tus entidades model.yaml
? Introduce el puerto por el que quieres que arranque tu app 8080
? Introduce la url de tu base de datos MongoDB mongourl
 conflict package.json
? Overwrite package.json? overwrite
    force package.json
   create src/database.ts
   create tsconfig.json
   create tsconfig-build.json
   create src/dao/repository/PersonaRepository.ts
   create src/interfaces/dao/IPersonaDao.ts
   create src/dao/PersonaDaoImpl.ts

Changes to package.json were detected.

Running npm install for you to install the required dependencies.
   create src/models/entities/Persona.ts
   create src/interfaces/service/IPersonaService.ts
   create src/service/PersonaServiceImpl.ts
   create src/controllers/Persona/PersonaController.ts
   create src/controllers/Persona/PersonaRouter.ts
   create src/index.ts

added 515 packages, removed 332 packages, and audited 631 packages in 26s

61 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Model.yaml to generate your app example:
```YAML

Perro:
  nombre : String
  raza: String
  edad: Number
  peso: String
Alumno: 
  nombre : String
  apellidos: String
  edad: Number
  nota: Number
Profesor: 
  nombre : String
  apellidos: String
  edad: Number
```

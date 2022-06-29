"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const yaml = require("js-yaml");

module.exports = class extends Generator {
  async prompting() {
    this.log(
      yosay(
        `Welcome to the prime ${chalk.red("generator-express-crud")} generator!`
      )
    );

    this.model = await this.prompt([
      {
        type: "input",
        name: "modelFile",
        message:
          "Introduce el nombre del fichero .yaml que contiene el modelo de datos de tu entidad"
      }
    ]);
    this.appConfig = await this.prompt([
      {
        type: "input",
        name: "port",
        message: "Introduce el puerto por el que quieres que arranque tu app"
      },
      {
        type: "input",
        name: "mongoUrl",
        when: !this.fs.exists(this.destinationPath("src/database.ts")),
        message: "Introduce la url de tu base de datos MongoDB",
        default:
          "mongodb://mongo:dBIuBRCsFztpbBLdGpX5@containers-us-west-67.railway.app:6754"
      }
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("tsconfig.json.txt"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copyTpl(
      this.templatePath("package.json.txt"),
      this.destinationPath("package.json")
    );
    this.fs.copyTpl(
      this.templatePath("tsconfig-build.json.txt"),
      this.destinationPath("tsconfig-build.json")
    );
    var modelRouter = "";
    var importRouter = "";
    try {
      const doc = yaml.load(this.fs.read(this.model.modelFile));
      console.log(doc);
      var entitiesToCreate = Object.keys(doc);
      entitiesToCreate.forEach(entity => {
        var entityKeys = Object.keys(doc[entity]);
        var modelBodyEntity = "";
        var modelFieldsMongoSchema = "";
        modelRouter +=
          "app.use('/api', " + entity.toLowerCase() + "Router); \n";
        importRouter +=
          "import { " +
          entity.toLowerCase() +
          "Router } from '@controllers/" +
          entity +
          "/" +
          entity +
          "Router'; \n";
        entityKeys.forEach(key => {
          modelBodyEntity +=
            key + ": " + doc[entity][key].toLowerCase() + "; \n";
          modelFieldsMongoSchema += key + ": {";
          modelFieldsMongoSchema += "type: " + doc[entity][key] + ",";
          modelFieldsMongoSchema += "required: false";
          modelFieldsMongoSchema += "}, ";
        });
        var modelNameFile = entity;
        console.log(modelBodyEntity);
        console.log(modelFieldsMongoSchema);
        this.fs.copyTpl(
          this.templatePath("dao/repository/Repository.ejs"),
          this.destinationPath(
            "src/dao/repository/" + modelNameFile + "Repository.ts"
          ),
          {
            modelName: entity,
            modelFields: modelFieldsMongoSchema,
            modelVar: entity.toLowerCase()
          }
        );
        this.fs.copyTpl(
          this.templatePath("interfaces/dao/Dao.ejs"),
          this.destinationPath(
            "src/interfaces/dao/I" + modelNameFile + "Dao.ts"
          ),
          {
            modelName: entity,
            modelVar: entity.toLowerCase()
          }
        );

        this.fs.copyTpl(
          this.templatePath("dao/DaoImpl.ejs"),
          this.destinationPath("src/dao/" + modelNameFile + "DaoImpl.ts"),
          {
            modelName: entity,
            modelVar: entity.toLowerCase()
          }
        );
        this.fs.copyTpl(
          this.templatePath("models/entities/Model.ejs"),
          this.destinationPath("src/models/entities/" + modelNameFile + ".ts"),
          {
            modelName: entity,
            modelBody: modelBodyEntity
          }
        );
        this.fs.copyTpl(
          this.templatePath("interfaces/service/Service.ejs"),
          this.destinationPath(
            "src/interfaces/service/I" + modelNameFile + "Service.ts"
          ),
          {
            modelName: entity,
            modelVar: entity.toLowerCase()
          }
        );
        this.fs.copyTpl(
          this.templatePath("service/ServiceImpl.ejs"),
          this.destinationPath(
            "src/service/" + modelNameFile + "ServiceImpl.ts"
          ),
          {
            modelName: entity,
            modelVar: entity.toLowerCase()
          }
        );

        this.fs.copyTpl(
          this.templatePath("controllers/controller.ejs"),
          this.destinationPath(
            "src/controllers/" +
              modelNameFile +
              "/" +
              modelNameFile +
              "Controller.ts"
          ),
          {
            modelName: entity,
            modelVar: entity.toLowerCase()
          }
        );

        this.fs.copyTpl(
          this.templatePath("controllers/router.ejs"),
          this.destinationPath(
            "src/controllers/" +
              modelNameFile +
              "/" +
              modelNameFile +
              "Router.ts"
          ),
          {
            modelName: entity,
            modelVar: entity.toLowerCase()
          }
        );
      });
    } catch (e) {
      console.log(e);
    }

    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath("src/index.ts"),
      {
        port: this.appConfig.port,
        modelRouter: modelRouter,
        importRouter: importRouter
      }
    );

    if (!this.fs.exists(this.destinationPath("src/database.ts"))) {
      this.fs.copyTpl(
        this.templatePath("database.ejs"),
        this.destinationPath("src/database.ts"),
        {
          mongoUrl: this.appConfig.mongoUrl
        }
      );
    }
  }
};

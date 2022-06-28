"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
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
        name: "modelName",
        message: "Introduce el nombre de la entidad a generar"
      },
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
        message: "Introduce la url de tu base de datos MongoDB",
        default:
          "mongodb://mongo:dBIuBRCsFztpbBLdGpX5@containers-us-west-67.railway.app:6754"
      }
    ]);
  }

  writing() {
    const modelBodyYaml = this.fs.read(this.model.modelFile);
    const arrayKeysTypes = modelBodyYaml.split(";");
    var modelFieldsMongoSchema = "";
    arrayKeysTypes.filter(Boolean).forEach(line => {
      let keyValue = line.split(":");
      let key = keyValue[0];
      let value = keyValue[1];
      modelFieldsMongoSchema += key + ": {";
      modelFieldsMongoSchema += "type: " + value + ",";
      modelFieldsMongoSchema += "required: false";
      modelFieldsMongoSchema += "}, ";
    });
    var modelNameFile = this.model.modelName;
    this.fs.copyTpl(
      this.templatePath("tsconfig.json.txt"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copyTpl(
      this.templatePath("package.json.txt"),
      this.destinationPath("package.json")
    );
    this.fs.copyTpl(
      this.templatePath("dao/repository/Repository.ejs"),
      this.destinationPath(
        "src/dao/repository/" + modelNameFile + "Repository.ts"
      ),
      {
        modelName: this.model.modelName,
        modelFields: modelFieldsMongoSchema,
        modelVar: this.model.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("interfaces/dao/Dao.ejs"),
      this.destinationPath("src/interfaces/dao/I" + modelNameFile + "Dao.ts"),
      {
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
      }
    );

    this.fs.copyTpl(
      this.templatePath("dao/DaoImpl.ejs"),
      this.destinationPath("src/dao/" + modelNameFile + "DaoImpl.ts"),
      {
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("models/entities/Model.ejs"),
      this.destinationPath("src/models/entities/" + modelNameFile + ".ts"),
      {
        modelName: this.model.modelName,
        modelBody: modelBodyYaml
      }
    );
    this.fs.copyTpl(
      this.templatePath("interfaces/service/Service.ejs"),
      this.destinationPath(
        "src/interfaces/service/I" + modelNameFile + "Service.ts"
      ),
      {
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("service/ServiceImpl.ejs"),
      this.destinationPath("src/service/" + modelNameFile + "ServiceImpl.ts"),
      {
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
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
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
      }
    );

    this.fs.copyTpl(
      this.templatePath("controllers/router.ejs"),
      this.destinationPath(
        "src/controllers/" + modelNameFile + "/" + modelNameFile + "Router.ts"
      ),
      {
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath("src/index.ts"),
      {
        port: this.appConfig.port,
        mongoUrl: this.appConfig.mongoUrl,
        modelName: this.model.modelName,
        modelVar: this.model.modelName.toLowerCase()
      }
    );
  }
};

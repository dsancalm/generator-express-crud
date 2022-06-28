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
        message: "Your model name"
      },
      {
        type: "input",
        name: "modelFields",
        message: "Your model body"
      }
    ]);
    this.appConfig = await this.prompt([
      {
        type: "input",
        name: "port",
        message: "Your app port"
      },
      {
        type: "input",
        name: "mongoUrl",
        message: "Your mongo url database"
      }
    ]);
  }

  writing() {
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
        modelFields: this.model.modelFields,
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
        modelName: this.model.modelName
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

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

    this.answers = await this.prompt([
      {
        type: "input",
        name: "modelName",
        message: "Your model name"
      },
      {
        type: "input",
        name: "modelFields",
        message: "Your model body"
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);
  }

  writing() {
    var modelNameFile = this.answers.modelName;
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
        modelName: this.answers.modelName,
        modelFields: this.answers.modelFields,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("interfaces/dao/Dao.ejs"),
      this.destinationPath("src/interfaces/dao/I" + modelNameFile + "Dao.ts"),
      {
        modelName: this.answers.modelName,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );

    this.fs.copyTpl(
      this.templatePath("dao/DaoImpl.ejs"),
      this.destinationPath("src/dao/" + modelNameFile + "DaoImpl.ts"),
      {
        modelName: this.answers.modelName,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("models/entities/Model.ejs"),
      this.destinationPath("src/models/entities/I" + modelNameFile + ".ts"),
      {
        modelName: this.answers.modelName
      }
    );
    this.fs.copyTpl(
      this.templatePath("interfaces/service/Service.ejs"),
      this.destinationPath(
        "src/interfaces/service/I" + modelNameFile + "Service.ts"
      ),
      {
        modelName: this.answers.modelName,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("service/ServiceImpl.ejs"),
      this.destinationPath("src/service/" + modelNameFile + "ServiceImpl.ts"),
      {
        modelName: this.answers.modelName,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );
  }
};

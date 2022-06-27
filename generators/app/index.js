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
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json")
    );
    this.fs.copyTpl(
      this.templatePath("dao/repository/Repository.ts"),
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
      this.templatePath("interfaces/dao/Dao.ts"),
      this.destinationPath("src/interfaces/dao/I" + modelNameFile + "Dao.ts"),
      {
        modelName: this.answers.modelName,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );

    this.fs.copyTpl(
      this.templatePath("dao/DaoImpl.ts"),
      this.destinationPath("src/dao/" + modelNameFile + "DaoImpl.ts"),
      {
        modelName: this.answers.modelName,
        modelVar: this.answers.modelName.toLowerCase()
      }
    );
    this.fs.copyTpl(
      this.templatePath("models/entities/Model.ts"),
      this.destinationPath("src/models/entities/" + modelNameFile + ".ts"),
      {
        modelName: this.answers.modelName
      }
    );
  }
};

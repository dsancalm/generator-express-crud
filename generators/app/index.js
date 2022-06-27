"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the prime ${chalk.red("generator-express-crud")} generator!`
      )
    );

    const prompts = [
      {
        type: "confirm",
        name: "someAnswer",
        message: "Would you like to enable this option?",
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json")
    );
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json")
    );
  }
};

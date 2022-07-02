/* eslint-disable prettier/prettier */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const yaml = require("js-yaml");
const primitives = [
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
];


module.exports = class expressCrud extends Generator {
  async prompting() {
    this.log(yosay(`${chalk.red("generator-express-crud")}`));

    this.model = await this.prompt([
      {
        type: "input",
        name: "modelFile",
        message:
          "Insert you model .yaml filename that contains your data model business: ",
        default: "model.yaml"
      }
    ]);
    this.appConfig = await this.prompt([
      {
        type: "input",
        name: "port",
        message: "Insert the port where you want to startup your app: ",
        default: 8080
      },
      {
        type: "input",
        name: "mongoUrl",
        when: !this.fs.exists(this.destinationPath("src/database.ts")),
        message: "Insert your URL MongoDB database: ",
        default: "mongodb://mongo:*****@default:6754/"
      }
    ]);
  }

  // Validate model
  beforeWriting() {
    if (!this.fs.exists(this.model.modelFile)) {
      throw new ReferenceError("File " + this.model.modelFile + " not exist");
    }

    // Read the yaml model file
    const doc = yaml.load(this.fs.read(this.model.modelFile));

    // Check if exists keys
    let keys = Object.keys(doc);
    if (keys.length === 0) {
      throw new SyntaxError(
        "File " + this.model.modelFile + " not have any keys defined"
      );
    }

    // Check for each key
    keys.forEach(key => {
      // Check the if exists at least 1 child key
      let childKeys = Object.keys(doc[key]);
      if (childKeys.length === 0) {
        throw new SyntaxError(
          "File " + this.model.modelFile + " not have any childKeys defined"
        );
      }

      // For each childKey check...
      childKeys.forEach(childKey => {

        // The type of child key is string (Not a number, not a symbol, not a complex type...)
        if (typeof doc[key][childKey] !== "string") {
          throw new SyntaxError(
            "File " + this.model.modelFile + " has childKeys with complex types"
          );
        }


        const containsString = primitives.some(element => {
          return element.toLowerCase() === doc[key][childKey].toLowerCase();
        });
        // Check if child key is a primitive
        if (!containsString) {
          throw new SyntaxError(
            "File " +
              this.model.modelFile +
              " has childKeys value with unknown primitive types"
          );
        }
      });
    });
  }

  writing() {
    // Set the root folder
    this.sourceRoot(
      "node_modules/generator-express-crud/generators/app/templates/"
    );

    // Copy ts standard config
    this.fs.copyTpl(
      this.templatePath("tsconfig.json.txt"),
      this.destinationPath("tsconfig.json")
    );
    // Copy package standard config
    this.fs.copyTpl(
      this.templatePath("package.json.txt"),
      this.destinationPath("package.json")
    );
    // Copy ts standard  build config
    this.fs.copyTpl(
      this.templatePath("tsconfig-build.json.txt"),
      this.destinationPath("tsconfig-build.json")
    );

    // Setup the variable which will contain all the routers for all entities defined
    let modelRouter = "";
    // Setup the variable which will contain all the imports needed for all entities defined
    let importRouter = "";

    // Read the yaml model file
    const doc = yaml.load(this.fs.read(this.model.modelFile));
    // Setup the entities to create
    let entitiesToCreate = Object.keys(doc);
    // For each entity, we have to copy and construct the templates
    entitiesToCreate.forEach(entity => {
      // Get entity attributes
      let entityAttributes = Object.keys(doc[entity]);
      // Setup the entity body
      let modelBodyEntity = "";
      // Setup the schema mongo body
      let modelFieldsMongoSchema = "";

      modelRouter +=
        "app.use('/" +
        entity.toLowerCase() +
        "', " +
        entity.toLowerCase() +
        "Router); \n";

      importRouter +=
        "import { " +
        entity.toLowerCase() +
        "Router } from '@controllers/" +
        entity +
        "/" +
        entity +
        "Router'; \n";

      // For each attribute, construct the entity + mongo schema
      entityAttributes.forEach(key => {
        modelBodyEntity +=
          key + ": " + doc[entity][key].toLowerCase() + "; \n\t";
        modelFieldsMongoSchema += key + ": {";
        modelFieldsMongoSchema += "type: " + doc[entity][key] + ",";
        modelFieldsMongoSchema += "required: false";
        modelFieldsMongoSchema += "}, \n\t";
      });

      // Entity name file
      let modelNameFile = entity;

      // Copy repository template and replace
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
      // Copy dao interface template and replace
      this.fs.copyTpl(
        this.templatePath("interfaces/dao/Dao.ejs"),
        this.destinationPath("src/interfaces/dao/I" + modelNameFile + "Dao.ts"),
        {
          modelName: entity,
          modelVar: entity.toLowerCase()
        }
      );

      // Copy dao implementation template and replace
      this.fs.copyTpl(
        this.templatePath("dao/DaoImpl.ejs"),
        this.destinationPath("src/dao/" + modelNameFile + "DaoImpl.ts"),
        {
          modelName: entity,
          modelVar: entity.toLowerCase()
        }
      );
      // Copy model template and replace
      this.fs.copyTpl(
        this.templatePath("models/entities/Model.ejs"),
        this.destinationPath("src/models/entities/" + modelNameFile + ".ts"),
        {
          modelName: entity,
          modelBody: modelBodyEntity
        }
      );
      // Copy service interface template and replace
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
      // Copy service implementation template and replace
      this.fs.copyTpl(
        this.templatePath("service/ServiceImpl.ejs"),
        this.destinationPath("src/service/" + modelNameFile + "ServiceImpl.ts"),
        {
          modelName: entity,
          modelVar: entity.toLowerCase()
        }
      );
      // Copy repository implementation template and replace
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

      // Copy router implementation template and replace
      this.fs.copyTpl(
        this.templatePath("controllers/router.ejs"),
        this.destinationPath(
          "src/controllers/" + modelNameFile + "/" + modelNameFile + "Router.ts"
        ),
        {
          modelName: entity,
          modelVar: entity.toLowerCase()
        }
      );
    });
    // Copy main index
    this.fs.copyTpl(
      this.templatePath("index.ejs"),
      this.destinationPath("src/index.ts"),
      {
        port: this.appConfig.port,
        modelRouter: modelRouter,
        importRouter: importRouter
      }
    );

    // Copy database if not exists
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

  afterWriting() {
    console.log("API Generated: \n");
    // Read the yaml model file
    const doc = yaml.load(this.fs.read(this.model.modelFile));
    // Setup the entities to create
    let entitiesToCreate = Object.keys(doc);
    // For each entity, we have to copy and construct the templates
    entitiesToCreate.forEach(entity => {
      console.log("Entity: " + entity);
      console.log(
        "http://localhost:" +
          this.appConfig.port +
          "/" +
          entity.toLowerCase() +
          "/save"
      );
      console.log(
        "http://localhost:" +
          this.appConfig.port +
          "/" +
          entity.toLowerCase() +
          "/getById"
      );
      console.log(
        "http://localhost:" +
          this.appConfig.port +
          "/" +
          entity.toLowerCase() +
          "/getAll"
      );
      console.log(
        "http://localhost:" +
          this.appConfig.port +
          "/" +
          entity.toLowerCase() +
          "/deleteById"
      );
      console.log(
        "http://localhost:" +
          this.appConfig.port +
          "/" +
          entity.toLowerCase() +
          "/update \n"
      );
    });
  }
};

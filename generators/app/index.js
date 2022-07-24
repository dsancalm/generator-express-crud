/* eslint-disable no-unused-expressions */
/* eslint-disable no-negated-condition */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const yaml = require("js-yaml");
const fs = require("fs");
const validate = require("./validate");
const exec = require("./terminal");

module.exports = class expressCrud extends Generator {
  async initializing() {
    this.log(yosay(`${chalk.red("generator-express-crud")}`));
    this.sourceRoot(
      "node_modules/generator-express-crud/generators/app/templates/"
    );

    const installed = fs.existsSync(this.templatePath());

    if (!installed) {
      this.installation = await this.prompt([
        {
          type: "confirm",
          name: "install",
          message:
            "Seems that you dont have installed generator-express-crud, do you want to install it ? :",
          default: true
        }
      ]);

      if (this.installation.install) {
        this.devMode = await this.prompt([
          {
            type: "confirm",
            name: "install",
            message: "In dev mode (npm link) ? :",
            default: true
          }
        ]);

        this.devMode.install
          ? await exec("npm link generator-express-crud")
          : await exec("npm install generator-express-crud");
      } else {
        this.log(
          "You need to have generator-express-crud installed in order to properly work!"
        );
        process.exit(1);
      }
    }
  }

  async prompting() {
    this.model = await this.prompt([
      {
        type: "input",
        name: "modelFile",
        message:
          "Insert you model .yaml filename inside the source folder that contains your data model business\n If no model found it will be a default test model: ",
        default: "model.yaml"
      }
    ]);

    this.appConfig = await this.prompt([
      {
        type: "input",
        name: "port",
        message: "Insert the port where you want to startup your app: ",
        default: 8080
      }
    ]);

    this.database = await this.prompt([
      {
        type: "list",
        name: "type",
        message: "How do you want to create your database? : ",
        choices: [
          {
            name: "None",
            value: "none"
          },
          {
            name: "I already have a database ( specify port later )",
            value: "port"
          },
          {
            name: "Create with Docker",
            value: "docker"
          },
          {
            name: "Online database",
            value: "online"
          }
        ],
        default: 0
      }
    ]);

    if (this.database.type === "online") {
      this.databaseConfig = await this.prompt([
        {
          type: "input",
          name: "mongoUrl",
          when: !this.fs.exists(this.destinationPath("src/database.ts")),
          message: "Insert your URL MongoDB database: ",
          default: "mongodb://mongo:*****@default:6754/"
        }
      ]);
    }

    if (this.database.type === "port") {
      this.databaseConfig = await this.prompt([
        {
          type: "input",
          name: "port",
          message: "Insert your MongoDB port on localhost: ",
          default: 27017
        }
      ]);
    }
  }

  validating() {
    let doc;
    if (!this.fs.exists(this.model.modelFile)) {
      this.log("No model found, creating test model: ");
      const route = this.templatePath("model.yaml");
      doc = yaml.load(this.fs.read(route));
      this.model.modelFile = route;
      this.log(doc);
    } else {
      doc = yaml.load(this.fs.read(this.model.modelFile));
    }

    // Creating a validated model file
    validate(this.model.modelFile, doc);
  }

  writing() {
    // Copy ts standard config
    this.fs.copyTplAsync(
      this.templatePath("tsconfig.json.txt"),
      this.destinationPath("tsconfig.json")
    );
    // Copy package standard config
    this.fs.copyTplAsync(
      this.templatePath("package.json.txt"),
      this.destinationPath("package.json")
    );
    // Copy ts standard  build config
    this.fs.copyTplAsync(
      this.templatePath("tsconfig-build.json.txt"),
      this.destinationPath("tsconfig-build.json")
    );
    // Copy tsoa standard  build config
    this.fs.copyTplAsync(
      this.templatePath("tsoa.json.txt"),
      this.destinationPath("tsoa.json")
    );

    // Copy nodemon standard  build config
    this.fs.copyTplAsync(
      this.templatePath("nodemon.json.txt"),
      this.destinationPath("nodemon.json")
    );

    // Copy ioc config
    this.fs.copyTplAsync(
      this.templatePath("ioc/ioc.ts"),
      this.destinationPath("src/ioc/ioc.ts")
    );

    // Setup the variable which will contain all the imports needed for all entities defined
    let importController = "";

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

      importController +=
        "import '@controllers/" + entity + "/" + entity + "Controller'; \n";

      // For each attribute, construct the entity + mongo schema
      entityAttributes.forEach(key => {
        modelBodyEntity +=
          key + "?: " + doc[entity][key].toLowerCase() + "; \n\t";
        modelFieldsMongoSchema += key + ": {";
        modelFieldsMongoSchema += "type: " + doc[entity][key] + ",";
        modelFieldsMongoSchema += "required: false";
        modelFieldsMongoSchema += "}, \n\t";
      });

      // Entity name file
      let modelNameFile = entity;

      // Copy repository template and replace
      this.fs.copyTplAsync(
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
      this.fs.copyTplAsync(
        this.templatePath("dao/DaoImpl.ejs"),
        this.destinationPath("src/dao/" + modelNameFile + "DaoImpl.ts"),
        {
          modelName: entity,
          modelVar: entity.toLowerCase()
        }
      );
      // Copy model template and replace
      this.fs.copyTplAsync(
        this.templatePath("models/entities/Model.ejs"),
        this.destinationPath("src/models/entities/" + modelNameFile + ".ts"),
        {
          modelName: entity,
          modelBody: modelBodyEntity
        }
      );
      // Copy service interface template and replace
      this.fs.copyTplAsync(
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
      this.fs.copyTplAsync(
        this.templatePath("service/ServiceImpl.ejs"),
        this.destinationPath("src/service/" + modelNameFile + "ServiceImpl.ts"),
        {
          modelName: entity,
          modelVar: entity.toLowerCase()
        }
      );
      // Copy repository implementation template and replace
      this.fs.copyTplAsync(
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
    });

    // Copy standard exception classes
    this.fs.copyTplAsync(
      this.templatePath("common/exception/DaoError.ejs"),
      this.destinationPath("src/common/exception/DaoError.ts")
    );

    this.fs.copyTplAsync(
      this.templatePath("common/exception/ServiceError.ejs"),
      this.destinationPath("src/common/exception/ServiceError.ts")
    );

    // Copy main index
    this.fs.copyTplAsync(
      this.templatePath("index.ejs"),
      this.destinationPath("src/index.ts"),
      {
        port: this.appConfig.port,
        importController: importController
      }
    );

    // Copy database if not exists
    if (!this.fs.exists(this.destinationPath("src/database.ts"))) {
      this.fs.copyTplAsync(
        this.templatePath("database.ejs"),
        this.destinationPath("src/database.ts"),
        {
          mongoUrl:
            this.databaseConfig?.mongoUrl ||
            this.databaseConfig?.port ||
            "mongodb://root:pass@localhost:27017/?authMechanism=DEFAULT" // Docker compose default URL
        }
      );
    }

    if (this.database.type === "docker") {
      this.fs.copyTplAsync(
        this.templatePath("database/mongo.yml"),
        this.destinationPath("src/database/mongo.yml")
      );
    }
  }

  async end() {
    this.log("Documentation API Generated via Swagger");
    this.log(
      `You can check it by executing 'npm run dev' and checking http://localhost:${this.appConfig.port}/docs`
    );

    if (this.database.type === "docker") {
      const launchDocker = await this.prompt([
        {
          type: "confirm",
          name: "useCompose",
          message: "Do you want to launch docker-compose ?",
          default: false
        }
      ]);

      if (launchDocker.useCompose) {
        await exec("docker-compose -f src/database/mongo.yml up", {
          docker: true
        })
          .then(msg => {
            console.log(msg);
            process.exit(0);
          })
          .catch(err => {
            console.error(err);
            process.exit(1);
          });
      }
    }
  }
};

var yeoman = require("yeoman-environment");
const expressCrud = require("./generators/app");
var env = yeoman.createEnv();

env.registerStub(expressCrud, "npm:app");

env.run("npm:app");

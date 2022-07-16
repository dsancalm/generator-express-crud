#! /usr/bin/env node
let yeoman = require("yeoman-environment");
const expressCrud = require("./generators/app");
let env = yeoman.createEnv();

env.registerStub(expressCrud, "npm:app");

env.run("npm:app");

/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const { exec } = require("child_process");

module.exports = async function execPromptOutput(command, execOptions = {}) {
  if (execOptions.docker) {
    return execDockerCommand(command);
  }

  return new Promise((resolve, reject) => {
    const childProcess = exec(command, execOptions);

    // Stream process output to console
    childProcess.stderr.on("data", data => {
      console.error(data);
    });
    childProcess.stdout.on("data", data => {
      console.log(data);
    });
    // Handle exit
    childProcess.on("exit", () => resolve());
    childProcess.on("close", () => resolve());
    // Handle errors
    childProcess.on("error", error => reject(error));
    // Handle finish
  });
};

async function execDockerCommand(command) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command);

    // Stream process output to console
    childProcess.stderr.on("data", data => {
      console.error(data);
    });
    childProcess.stdout.on("data", data => {
      const logArray = parseDockerLogs(data);
      logArray.forEach(log => {
        const obj = JSON.parse(log);
        if (obj.msg === "Waiting for connections") {
          resolve("Database succesfully mounted on Docker !!");
        }
      });
    });
    // Handle exit
    childProcess.on("exit", () => resolve());
    childProcess.on("close", () => resolve());
    // Handle errors
    childProcess.on("error", error => reject(error));
    // Handle finish
  });
}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }

  return true;
}

function parseDockerLogs(str) {
  let openBrackets = 0;
  let closeBrackets = 0;
  let openBracketIndex = -1;
  let closeBracketIndex = -1;

  let objects = [];

  for (var i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (char === "{") {
      if (openBracketIndex < 0) {
        openBracketIndex = i;
      }

      openBrackets += 1;
    }

    if (char === "}") {
      closeBrackets += 1;
      if (openBrackets === closeBrackets) {
        closeBracketIndex = i + 1;
        const obj = str.substring(openBracketIndex, closeBracketIndex);
        objects.push(obj.trim());
        openBracketIndex = -1;
        closeBracketIndex = -1;
      }
    }
  }

  return objects;
}

/* eslint-disable func-names */
const { exec } = require("child_process");

module.exports = async function execWaitForOutput(command, execOptions = {}) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, execOptions);

    // Stream process output to console
    childProcess.stderr.on("data", data => {
      console.error(data);
    });
    childProcess.stdout.on("data", data => {
      if (data.includes("Connection accepted")) {
        resolve("Your database is now up on Docker !!");
      }
    });
    // Handle exit
    childProcess.on("exit", () => resolve());
    childProcess.on("close", () => resolve());
    // Handle errors
    childProcess.on("error", error => reject(error));
    // Handle finish
  });
};

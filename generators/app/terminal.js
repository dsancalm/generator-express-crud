/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
const terminal = require("child_process");
const ora = require("ora");
const { Observable } = require("rxjs");

var spinner = ora({ spinner: "dots", color: "red" });

module.exports = { launchCommand, exec, execPromptOut, checkDocker };

function launchCommand(command, msg) {
  return new Promise((resolve, reject) => {
    const subscription = execObservable(command, msg).subscribe({
      next: code => {
        if (code === 1) {
          resolve(false);
        }

        resolve(true);
      }
    });
  });
}

function exec(command, spinnerMsg = "processing...") {
  spinner.text = spinnerMsg;
  spinner.start();

  return new Promise((resolve, reject) => {
    const childProcess = terminal.exec(command);
    // Handle exit
    childProcess.on("exit", code => {
      code === 0 ? spinner.succeed() : spinner.fail();
      resolve(code);
    });
    // Handle errors
    childProcess.on("error", error => {
      spinner.fail();
      reject(error);
    });
  });
}

function execObservable(command, spinnerMsg = "processing...") {
  spinner.text = spinnerMsg;
  spinner.start();

  return new Observable(subscriber => {
    const childProcess = terminal.exec(command);
    // Handle exit
    childProcess.on("exit", code => {
      subscriber.next(code);
      subscriber.complete();
      code === 0 ? spinner.succeed() : spinner.fail();
    });
    // Handle errors
    childProcess.on("error", error => {
      subscriber.next(error);
      subscriber.complete();
      spinner.fail();
    });
  });
}

function execPromptOut(command, spinnerMsg = "processing...") {
  spinner.text = spinnerMsg;
  spinner.start();

  return new Observable(subscriber => {
    const childProcess = terminal.exec(command);

    // Stream process output to console
    childProcess.stderr.on("data", data => {
      subscriber.next(data);
    });
    childProcess.stdout.on("data", data => {
      subscriber.next(data);
    });

    // Handle exit
    childProcess.on("exit", code => {
      subscriber.next(code);
      subscriber.complete();
      code === 0 ? spinner.succeed() : spinner.fail();
    });
    // Handle errors
    childProcess.on("error", error => {
      subscriber.next(error);
      subscriber.complete();
      spinner.fail();
    });
  });
}

function checkDocker() {
  return new Promise((resolve, reject) => {
    const subscription = execObservable(
      "docker version",
      "Checking Docker"
    ).subscribe({
      next: code => {
        if (code === 1) {
          resolve(false);
        }

        resolve(true);
      }
    });
  });
}

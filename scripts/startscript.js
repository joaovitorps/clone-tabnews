const { spawn } = require("child_process");

const devCommand = spawn("npm", ["run", "dev"], { stdio: "inherit" });

function runPostDevCommand() {
  const postDevCommand = spawn("npm", ["run", "postdev"], { stdio: "inherit" });

  postDevCommand.on("close", () => process.exit(0));
}

devCommand.on("close", runPostDevCommand);
process.on("SIGINT", runPostDevCommand);

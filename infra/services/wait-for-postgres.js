const { exec } = require("node:child_process");

const checkPostgresConnection = () => {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (err, stdout) => {
      if (stdout.search("accepting connection") === -1) {
        process.stdout.write(".");

        checkPostgresConnection();
        return;
      }

      console.log("\n✅ Conexão estabelecida.");
    },
  );
};

process.stdout.write(
  "\n⚠️ Aguardando postgres estar pronto para aceitar conexões TCP/IP",
);
checkPostgresConnection();

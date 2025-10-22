import retry from "async-retry";
import database from "../infra/database";

const waitForAllServices = async () => {
  const fetchStatusPage = async () => {
    const request = await fetch("http://localhost:3000/api/v1/status");

    if (!request.ok) {
      throw new Error("error occured");
    }
  };

  const waitForWebServer = async () => {
    await retry(() => fetchStatusPage(), {
      retries: 100,
      maxTimeout: 1000,
    });
  };

  await waitForWebServer();
};

const clearDatabase = async () => {
  await database.query("drop schema public cascade; create schema public;");
};

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;

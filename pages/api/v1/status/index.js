import database from "/infra/database.js";

const status = async (request, response) => {
  response.status(200).json({ updated_at: new Date().toISOString() });
};

export default status;

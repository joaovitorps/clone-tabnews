import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(inputUserData) {
  await validateUniqueEmail(inputUserData.email);
  await validateUniqueUsername(inputUserData.username);

  const newUser = await insertQuery(inputUserData);

  return newUser;

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Usuário já existente na plataforma.",
        action: "Utilize outro usuário para realiza o cadastro.",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT 
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Email já existente na plataforma.",
        action: "Utilize outro email para realiza o cadastro.",
      });
    }
  }

  async function insertQuery() {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password)
      VALUES
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        inputUserData.username,
        inputUserData.email,
        inputUserData.password,
      ],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;

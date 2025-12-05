import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors";

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

async function findOneByUsername(username) {
  const userFound = await selectQuery(username);

  return userFound;

  async function selectQuery(username) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT 
          1
        ;`,
      values: [username],
    });

    if (results.rowCount <= 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado.",
        action: "Verifique se o username está digitado corretamente.",
      });
    } else {
      return results.rows[0];
    }
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;

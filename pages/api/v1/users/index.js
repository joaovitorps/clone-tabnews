import { createRouter } from "next-connect";

import controller from "infra/controller.js";
import user from "../../../../models/user";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const inputUserData = await request.body;

  const userCreated = await user.create(inputUserData);

  return response.status(201).json(userCreated);
}

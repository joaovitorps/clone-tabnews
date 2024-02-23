const status = (request, response) => {
  response.status(200).json({ text: "Opa! é" });
};

export default status;

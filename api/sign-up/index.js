const { json } = require("micro");
const { decrypt, encrypt } = require("../../api-lib/encrypt-functions");

const { SECRET_KEY } = process.env;

const p = "pT/mh0ur8JHuSXVd4OPvvlySn5MOu/nWh+i7OSuZ2HE=";
const s = "YRDHSzOytYLhpI4EXcH0JuryzhNjqZVFTEO0JY71Aks=";

module.exports = async (req, res) => {
  const body = await json(req);
  const { p, m } = body;
  console.log(body);

  const keys = {
    p,
    s: SECRET_KEY
  };

  const result = decrypt(s, body);

  console.log(result);

  if (result) {
    const message = encrypt(p, { message : "success" });
    res.end(message);
  } else {
    res.end("soz");
  }
};

const { json } = require('micro');

const { parseKey, decrypt, encrypt } = require('../../api-lib/encrypt-functions');

const { SECRET_KEY } = process.env;

module.exports = async (req, res) => {
  const body = await json(req);
  const { p, m } = body;

  const keys = {
    p,
    s: parseKey(SECRET_KEY),
  };

  const result = decrypt(m, keys);
  console.log(result);

  if (result) {
    const message = encrypt('Success', keys);
    res.end(message);
  } else {
    res.end('soz');
  }
};

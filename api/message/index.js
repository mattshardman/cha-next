const { SECRET_KEY, PUBLIC_KEY } = process.env;

const { encrypt, parseKey } = require('../../api-lib/encrypt-functions');

module.exports = (req, res) => {
  const p = [
    255,
    213,
    76,
    30,
    174,
    74,
    0,
    135,
    204,
    189,
    131,
    178,
    194,
    77,
    99,
    160,
    56,
    149,
    176,
    184,
    148,
    49,
    134,
    197,
    239,
    46,
    183,
    56,
    77,
    152,
    210,
    24,
  ];

  const keys = {
    p,
    s: parseKey(SECRET_KEY),
  };

  const messageToSend = encrypt('hello', keys);
  res.end(messageToSend);
};

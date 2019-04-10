const { PUBLIC_KEY } = process.env;

module.exports = (req, res) => {
  res.end(PUBLIC_KEY);
};

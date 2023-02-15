export default (req, res) => {
  console.log('console log test');
  res.status(200).send(`Hello ${req.query.name}!`);
};

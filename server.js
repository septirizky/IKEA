const app = require("./app");

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

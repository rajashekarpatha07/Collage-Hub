import connectDb from "./src/db/connection.db.js";
import app from "./app.js";

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log("Server is not running", error);
  });


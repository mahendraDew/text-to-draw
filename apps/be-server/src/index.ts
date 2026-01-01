import express from "express";
import { userRouter } from "./routes/userRouter"
const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/health", (req, res) => {
  res.send("server is healthy!!");
});


app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import authRouter from './src/routes/authRouter.js';
import usersRouter from './src/routes/usersRouter.js';
import { connectDB } from './src/config/db.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
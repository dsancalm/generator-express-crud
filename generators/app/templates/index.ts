import 'module-alias/register';
import express from 'express';
import { userRouter } from '@controllers/user/router';
import mongoose from 'mongoose';


const app = express();
app.use(express.json());
const port = 8080; // default port to listen

app.use('/api', userRouter);


mongoose.connect('mongodb://mongo:dBIuBRCsFztpbBLdGpX5@containers-us-west-67.railway.app:6754', () => {
  console.log('connected to database')
})

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
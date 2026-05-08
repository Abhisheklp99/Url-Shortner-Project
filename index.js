import dotenv from 'dotenv/config'
import express from 'express';


import userRouter from './routes/user.routes.js';
import { urlRouter } from './routes/url.routes.js';
import { authenticationMiddleware } from './middleware/auth.middleware.js';

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// Routes
app.use(authenticationMiddleware)

app.use('/user',userRouter );
app.use(urlRouter)

// Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
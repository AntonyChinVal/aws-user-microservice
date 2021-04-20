if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
import {UserRouter} from './controllers/user.router';
import express , { Request, Response } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import {sequelize} from './sequelize';
import { V0_USER_MODELS} from './models/model.index';
import {config} from './config/config';

(async () => {

  console.log("Starting server")
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();
  console.log("Db Up")
  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());

  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: config.url,
  }));

  app.use('/v0', UserRouter);

  app.get( "/", async ( req, res ) => { 
    console.log( `V0 User Api` );
    res.send("V0 User Api") 
  });

  app.get("/health", (req : Request, res : Response) => { res.status(200).send("Hello! User Api") });

  // Start the Server
  app.listen( port, () => {
    console.log( `server running port ${port}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
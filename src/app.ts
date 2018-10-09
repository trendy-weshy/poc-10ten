import { Controller } from './api/index';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

export const app = express();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

new Controller(app);

import express, {Request, Response} from 'express'
import { db } from './db/db';
import { CourseViewModel } from './models/CourseViewModel';
import { getCoursesRouter, getInterestingRouter } from './routes/courses';
import { getTestsRouter } from './routes/tests';


export const app = express()

  
export const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRouter(db))
app.use("/__test__", getTestsRouter(db))
app.use("/interesting", getInterestingRouter(db))
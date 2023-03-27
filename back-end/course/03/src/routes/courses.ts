import express, {Express, Request, Response} from 'express'
import { CourseType, db, DBType } from '../db/db';
import { CourseViewModel } from '../models/CourseViewModel';
import { CreateCourseModel } from '../models/CreateCourseModel';
import { QueryCourseModel } from '../models/QueryCoursesModel';
import { UpdateCourseModel } from '../models/UpdateCourseModel';
import { URIParamsCourseIdModel } from '../models/URIParamsCourseIdModel';
import { RequestsWithBody, RequestsWithParams, RequestsWithParamsAndBody, RequestsWithQuery } from '../types';
import { HTTP_STATUSES } from '../utils';

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title
  }
}

export const getCoursesRouter = (db: DBType) => {
    const router = express.Router()
    
    router.get('/', (req: RequestsWithQuery<QueryCourseModel>, 
                        res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;
        
        if (req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title) > -1)
        }

        res.json(foundCourses.map(getCourseViewModel))
    })
    router.get('/:id', (req: RequestsWithParams<URIParamsCourseIdModel>, 
                            res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404);
            return;
        }

        res.json(getCourseViewModel(foundCourse))
    })
    router.post('/', (req: RequestsWithBody<CreateCourseModel>, 
                        res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }
    
        const createdCouse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0
        }
        db.courses.push(createdCouse);
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(createdCouse));
    })
    router.delete('/:id', (req: RequestsWithParams<URIParamsCourseIdModel>, 
                                res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
    

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    router.put('/:id', (req: RequestsWithParamsAndBody<URIParamsCourseIdModel,UpdateCourseModel>, 
                            res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUNT_404);
        return;
    }

    foundCourse.title = req.body.title;

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    
    return router;
}

export const getInterestingRouter = (db: DBType) => {
    const router = express.Router()

    router.get('/:id([0-9]+)', (req: RequestsWithParams<URIParamsCourseIdModel>, 
        res) => {
    res.json({title: "data by id: " + req.params.id})
    })

    router.get('/books', (req: RequestsWithQuery<QueryCourseModel>, 
        res) => {
    res.json({title: "It\'s books handler"})
    })
  
    return router;
}
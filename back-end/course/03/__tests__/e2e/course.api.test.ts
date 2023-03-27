import request from 'supertest'
import { app } from '../../src/app'
import { CreateCourseModel } from '../../src/models/CreateCourseModel'
import { UpdateCourseModel } from '../../src/models/UpdateCourseModel'
import { HTTP_STATUSES } from '../../src/utils'

const getRequest = () => {
    return request(app)
}

describe('/course', () => {

    beforeAll(async () => {
        await getRequest().delete('/__test__/data')    
    })

    it ('should return 200 and empty array', async () => {
        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it ('should return 404 for not existing course', async () => {
        await getRequest()
            .get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUNT_404)
    })

    it(`should'nt create course with incorrect input data`, async () => {
        const data: CreateCourseModel = {title: ''};
        
        await getRequest()
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest()
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])    
    })

    let createdCourse: any = null
    it(`should create course with correct input data`, async () => {
        const data: CreateCourseModel = {title: 'new couses'};
        
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse = createResponse.body;

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: data.title
        })

        await request(app)
        .get('/courses')
        .expect(HTTP_STATUSES.OK_200, [createdCourse])  
    })        

    it(`should'nt update course with incorrect input data`, async () => {
        const data: UpdateCourseModel = {title: ''}
        
        await request(app)
            .put(`/courses/` + createdCourse.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
        .get('/courses/' + createdCourse.id)
        .expect(HTTP_STATUSES.OK_200, createdCourse)  
    })        

    it(`should'nt update course that not exist`, async () => {
        const data: UpdateCourseModel = {title: 'good title'}

        await request(app)
            .put(`/courses/` + -100)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUNT_404)

    })  

    it(`should update course whit correct input data`, async () => {
        const data: UpdateCourseModel = {title: 'good new title'}
        
        await request(app)
            .put(`/courses/` + createdCourse.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourse.id)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse,
                title: data.title
            }) 

    })  

})
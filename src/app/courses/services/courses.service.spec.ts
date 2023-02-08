import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import {Course} from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CoursesService,
      ]
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  })

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should retrieve all courses', () => {
    coursesService.findAllCourses()
    .subscribe(courses => {
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'incorrect number of courses');
      const course = courses.find(course => course.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });
    const testRequest = httpTestingController.expectOne('/api/courses');
    expect(testRequest.request.method).toEqual("GET");
    // When 'flush' is called, it emits the object passed, triggering the previous subscribe
    testRequest.flush({
      payload: Object.values(COURSES)
    });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });
    const testRequest = httpTestingController.expectOne('/api/courses/12');
    expect(testRequest.request.method).toEqual("GET");
    testRequest.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };
    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });
    const testRequest = httpTestingController.expectOne('/api/courses/12');
    expect(testRequest.request.method).toEqual("PUT");
    expect(testRequest.request.body.titles.description).toEqual(changes.titles.description);
    // Create a new object based on the stored course and the changes to simulate PUT response
    testRequest.flush({
      ...COURSES[12],
      ...changes
    });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } };
    coursesService.saveCourse(12, changes)
      .subscribe({
        next: () => {
          fail('the save course operation should have failed');
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });
    const testRequest = httpTestingController.expectOne('/api/courses/12');
    expect(testRequest.request.method).toEqual("PUT");
    testRequest.flush('Save course failed',
      {
        status: 500,
        statusText: 'Internal Server Error'
      });
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });
    const testRequest = httpTestingController.expectOne(req => req.url === '/api/lessons');
    expect(testRequest.request.method).toBe('GET');
    expect(testRequest.request.params.get('courseId')).toEqual("12");
    expect(testRequest.request.params.get('filter')).toEqual("");
    expect(testRequest.request.params.get('sortOrder')).toEqual("asc");
    expect(testRequest.request.params.get('pageNumber')).toEqual("0");
    expect(testRequest.request.params.get('pageSize')).toEqual("3");
    testRequest.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });
});

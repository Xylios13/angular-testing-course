import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES } from "../../../../server/db-data";
import {Course} from "../model/course";

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
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }
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
});

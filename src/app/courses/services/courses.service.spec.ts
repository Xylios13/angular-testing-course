import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import { COURSES } from "../../../../server/db-data";

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
});

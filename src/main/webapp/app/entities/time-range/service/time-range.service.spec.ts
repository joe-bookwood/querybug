import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITimeRange } from '../time-range.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../time-range.test-samples';

import { TimeRangeService } from './time-range.service';

const requireRestSample: ITimeRange = {
  ...sampleWithRequiredData,
};

describe('TimeRange Service', () => {
  let service: TimeRangeService;
  let httpMock: HttpTestingController;
  let expectedResult: ITimeRange | ITimeRange[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TimeRangeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TimeRange', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timeRange = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(timeRange).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TimeRange', () => {
      const timeRange = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(timeRange).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TimeRange', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TimeRange', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TimeRange', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTimeRangeToCollectionIfMissing', () => {
      it('should add a TimeRange to an empty array', () => {
        const timeRange: ITimeRange = sampleWithRequiredData;
        expectedResult = service.addTimeRangeToCollectionIfMissing([], timeRange);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timeRange);
      });

      it('should not add a TimeRange to an array that contains it', () => {
        const timeRange: ITimeRange = sampleWithRequiredData;
        const timeRangeCollection: ITimeRange[] = [
          {
            ...timeRange,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTimeRangeToCollectionIfMissing(timeRangeCollection, timeRange);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TimeRange to an array that doesn't contain it", () => {
        const timeRange: ITimeRange = sampleWithRequiredData;
        const timeRangeCollection: ITimeRange[] = [sampleWithPartialData];
        expectedResult = service.addTimeRangeToCollectionIfMissing(timeRangeCollection, timeRange);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timeRange);
      });

      it('should add only unique TimeRange to an array', () => {
        const timeRangeArray: ITimeRange[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const timeRangeCollection: ITimeRange[] = [sampleWithRequiredData];
        expectedResult = service.addTimeRangeToCollectionIfMissing(timeRangeCollection, ...timeRangeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const timeRange: ITimeRange = sampleWithRequiredData;
        const timeRange2: ITimeRange = sampleWithPartialData;
        expectedResult = service.addTimeRangeToCollectionIfMissing([], timeRange, timeRange2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(timeRange);
        expect(expectedResult).toContain(timeRange2);
      });

      it('should accept null and undefined values', () => {
        const timeRange: ITimeRange = sampleWithRequiredData;
        expectedResult = service.addTimeRangeToCollectionIfMissing([], null, timeRange, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(timeRange);
      });

      it('should return initial array if no TimeRange is added', () => {
        const timeRangeCollection: ITimeRange[] = [sampleWithRequiredData];
        expectedResult = service.addTimeRangeToCollectionIfMissing(timeRangeCollection, undefined, null);
        expect(expectedResult).toEqual(timeRangeCollection);
      });
    });

    describe('compareTimeRange', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTimeRange(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTimeRange(entity1, entity2);
        const compareResult2 = service.compareTimeRange(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTimeRange(entity1, entity2);
        const compareResult2 = service.compareTimeRange(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTimeRange(entity1, entity2);
        const compareResult2 = service.compareTimeRange(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

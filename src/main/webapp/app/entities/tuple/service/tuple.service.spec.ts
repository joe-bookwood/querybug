import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITuple } from '../tuple.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tuple.test-samples';

import { TupleService, RestTuple } from './tuple.service';

const requireRestSample: RestTuple = {
  ...sampleWithRequiredData,
  time: sampleWithRequiredData.time?.toJSON(),
};

describe('Tuple Service', () => {
  let service: TupleService;
  let httpMock: HttpTestingController;
  let expectedResult: ITuple | ITuple[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TupleService);
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

    it('should create a Tuple', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tuple = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tuple).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tuple', () => {
      const tuple = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tuple).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tuple', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tuple', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Tuple', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTupleToCollectionIfMissing', () => {
      it('should add a Tuple to an empty array', () => {
        const tuple: ITuple = sampleWithRequiredData;
        expectedResult = service.addTupleToCollectionIfMissing([], tuple);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tuple);
      });

      it('should not add a Tuple to an array that contains it', () => {
        const tuple: ITuple = sampleWithRequiredData;
        const tupleCollection: ITuple[] = [
          {
            ...tuple,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTupleToCollectionIfMissing(tupleCollection, tuple);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tuple to an array that doesn't contain it", () => {
        const tuple: ITuple = sampleWithRequiredData;
        const tupleCollection: ITuple[] = [sampleWithPartialData];
        expectedResult = service.addTupleToCollectionIfMissing(tupleCollection, tuple);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tuple);
      });

      it('should add only unique Tuple to an array', () => {
        const tupleArray: ITuple[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tupleCollection: ITuple[] = [sampleWithRequiredData];
        expectedResult = service.addTupleToCollectionIfMissing(tupleCollection, ...tupleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tuple: ITuple = sampleWithRequiredData;
        const tuple2: ITuple = sampleWithPartialData;
        expectedResult = service.addTupleToCollectionIfMissing([], tuple, tuple2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tuple);
        expect(expectedResult).toContain(tuple2);
      });

      it('should accept null and undefined values', () => {
        const tuple: ITuple = sampleWithRequiredData;
        expectedResult = service.addTupleToCollectionIfMissing([], null, tuple, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tuple);
      });

      it('should return initial array if no Tuple is added', () => {
        const tupleCollection: ITuple[] = [sampleWithRequiredData];
        expectedResult = service.addTupleToCollectionIfMissing(tupleCollection, undefined, null);
        expect(expectedResult).toEqual(tupleCollection);
      });
    });

    describe('compareTuple', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTuple(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTuple(entity1, entity2);
        const compareResult2 = service.compareTuple(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTuple(entity1, entity2);
        const compareResult2 = service.compareTuple(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTuple(entity1, entity2);
        const compareResult2 = service.compareTuple(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

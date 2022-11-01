import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPair } from '../pair.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pair.test-samples';

import { PairService } from './pair.service';

const requireRestSample: IPair = {
  ...sampleWithRequiredData,
};

describe('Pair Service', () => {
  let service: PairService;
  let httpMock: HttpTestingController;
  let expectedResult: IPair | IPair[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PairService);
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

    it('should create a Pair', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pair = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pair).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pair', () => {
      const pair = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pair).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pair', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pair', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pair', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPairToCollectionIfMissing', () => {
      it('should add a Pair to an empty array', () => {
        const pair: IPair = sampleWithRequiredData;
        expectedResult = service.addPairToCollectionIfMissing([], pair);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pair);
      });

      it('should not add a Pair to an array that contains it', () => {
        const pair: IPair = sampleWithRequiredData;
        const pairCollection: IPair[] = [
          {
            ...pair,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPairToCollectionIfMissing(pairCollection, pair);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pair to an array that doesn't contain it", () => {
        const pair: IPair = sampleWithRequiredData;
        const pairCollection: IPair[] = [sampleWithPartialData];
        expectedResult = service.addPairToCollectionIfMissing(pairCollection, pair);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pair);
      });

      it('should add only unique Pair to an array', () => {
        const pairArray: IPair[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pairCollection: IPair[] = [sampleWithRequiredData];
        expectedResult = service.addPairToCollectionIfMissing(pairCollection, ...pairArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pair: IPair = sampleWithRequiredData;
        const pair2: IPair = sampleWithPartialData;
        expectedResult = service.addPairToCollectionIfMissing([], pair, pair2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pair);
        expect(expectedResult).toContain(pair2);
      });

      it('should accept null and undefined values', () => {
        const pair: IPair = sampleWithRequiredData;
        expectedResult = service.addPairToCollectionIfMissing([], null, pair, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pair);
      });

      it('should return initial array if no Pair is added', () => {
        const pairCollection: IPair[] = [sampleWithRequiredData];
        expectedResult = service.addPairToCollectionIfMissing(pairCollection, undefined, null);
        expect(expectedResult).toEqual(pairCollection);
      });
    });

    describe('comparePair', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePair(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePair(entity1, entity2);
        const compareResult2 = service.comparePair(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePair(entity1, entity2);
        const compareResult2 = service.comparePair(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePair(entity1, entity2);
        const compareResult2 = service.comparePair(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

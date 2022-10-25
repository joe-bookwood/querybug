import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITouple } from '../touple.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../touple.test-samples';

import { ToupleService, RestTouple } from './touple.service';

const requireRestSample: RestTouple = {
  ...sampleWithRequiredData,
  time: sampleWithRequiredData.time?.toJSON(),
};

describe('Touple Service', () => {
  let service: ToupleService;
  let httpMock: HttpTestingController;
  let expectedResult: ITouple | ITouple[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ToupleService);
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

    it('should create a Touple', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const touple = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(touple).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Touple', () => {
      const touple = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(touple).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Touple', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Touple', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Touple', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addToupleToCollectionIfMissing', () => {
      it('should add a Touple to an empty array', () => {
        const touple: ITouple = sampleWithRequiredData;
        expectedResult = service.addToupleToCollectionIfMissing([], touple);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(touple);
      });

      it('should not add a Touple to an array that contains it', () => {
        const touple: ITouple = sampleWithRequiredData;
        const toupleCollection: ITouple[] = [
          {
            ...touple,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addToupleToCollectionIfMissing(toupleCollection, touple);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Touple to an array that doesn't contain it", () => {
        const touple: ITouple = sampleWithRequiredData;
        const toupleCollection: ITouple[] = [sampleWithPartialData];
        expectedResult = service.addToupleToCollectionIfMissing(toupleCollection, touple);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(touple);
      });

      it('should add only unique Touple to an array', () => {
        const toupleArray: ITouple[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const toupleCollection: ITouple[] = [sampleWithRequiredData];
        expectedResult = service.addToupleToCollectionIfMissing(toupleCollection, ...toupleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const touple: ITouple = sampleWithRequiredData;
        const touple2: ITouple = sampleWithPartialData;
        expectedResult = service.addToupleToCollectionIfMissing([], touple, touple2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(touple);
        expect(expectedResult).toContain(touple2);
      });

      it('should accept null and undefined values', () => {
        const touple: ITouple = sampleWithRequiredData;
        expectedResult = service.addToupleToCollectionIfMissing([], null, touple, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(touple);
      });

      it('should return initial array if no Touple is added', () => {
        const toupleCollection: ITouple[] = [sampleWithRequiredData];
        expectedResult = service.addToupleToCollectionIfMissing(toupleCollection, undefined, null);
        expect(expectedResult).toEqual(toupleCollection);
      });
    });

    describe('compareTouple', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTouple(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTouple(entity1, entity2);
        const compareResult2 = service.compareTouple(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTouple(entity1, entity2);
        const compareResult2 = service.compareTouple(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTouple(entity1, entity2);
        const compareResult2 = service.compareTouple(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

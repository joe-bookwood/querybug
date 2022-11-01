import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOhlc } from '../ohlc.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../ohlc.test-samples';

import { OhlcService, RestOhlc } from './ohlc.service';

const requireRestSample: RestOhlc = {
  ...sampleWithRequiredData,
  time: sampleWithRequiredData.time?.toJSON(),
};

describe('Ohlc Service', () => {
  let service: OhlcService;
  let httpMock: HttpTestingController;
  let expectedResult: IOhlc | IOhlc[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OhlcService);
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

    it('should create a Ohlc', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ohlc = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(ohlc).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ohlc', () => {
      const ohlc = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(ohlc).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ohlc', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ohlc', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Ohlc', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOhlcToCollectionIfMissing', () => {
      it('should add a Ohlc to an empty array', () => {
        const ohlc: IOhlc = sampleWithRequiredData;
        expectedResult = service.addOhlcToCollectionIfMissing([], ohlc);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ohlc);
      });

      it('should not add a Ohlc to an array that contains it', () => {
        const ohlc: IOhlc = sampleWithRequiredData;
        const ohlcCollection: IOhlc[] = [
          {
            ...ohlc,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOhlcToCollectionIfMissing(ohlcCollection, ohlc);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ohlc to an array that doesn't contain it", () => {
        const ohlc: IOhlc = sampleWithRequiredData;
        const ohlcCollection: IOhlc[] = [sampleWithPartialData];
        expectedResult = service.addOhlcToCollectionIfMissing(ohlcCollection, ohlc);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ohlc);
      });

      it('should add only unique Ohlc to an array', () => {
        const ohlcArray: IOhlc[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ohlcCollection: IOhlc[] = [sampleWithRequiredData];
        expectedResult = service.addOhlcToCollectionIfMissing(ohlcCollection, ...ohlcArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ohlc: IOhlc = sampleWithRequiredData;
        const ohlc2: IOhlc = sampleWithPartialData;
        expectedResult = service.addOhlcToCollectionIfMissing([], ohlc, ohlc2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ohlc);
        expect(expectedResult).toContain(ohlc2);
      });

      it('should accept null and undefined values', () => {
        const ohlc: IOhlc = sampleWithRequiredData;
        expectedResult = service.addOhlcToCollectionIfMissing([], null, ohlc, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ohlc);
      });

      it('should return initial array if no Ohlc is added', () => {
        const ohlcCollection: IOhlc[] = [sampleWithRequiredData];
        expectedResult = service.addOhlcToCollectionIfMissing(ohlcCollection, undefined, null);
        expect(expectedResult).toEqual(ohlcCollection);
      });
    });

    describe('compareOhlc', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOhlc(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOhlc(entity1, entity2);
        const compareResult2 = service.compareOhlc(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOhlc(entity1, entity2);
        const compareResult2 = service.compareOhlc(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOhlc(entity1, entity2);
        const compareResult2 = service.compareOhlc(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

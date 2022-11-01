import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFee } from '../fee.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fee.test-samples';

import { FeeService } from './fee.service';

const requireRestSample: IFee = {
  ...sampleWithRequiredData,
};

describe('Fee Service', () => {
  let service: FeeService;
  let httpMock: HttpTestingController;
  let expectedResult: IFee | IFee[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeeService);
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

    it('should create a Fee', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fee = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fee', () => {
      const fee = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Fee', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fee', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Fee', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFeeToCollectionIfMissing', () => {
      it('should add a Fee to an empty array', () => {
        const fee: IFee = sampleWithRequiredData;
        expectedResult = service.addFeeToCollectionIfMissing([], fee);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fee);
      });

      it('should not add a Fee to an array that contains it', () => {
        const fee: IFee = sampleWithRequiredData;
        const feeCollection: IFee[] = [
          {
            ...fee,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFeeToCollectionIfMissing(feeCollection, fee);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fee to an array that doesn't contain it", () => {
        const fee: IFee = sampleWithRequiredData;
        const feeCollection: IFee[] = [sampleWithPartialData];
        expectedResult = service.addFeeToCollectionIfMissing(feeCollection, fee);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fee);
      });

      it('should add only unique Fee to an array', () => {
        const feeArray: IFee[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const feeCollection: IFee[] = [sampleWithRequiredData];
        expectedResult = service.addFeeToCollectionIfMissing(feeCollection, ...feeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fee: IFee = sampleWithRequiredData;
        const fee2: IFee = sampleWithPartialData;
        expectedResult = service.addFeeToCollectionIfMissing([], fee, fee2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fee);
        expect(expectedResult).toContain(fee2);
      });

      it('should accept null and undefined values', () => {
        const fee: IFee = sampleWithRequiredData;
        expectedResult = service.addFeeToCollectionIfMissing([], null, fee, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fee);
      });

      it('should return initial array if no Fee is added', () => {
        const feeCollection: IFee[] = [sampleWithRequiredData];
        expectedResult = service.addFeeToCollectionIfMissing(feeCollection, undefined, null);
        expect(expectedResult).toEqual(feeCollection);
      });
    });

    describe('compareFee', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFee(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFee(entity1, entity2);
        const compareResult2 = service.compareFee(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFee(entity1, entity2);
        const compareResult2 = service.compareFee(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFee(entity1, entity2);
        const compareResult2 = service.compareFee(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

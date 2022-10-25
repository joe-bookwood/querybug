import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICalculation } from '../calculation.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../calculation.test-samples';

import { CalculationService, RestCalculation } from './calculation.service';

const requireRestSample: RestCalculation = {
  ...sampleWithRequiredData,
  last: sampleWithRequiredData.last?.toJSON(),
};

describe('Calculation Service', () => {
  let service: CalculationService;
  let httpMock: HttpTestingController;
  let expectedResult: ICalculation | ICalculation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CalculationService);
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

    it('should create a Calculation', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const calculation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(calculation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Calculation', () => {
      const calculation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(calculation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Calculation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Calculation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Calculation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCalculationToCollectionIfMissing', () => {
      it('should add a Calculation to an empty array', () => {
        const calculation: ICalculation = sampleWithRequiredData;
        expectedResult = service.addCalculationToCollectionIfMissing([], calculation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(calculation);
      });

      it('should not add a Calculation to an array that contains it', () => {
        const calculation: ICalculation = sampleWithRequiredData;
        const calculationCollection: ICalculation[] = [
          {
            ...calculation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCalculationToCollectionIfMissing(calculationCollection, calculation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Calculation to an array that doesn't contain it", () => {
        const calculation: ICalculation = sampleWithRequiredData;
        const calculationCollection: ICalculation[] = [sampleWithPartialData];
        expectedResult = service.addCalculationToCollectionIfMissing(calculationCollection, calculation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(calculation);
      });

      it('should add only unique Calculation to an array', () => {
        const calculationArray: ICalculation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const calculationCollection: ICalculation[] = [sampleWithRequiredData];
        expectedResult = service.addCalculationToCollectionIfMissing(calculationCollection, ...calculationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const calculation: ICalculation = sampleWithRequiredData;
        const calculation2: ICalculation = sampleWithPartialData;
        expectedResult = service.addCalculationToCollectionIfMissing([], calculation, calculation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(calculation);
        expect(expectedResult).toContain(calculation2);
      });

      it('should accept null and undefined values', () => {
        const calculation: ICalculation = sampleWithRequiredData;
        expectedResult = service.addCalculationToCollectionIfMissing([], null, calculation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(calculation);
      });

      it('should return initial array if no Calculation is added', () => {
        const calculationCollection: ICalculation[] = [sampleWithRequiredData];
        expectedResult = service.addCalculationToCollectionIfMissing(calculationCollection, undefined, null);
        expect(expectedResult).toEqual(calculationCollection);
      });
    });

    describe('compareCalculation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCalculation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCalculation(entity1, entity2);
        const compareResult2 = service.compareCalculation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCalculation(entity1, entity2);
        const compareResult2 = service.compareCalculation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCalculation(entity1, entity2);
        const compareResult2 = service.compareCalculation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

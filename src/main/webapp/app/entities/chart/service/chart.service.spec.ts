import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChart } from '../chart.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../chart.test-samples';

import { ChartService, RestChart } from './chart.service';

const requireRestSample: RestChart = {
  ...sampleWithRequiredData,
  last: sampleWithRequiredData.last?.toJSON(),
};

describe('Chart Service', () => {
  let service: ChartService;
  let httpMock: HttpTestingController;
  let expectedResult: IChart | IChart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChartService);
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

    it('should create a Chart', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const chart = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(chart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chart', () => {
      const chart = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(chart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chart', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chart', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Chart', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChartToCollectionIfMissing', () => {
      it('should add a Chart to an empty array', () => {
        const chart: IChart = sampleWithRequiredData;
        expectedResult = service.addChartToCollectionIfMissing([], chart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chart);
      });

      it('should not add a Chart to an array that contains it', () => {
        const chart: IChart = sampleWithRequiredData;
        const chartCollection: IChart[] = [
          {
            ...chart,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addChartToCollectionIfMissing(chartCollection, chart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chart to an array that doesn't contain it", () => {
        const chart: IChart = sampleWithRequiredData;
        const chartCollection: IChart[] = [sampleWithPartialData];
        expectedResult = service.addChartToCollectionIfMissing(chartCollection, chart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chart);
      });

      it('should add only unique Chart to an array', () => {
        const chartArray: IChart[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const chartCollection: IChart[] = [sampleWithRequiredData];
        expectedResult = service.addChartToCollectionIfMissing(chartCollection, ...chartArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chart: IChart = sampleWithRequiredData;
        const chart2: IChart = sampleWithPartialData;
        expectedResult = service.addChartToCollectionIfMissing([], chart, chart2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chart);
        expect(expectedResult).toContain(chart2);
      });

      it('should accept null and undefined values', () => {
        const chart: IChart = sampleWithRequiredData;
        expectedResult = service.addChartToCollectionIfMissing([], null, chart, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chart);
      });

      it('should return initial array if no Chart is added', () => {
        const chartCollection: IChart[] = [sampleWithRequiredData];
        expectedResult = service.addChartToCollectionIfMissing(chartCollection, undefined, null);
        expect(expectedResult).toEqual(chartCollection);
      });
    });

    describe('compareChart', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareChart(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareChart(entity1, entity2);
        const compareResult2 = service.compareChart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareChart(entity1, entity2);
        const compareResult2 = service.compareChart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareChart(entity1, entity2);
        const compareResult2 = service.compareChart(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

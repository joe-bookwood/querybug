import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'asset',
        data: { pageTitle: 'querybugApp.asset.home.title' },
        loadChildren: () => import('./asset/asset.module').then(m => m.AssetModule),
      },
      {
        path: 'calculation',
        data: { pageTitle: 'querybugApp.calculation.home.title' },
        loadChildren: () => import('./calculation/calculation.module').then(m => m.CalculationModule),
      },
      {
        path: 'chart',
        data: { pageTitle: 'querybugApp.chart.home.title' },
        loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule),
      },
      {
        path: 'fee',
        data: { pageTitle: 'querybugApp.fee.home.title' },
        loadChildren: () => import('./fee/fee.module').then(m => m.FeeModule),
      },
      {
        path: 'ohlc',
        data: { pageTitle: 'querybugApp.ohlc.home.title' },
        loadChildren: () => import('./ohlc/ohlc.module').then(m => m.OhlcModule),
      },
      {
        path: 'pair',
        data: { pageTitle: 'querybugApp.pair.home.title' },
        loadChildren: () => import('./pair/pair.module').then(m => m.PairModule),
      },
      {
        path: 'time-range',
        data: { pageTitle: 'querybugApp.timeRange.home.title' },
        loadChildren: () => import('./time-range/time-range.module').then(m => m.TimeRangeModule),
      },
      {
        path: 'tuple',
        data: { pageTitle: 'querybugApp.tuple.home.title' },
        loadChildren: () => import('./tuple/tuple.module').then(m => m.TupleModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

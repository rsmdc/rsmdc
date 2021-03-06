import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'data-table',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  bundles: [
    { components: [
      'rs-data-table', 
      'rs-data-table-header',
      'rs-data-table-body', 
      'rs-data-table-row',
      'rs-data-table-cell'
    ]}
  ]
};

import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'textfield',
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
      'rs-textfield', 
      'rs-textfield-trailing',
      'rs-textarea'
    ]}
  ]
};

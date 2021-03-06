/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface RsSnackbar {
    'countSurvivalTime': () => Promise<void>;
    'isOpened': () => Promise<void>;
    'keepAlive': number;
    'openSnackbarMotion': () => Promise<void>;
    'opened': boolean;
  }
  interface RsSnackbarText {}
}

declare global {


  interface HTMLRsSnackbarElement extends Components.RsSnackbar, HTMLStencilElement {}
  var HTMLRsSnackbarElement: {
    prototype: HTMLRsSnackbarElement;
    new (): HTMLRsSnackbarElement;
  };

  interface HTMLRsSnackbarTextElement extends Components.RsSnackbarText, HTMLStencilElement {}
  var HTMLRsSnackbarTextElement: {
    prototype: HTMLRsSnackbarTextElement;
    new (): HTMLRsSnackbarTextElement;
  };
  interface HTMLElementTagNameMap {
    'rs-snackbar': HTMLRsSnackbarElement;
    'rs-snackbar-text': HTMLRsSnackbarTextElement;
  }
}

declare namespace LocalJSX {
  interface RsSnackbar extends JSXBase.HTMLAttributes<HTMLRsSnackbarElement> {
    'keepAlive'?: number;
    'onChange'?: (event: CustomEvent<any>) => void;
    'opened'?: boolean;
  }
  interface RsSnackbarText extends JSXBase.HTMLAttributes<HTMLRsSnackbarTextElement> {}

  interface IntrinsicElements {
    'rs-snackbar': RsSnackbar;
    'rs-snackbar-text': RsSnackbarText;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}



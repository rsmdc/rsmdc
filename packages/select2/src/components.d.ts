/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface RsSelect {
    'addFocusStyle': () => Promise<void>;
    'disabled': boolean;
    'invalid': boolean;
    'isDisabled': () => Promise<void>;
    'isInvalid': () => Promise<void>;
    'isRequired': () => Promise<void>;
    'label': string;
    'multiple': boolean;
    'name': string;
    'removeFocusStyle': () => Promise<void>;
    'required': boolean;
    'selectedIndex': number;
    'value': string;
  }
}

declare global {


  interface HTMLRsSelectElement extends Components.RsSelect, HTMLStencilElement {}
  var HTMLRsSelectElement: {
    prototype: HTMLRsSelectElement;
    new (): HTMLRsSelectElement;
  };
  interface HTMLElementTagNameMap {
    'rs-select': HTMLRsSelectElement;
  }
}

declare namespace LocalJSX {
  interface RsSelect extends JSXBase.HTMLAttributes<HTMLRsSelectElement> {
    'disabled'?: boolean;
    'invalid'?: boolean;
    'label'?: string;
    'multiple'?: boolean;
    'name'?: string;
    'onChange'?: (event: CustomEvent<any>) => void;
    'required'?: boolean;
    'selectedIndex'?: number;
    'value'?: string;
  }

  interface IntrinsicElements {
    'rs-select': RsSelect;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


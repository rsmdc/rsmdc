/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface RsTextarea {
    'addFocusStyle': () => Promise<void>;
    'changeHandler': () => Promise<void>;
    'cols': number;
    'countable': boolean;
    'disabled': boolean;
    'floatLabel': () => Promise<void>;
    'invalid': boolean;
    'isCountable': () => Promise<void>;
    'isDisabled': () => Promise<void>;
    'isInvalid': () => Promise<void>;
    'isRequired': () => Promise<void>;
    'label': string;
    'maxlength': string;
    'placeholder': string;
    'removeFocusStyle': () => Promise<void>;
    'required': boolean;
    'retriveLabelWidth': (labels: any) => Promise<any>;
    'rows': number;
    'setLabelWidthToNotch': () => Promise<void>;
    'type': string;
    'value': string;
  }
  interface RsTextfield {
    'addFocusStyle': () => Promise<void>;
    'addFocusToParent': () => Promise<void>;
    'changeHandler': () => Promise<void>;
    'countable': boolean;
    'disabled': boolean;
    'floatLabel': () => Promise<void>;
    'invalid': boolean;
    'isCountable': () => Promise<void>;
    'isDisabled': () => Promise<void>;
    'isInvalid': () => Promise<void>;
    'isRequired': () => Promise<void>;
    'label': string;
    'maxlength': string;
    'placeholder': string;
    'removeFocusStyle': () => Promise<void>;
    'required': boolean;
    'retriveLabelWidth': (labels: any) => Promise<any>;
    'setLabelWidthToNotch': () => Promise<void>;
    'type': string;
    'value': string;
  }
  interface RsTextfieldTrailing {}
}

declare global {


  interface HTMLRsTextareaElement extends Components.RsTextarea, HTMLStencilElement {}
  var HTMLRsTextareaElement: {
    prototype: HTMLRsTextareaElement;
    new (): HTMLRsTextareaElement;
  };

  interface HTMLRsTextfieldElement extends Components.RsTextfield, HTMLStencilElement {}
  var HTMLRsTextfieldElement: {
    prototype: HTMLRsTextfieldElement;
    new (): HTMLRsTextfieldElement;
  };

  interface HTMLRsTextfieldTrailingElement extends Components.RsTextfieldTrailing, HTMLStencilElement {}
  var HTMLRsTextfieldTrailingElement: {
    prototype: HTMLRsTextfieldTrailingElement;
    new (): HTMLRsTextfieldTrailingElement;
  };
  interface HTMLElementTagNameMap {
    'rs-textarea': HTMLRsTextareaElement;
    'rs-textfield': HTMLRsTextfieldElement;
    'rs-textfield-trailing': HTMLRsTextfieldTrailingElement;
  }
}

declare namespace LocalJSX {
  interface RsTextarea extends JSXBase.HTMLAttributes<HTMLRsTextareaElement> {
    'cols'?: number;
    'countable'?: boolean;
    'disabled'?: boolean;
    'invalid'?: boolean;
    'label'?: string;
    'maxlength'?: string;
    'onChange'?: (event: CustomEvent<any>) => void;
    'placeholder'?: string;
    'required'?: boolean;
    'rows'?: number;
    'type'?: string;
    'value'?: string;
  }
  interface RsTextfield extends JSXBase.HTMLAttributes<HTMLRsTextfieldElement> {
    'countable'?: boolean;
    'disabled'?: boolean;
    'invalid'?: boolean;
    'label'?: string;
    'maxlength'?: string;
    'onChange'?: (event: CustomEvent<any>) => void;
    'placeholder'?: string;
    'required'?: boolean;
    'type'?: string;
    'value'?: string;
  }
  interface RsTextfieldTrailing extends JSXBase.HTMLAttributes<HTMLRsTextfieldTrailingElement> {}

  interface IntrinsicElements {
    'rs-textarea': RsTextarea;
    'rs-textfield': RsTextfield;
    'rs-textfield-trailing': RsTextfieldTrailing;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


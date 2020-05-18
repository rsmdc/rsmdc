import { Component, Host, h } from '@stencil/core'
@Component({
  tag: 'rs-form-field',
  styleUrl: '../../dist/result.css',
  shadow: true
})
  

export class FormField {

  render() {
    return  <Host>
                <p class="rs-form-field">
                  <slot></slot>
                </p>
            </Host>
  }
}

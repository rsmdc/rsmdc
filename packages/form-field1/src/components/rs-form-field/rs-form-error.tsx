import { Component, Host, h } from '@stencil/core'
@Component({
  tag: 'rs-form-error',
  styleUrl: '../../dist/result.css',
  shadow: true
})
export class FormError {
  render() {
    return  <Host>
              <div class="rs-form-line -error">
                <p class="rs-form-error">
                  <slot></slot>
                </p>
              </div>
            </Host>
  }
}

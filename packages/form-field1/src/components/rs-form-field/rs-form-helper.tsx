import { Component, Host, h } from '@stencil/core'
@Component({
  tag: 'rs-form-helper',
  styleUrl: '../../dist/result.css',
  shadow: true
})
export class FormHelper {
  render() {
    return  <Host>
              <div class="rs-form-line -helper">
                <p class="rs-form-helper">
                  <slot></slot>
                </p>
              </div>
            </Host>
  }
}

import { Component, Element, Prop, Watch, Event, EventEmitter, Method, Host, h } from '@stencil/core';
import { RSCheckbox } from '../../utils/index'
@Component({
  tag: 'rs-checkbox',
  styleUrl: '../../dist/result.css',
  shadow: true
})
export class Checkbox {

  @Element() el: HTMLElement

  @Prop() id: string

  @Prop() name: string

  @Prop() label: string

  @Prop() value: string | number

  @Prop() checked: boolean

  @Prop() disabled: boolean

  @Prop() indeterminate: boolean

  @Prop({
    mutable: true
  }) dataChecked: string = ''

  rsCheckbox: RSCheckbox

  checkbox: Element

  nativeControl: Element

  @Watch('checked')
  checkedHandler() {
    this.isHostChecked()
  }

  @Watch('disabled')
  disabledHandler() {
    this.isDisabled()
  }

  @Watch('indeterminate')
  indeterminateHandler() {
    this.isHostIndeterminate()
  }

  @Event({
    cancelable: false,
    composed: false,
  }) change: EventEmitter

  @Method()
  async activateRipple() {
    this.rsCheckbox.ripple.activate()
    setTimeout(() => { // TODO
      this.rsCheckbox.ripple.deactivate()
    }, 200)
  }

  @Method()
  async isDisabled() {
    if (this.disabled) {
      this.checkbox.classList.add('-disabled')
    } else {
      this.checkbox.classList.remove('-disabled')
    }
  }

  @Method()
  async isHostChecked() {
    if (!this.rsCheckbox) return
    this.rsCheckbox.checked = this.checked
    this.updateDataChecked()
    this.isChecked()
  }

  @Method()
  async isChecked() {
    if (this.dataChecked) {
      this.checkbox.classList.add('-checked')
    } else {
      this.checkbox.classList.remove('-checked')
    }
  }

  @Method()
  async isIndeterminate() {
    if (this.rsCheckbox.indeterminate) {
      this.checkbox.classList.add('-indeterminate')
    } else {
      this.checkbox.classList.remove('-indeterminate')
    }
  }

  @Method()
  async isHostIndeterminate() {
    this.rsCheckbox.indeterminate = this.indeterminate
  }

  @Method()
  async updateDataChecked() {
    const isChecked = this.rsCheckbox.checked ? 'checked' : ''
    await this.el.setAttribute('data-checked', isChecked)
  }

  componentDidLoad() {
    this.checkbox = this.el.shadowRoot.querySelector('.rs-checkbox')
    this.rsCheckbox = new RSCheckbox(this.el.shadowRoot.querySelector('.container'))
    this.nativeControl = this.el.shadowRoot.querySelector('.nativecontrol')
    const labelEl = this.el.shadowRoot.querySelector('.label')

    this.isDisabled()
    this.isHostChecked()
    this.isHostIndeterminate()
    this.isIndeterminate()

    this.checkbox.addEventListener('mouseover', e => {
      if (e.target === labelEl) { return }
      this.rsCheckbox.ripple.layout()
    })

    this.checkbox.addEventListener('click', async e => {
      if (e.target === labelEl) { return }
      const value = this.value 
        ? this.value
        : (this.nativeControl as HTMLInputElement).checked

      await this.updateDataChecked()
      await this.isChecked()
      await this.isIndeterminate()
      await this.change.emit({ value })
    })

    labelEl.addEventListener('click', () => {
      this.activateRipple()
    })
  }

  render() {
    return  <Host>
              <div class="rs-checkbox">
                <div class="container">
                  <input
                    id={this.id}
                    name={this.name}
                    type="checkbox"
                    class="nativecontrol" />
                  <div class="background">
                    <svg class="checkmark" viewBox="0 0 24 24">
                      <path
                        class="checkmarkpath"
                        fill="none"
                        d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                    </svg>
                    <div class="mixedmark" />
                  </div>
                </div>
                <label class="label" htmlFor={this.id} >{this.label}</label>
              </div>
            </Host>
  }
}

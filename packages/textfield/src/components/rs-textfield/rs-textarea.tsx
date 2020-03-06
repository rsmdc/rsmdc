import { Component, Element, Prop, Watch, Event, EventEmitter, Method, Host, h } from '@stencil/core'
import { RSRipple } from '@rsmdc/ripple'
import { RSLineRipple } from '@rsmdc/line-ripple'

@Component({
  tag: 'rs-textarea',
  styleUrl: '../../dist/result.css',
  shadow: true
})
export class Textarea {

  @Element() el: HTMLElement

  @Prop() label: string

  @Prop() disabled: boolean

  @Prop() invalid: boolean

  @Prop() required: boolean

  @Prop() countable: boolean

  @Prop() value: string = ''

  @Prop() placeholder: string = ''

  @Prop() maxlength: string = ''

  @Prop() cols: number

  @Prop() rows: number

  textarea: Element

  labels: Element[]

  nativeControl: Element

  htmlNativeConctrol: HTMLTextAreaElement

  notch: HTMLElement

  counter: Element

  rsRipple: RSRipple

  rsLineRipple: RSLineRipple

  @Event({
    cancelable: false,
    composed: false,
  }) change: EventEmitter

  @Event({
    cancelable: false,
    composed: false,
  }) input: EventEmitter

  @Watch('disabled')
  disabledHandler() {
    this.isDisabled()
  }

  @Watch('invalid')
  invalidHandler() {
    this.isInvalid()
  }

  @Watch('required')
  requiredHandler() {
    this.isRequired()
  }

  @Watch('countable')
  countableHandler() {
    this.isCountable()
  }

  @Watch('value')
  valueHandler(newVal: string) {
    this.valueChanged(newVal)
  }

  @Method()
  async isDisabled() {
    if (this.disabled) {
      this.textarea.classList.add('-disabled')
    } else {
      this.textarea.classList.remove('-disabled')
    }
  }

  @Method()
  async isInvalid() {
    if (this.invalid) {
      this.textarea.classList.add('-invalid')
    } else {
      this.textarea.classList.remove('-invalid')
    }
  }

  @Method()
  async isRequired() {
    if (this.required) {
      this.textarea.classList.add('-required')
    } else {
      this.textarea.classList.remove('-required')
    }
  }

  @Method()
  async isCountable() {
    if (this.countable) {
      this.counter.classList.remove('-hidden')
    } else {
      this.counter.classList.add('-hidden')
    }
  }

  @Method()
  async floatLabel() {
    this.labels.forEach(l => { 
      l.classList.add('-floatabove')
    })
    this.setLabelWidthToNotch()
  }

  @Method()
  async setLabelWidthToNotch() {
    const labelWidth = await this.retriveLabelWidth(this.labels)
    const width = labelWidth * 0.75 + 8
    this.notch.style.setProperty('width', `${width}px`)
    if (!this.notch.classList.contains('-border')) {
      this.notch.classList.add('-border')
    }
  }

  @Method()
  async addFocusStyle() {
    this.textarea.classList.add('-focused')
    this.textarea.classList.add('rs-ripple-upgraded--background-focused')
    this.rsLineRipple.activate()
    this.labels.forEach(l => { 
      l.classList.add('-floatabove')
      this.notch.classList.add('-border')
      if (!l.classList.contains('-shake')) return
      l.classList.remove('-shake')
    })
    this.setLabelWidthToNotch()
  }

  @Method()
  async removeFocusStyle() {
    this.textarea.classList.remove('-focused')
    this.textarea.classList.remove('rs-ripple-upgraded--background-focused')
    this.rsLineRipple.activate()

    this.labels.forEach(l => {
      if (this.invalid && this.value) l.classList.add('-shake')
      if (this.value) return
      l.classList.remove('-floatabove')
      this.notch.classList.remove('-border')
      this.notch.style.setProperty('--width', 'auto')
    })
  }

  @Method()
  async retriveLabelWidth(labels) {
    return labels.reduce((res, l) => {
      return res > l.clientWidth
        ? res
        : l.clientWidth
    }, 0)
  }

  @Method()
  async changeHandler() {
    this.value = this.htmlNativeConctrol.value
    this.change.emit({ value: this.value })
  }

  @Method()
  async inputHandler() {
    this.value = this.htmlNativeConctrol.value
    this.input.emit({ value: this.value })
  }

  @Method()
  async valueChanged(newVal) {
    if (!this.htmlNativeConctrol)
      this.htmlNativeConctrol = this.el.shadowRoot.querySelector('.nativecontrol') as HTMLTextAreaElement
    if (this.htmlNativeConctrol && this.htmlNativeConctrol.value !== newVal) {
      this.htmlNativeConctrol.value = newVal

      if (!newVal) return this.removeFocusStyle()
      this.floatLabel()
    }
  }

  componentDidLoad() {
    this.textarea = this.el.shadowRoot.querySelector('.rs-textfield')
    this.labels = Array.from(this.el.shadowRoot.querySelectorAll('.label'))
    this.nativeControl = this.el.shadowRoot.querySelector('.input')
    this.htmlNativeConctrol = (this.nativeControl as HTMLTextAreaElement)
    this.notch = this.el.shadowRoot.querySelector('.notch')
    this.counter = this.el.shadowRoot.querySelector('.counter')
    this.rsLineRipple = new RSLineRipple(this.el.shadowRoot.querySelector('.rs-line-ripple'))
    this.rsRipple = new RSRipple(this.textarea)
    
    this.isDisabled()
    this.isInvalid()
    this.isRequired()
    this.isCountable()

    if (this.value) {
      this.htmlNativeConctrol.value = this.value
      this.floatLabel()
    }
    
    this.nativeControl.addEventListener('focus', () => {
      this.addFocusStyle()
    })

    this.nativeControl.addEventListener('change', () => {
      this.changeHandler()
    })

    this.nativeControl.addEventListener('input', () => {
      this.inputHandler()
    })

    this.nativeControl.addEventListener('blur', () => {
      this.removeFocusStyle()
    })
  }

  componentDidUnLoad() {
    this.nativeControl.removeEventListener('focus', () => {
      this.addFocusStyle()
    })

    this.nativeControl.removeEventListener('change', () => {
      this.changeHandler()
    })

    this.nativeControl.removeEventListener('blur', () => {
      this.removeFocusStyle()
    })

    this.nativeControl.removeEventListener('input', () => {
      this.inputHandler()
    })
  }

  render() {
    return  <Host>
              <div class="rs-textfield -outlined -textarea">
                <div class="form -textarea">
                  <textarea class="input" cols={this.cols} rows={this.rows} placeholder={this.placeholder} maxlength={this.maxlength} />
                </div>
                <div class="rs-line-ripple -none" />
                <div class="outline -area">
                  <div class="leading" />
                  <div class="notch">
                    <label class="label -outlined">{ this.label }</label>
                  </div>
                  <div class="trailing" />
                </div>
                <div class="counter -none -textarea">{ `${this.value.length} / ${this.maxlength}` }</div>
              </div>
            </Host>
  }
}
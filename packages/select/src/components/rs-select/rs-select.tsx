import { Component, Element, Prop, Watch, Event, EventEmitter, Method, Host, h } from '@stencil/core'
import { RSRipple } from '@rsmdc/ripple'
import { RSLineRipple } from "@rsmdc/line-ripple"

@Component({
  tag: 'rs-select',
  styleUrls: [
    '../../dist/result.css',
    '../../styles/_material-icons.scss'
  ],
  shadow: true
})
export class Select {

  @Element() el: HTMLElement

  @Prop() name: string

  @Prop() label: string

  @Prop() disabled: boolean

  @Prop() invalid: boolean

  @Prop() required: boolean

  @Prop() multiple: boolean = false

  @Prop() value: string

  select: Element

  labels: Element[]

  options: Element[]

  nativeControl: Element

  htmlNativeConctrol: HTMLSelectElement

  notch: HTMLElement

  rsRipple: RSRipple

  rsLineRipple: RSLineRipple

  @Event({
    cancelable: false,
    composed: false,
  }) change: EventEmitter

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

  @Watch('multiple')
  multipleHandler() {
    this.isMultiple()
  }

  @Method()
  async isDisabled() {
    if (this.disabled) {
      this.select.classList.add('-disabled')
    } else {
      this.select.classList.remove('-disabled')
    }
  }

  @Method()
  async isInvalid() {
    if (this.invalid) {
      this.select.classList.add('-invalid')
    } else {
      this.select.classList.remove('-invalid')
    }
  }

  @Method()
  async isRequired() {
    if (this.required) {
      this.select.classList.add('-required')
    } else {
      this.select.classList.remove('-required')
    }
  }

  @Method()
  async isMultiple() {
    if (!this.multiple) return
    this.floatLabel()
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
    const width = labelWidth * 0.8 + 4
    this.notch.style.setProperty('width', `${width}px`)
  }

  @Method()
  async addFocusStyle() {
    this.select.classList.add('-focused')
    this.select.classList.add('rs-ripple-upgraded--background-focused')
    this.rsLineRipple.activate()
    this.labels.forEach(l => {
      l.classList.add('-floatabove')
      if (!l.classList.contains('-shake')) { return }
      l.classList.remove('-shake')
    })
    this.setLabelWidthToNotch()
  }

  @Method()
  async removeFocusStyle() {
    this.select.classList.remove('-focused')
    this.select.classList.remove('rs-ripple-upgraded--background-focused')
    this.rsLineRipple.deactivate()

    this.labels.forEach(l => {
      if (this.invalid && this.value) l.classList.add('-shake')
      if (this.value) return
      l.classList.remove('-floatabove')
      this.notch.style.setProperty('width', 'auto')
    })
  }

  @Method()
  async hasSelectedOption(options) {
    if (options.find(op => op.getAttribute('selected'))) {
      this.floatLabel()
      return
    }
    this.htmlNativeConctrol.selectedIndex = -1
  }

  @Method()
  async retrieveOptionWidth(options) {
    const longText = options.reduce((res, op) => {
      return res > op.text.length
        ? res
        : op.text.length
    }, 0)
    return longText * 16
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
    const selectedIndex = this.htmlNativeConctrol.selectedIndex
    const values = Array.from(this.htmlNativeConctrol.selectedOptions)
      .map(op => op.value)

    this.change.emit({
      value: values.length > 1 ? values : values[0],
      index: selectedIndex
    })

    if (this.options.length === 0) return

    this.options.forEach((option, i) => {
      if (i === selectedIndex) {
        option.setAttribute('data-selected', 'true')
      } else {
        option.removeAttribute('data-selected')
      }
    })
  }

  componentDidLoad() {
    this.select = this.el.shadowRoot.querySelector('.rs-select')
    this.labels = Array.from(this.el.shadowRoot.querySelectorAll('.label'))
    this.nativeControl = this.el.shadowRoot.querySelector('.nativecontrol')
    this.htmlNativeConctrol = (this.nativeControl as HTMLSelectElement);
    this.notch = this.el.shadowRoot.querySelector('.notch')
    this.rsLineRipple = new RSLineRipple(this.el.shadowRoot.querySelector('.rs-line-ripple'))
    this.rsRipple = new RSRipple(this.select)
    this.options = []
    const slot = this.el.shadowRoot.querySelector('slot')

    this.isDisabled()
    this.isInvalid()
    this.isRequired()
    this.isMultiple()

    slot.addEventListener('slotchange', async () => {
      slot.assignedElements().forEach(e => {
        this.options.push(e)
      })

      if (this.options.length === 0) return

      this.nativeControl.innerHTML = ''
      this.options.forEach(op => {
        // Display initial value (current not support for multiple select)
        if (!this.multiple && this.value) {
          if (op.getAttribute('value') == this.value) {
            ;(op as HTMLOptionElement).setAttribute('selected', 'true')
          }
        }

        this.nativeControl.append(op.cloneNode(true))
      })

      const optionWidth = await this.retrieveOptionWidth(this.options)
      const labelWidth = await this.retriveLabelWidth(this.labels)
      const width = optionWidth > labelWidth
        ? optionWidth
        : labelWidth
      ;(this.select as HTMLElement).style.setProperty('--width', `calc(52px + 16px + ${width}px`)
      this.hasSelectedOption(this.options)
    })

    this.nativeControl.addEventListener('focus', () => {
      this.addFocusStyle()
    })

    this.nativeControl.addEventListener('change', () => {
      this.changeHandler()
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
  }

  render() {
    return <Host>
              <div class="rs-select">
                <i class="dropdownicon material-icons">arrow_drop_down</i>
                <select class="nativecontrol" multiple={this.multiple}>
                  <slot />
                </select>
                <label class="label">{this.label}</label>
                <div class="rs-line-ripple" />
                <div class="outline">
                  <div class="leading" />
                  <div class="notch">
                    <label class="label -outlined">{this.label}</label>
                  </div>
                  <div class="trailing" />
                </div>
              </div>
            </Host>
  }
}

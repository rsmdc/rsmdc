import { Component, Element, Prop, State, Watch, Method, Host, h } from '@stencil/core';

@Component({
  tag: 'rs-app-bar',
  styleUrl: '../../dist/result.css',
  shadow: true
})
export class AppBar {

  @Element() el: HTMLElement

  @Prop() fixed: boolean

  @State() isDrawer: boolean

  @State() isScrolling: boolean

  appBar: HTMLElement

  hasAppBarTool: boolean

  topLimit: number

  windowScrollTop: number = 0

  scrollTop: number = 0

  appBarHeight: number = 56

  withProminentAppBarHeight: number = 128

  appBarPadding: number = 12

  withCollapsedAppBarPadding: number = 4

  @Watch('fixed')
  fixedHandler() {
    this.isFixed()
  }

  @Watch('isScrolling')
  isScrollingHandler() {
    if (this.isScrolling && !this.appBar.classList.contains('-fixed-scrolled')) {
      this.appBar.classList.add('-fixed-scrolled')
    } else if (!this.isScrolling) {
      this.appBar.classList.remove('-fixed-scrolled')
    }
  }

  @Method()
  async isFixed() {
    if (this.fixed) {
      this.appBar.classList.add('-fixed')
    } else {
      this.appBar.classList.remove('-fixed')
    }
  }
  
  componentDidLoad() {
    this.appBar = this.el.shadowRoot.querySelector('.rs-app-bar')
    this.topLimit = -(this.appBarHeight * 2)
    const slotEl = this.el.shadowRoot.querySelector('slot')
    // const appBarStyle = window.getComputedStyle(this.el)

    this.isFixed()

    // TODO (If host component has other classname, disappear this component when properties changes)
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.attributeName === 'class' && !this.el.classList.contains('hydrated')) {
          this.el.classList.add('hydrated')
        }
      })
    })
    observer.observe(this.el, {
      attributes: true
    })

    slotEl.addEventListener('slotchange', () => {
      const toolEl = slotEl.assignedNodes().filter(node => node.nodeName === 'RS-APP-BAR-TOOL')
      this.hasAppBarTool = toolEl.length > -1 ? true : false

      if (this.hasAppBarTool) {
        const itemLengh = Array.from(toolEl[0].childNodes).filter(child => child.nodeType === 1).length
        const withCollapsedWidth = (this.appBarHeight * itemLengh) + this.appBarHeight - this.appBarPadding + this.withCollapsedAppBarPadding
        this.appBar.style.cssText = `--rs-top-app-bar__collapsed--width: ${withCollapsedWidth}px;`
      }
    })

    window.onscroll = () => {
      // const appBarType = appBarStyle.getPropertyValue('--rs-app-bar-type')
      let top = window.pageYOffset
      const diff = this.windowScrollTop - top
      this.isScrolling = top > 0

      if (this.fixed) { return }

      if(top < this.windowScrollTop) {
        // scroll up

        if(this.scrollTop === 0) {
          this.windowScrollTop = top
          return
        }

        const scrollTopHarf = this.topLimit / 2
        const startTopPosition = this.scrollTop === this.topLimit 
          ? scrollTopHarf 
          : this.scrollTop + diff
        this.scrollTop  = startTopPosition > 0 ? 0 : startTopPosition
        this.appBar.style.setProperty('top', `${this.scrollTop}px`)
        this.windowScrollTop = top

      } else {
        // scroll down

        const moving = this.scrollTop + diff
        const startTopPosition = -top > this.topLimit 
          ? -top : moving < this.topLimit 
          ? this.topLimit : moving
        this.scrollTop = startTopPosition
        this.appBar.style.setProperty('top', `${this.scrollTop}px`)
        this.windowScrollTop = top    
      }
    }
  }

  render() {
    return  <Host>
              <header class="rs-app-bar">
                <div class="row">
                  <div class="section">
                    <slot></slot>
                  </div>
                </div>
              </header>
              <div class="rs-app-bar-content" />
            </Host>
  }
}

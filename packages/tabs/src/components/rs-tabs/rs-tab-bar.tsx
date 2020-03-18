import { Component, Element, h, Host, Method } from '@stencil/core'
import ResizeObserver from 'resize-observer-polyfill'

@Component({
  tag: 'rs-tab-bar',
  styleUrl: '../../dist/result.css',
  shadow: true
})

export class TabBar {

  @Element() el: Element

  @Method()
  async wrap(element, wrapper) {
    element.parentNode.insertBefore(wrapper, element)
    wrapper.appendChild(element)
  }

  @Method()
  async setIndicatorStyle(position, width) {
    const indicator = (this.el.shadowRoot.querySelector('.rs-tab-indicator') as HTMLScriptElement)
    indicator.style.setProperty('left', `${position}px`)
    indicator.style.setProperty('width', `${width}px`)
  }

  @Method()
  async setScrollPosition(scrollArea, left) {
    scrollArea.scrollTo({
      top: 0,
      left: left,
      behavior: 'smooth'
    })
  }

  async componentDidLoad() {
    const slot = this.el.shadowRoot.querySelector('slot')
    const tabs = Array.from(slot.assignedElements())
    const tabItem = tabs.find(tab => tab.tagName === 'RS-TAB-ITEM')
    const tabItemEl = tabItem.shadowRoot.querySelector('.rs-tab')
    const indicator = (this.el.shadowRoot.querySelector('.rs-tab-indicator') as HTMLScriptElement)

    tabs.forEach((item, i) => {
      const itemEl = item.shadowRoot.querySelector('.rs-tab')

      itemEl.addEventListener('click', () => {
        const scrollArea = this.el.shadowRoot.querySelector('.scrollarea')
        const scrollAreaWidth = this.el.shadowRoot.querySelector('.scrollarea').clientWidth
        const scrollAreaLeft = this.el.shadowRoot.querySelector('.scrollarea').getBoundingClientRect().left
        const tabLeftPosition = itemEl.getBoundingClientRect().left
        const tabRightPosition = itemEl.getBoundingClientRect().right
    
        indicator.classList.remove('-no-animating')
        
        tabs.forEach((tab, n) => {
          const tabEl = tab.shadowRoot.querySelector('.rs-tab')
          if (i === n) {
            tabEl.classList.add('-activated')
          } else {
            tabEl.classList.remove('-activated')
          }
        })
        if (i === 0 || i === tabs.length - 1) {
        
          if (tabRightPosition > scrollAreaWidth) {
            const left = tabRightPosition + scrollArea.scrollLeft
            this.setScrollPosition(scrollArea, left)
          } else if (tabLeftPosition < 0) {
            this.setScrollPosition(scrollArea, 0)
          }
        } else {
          const rightTabWidth = tabs[i + 1].clientWidth / 3
          const leftTabWidth = tabs[i - 1].clientWidth / 3
          const rightViewPosition = tabRightPosition + rightTabWidth
          const leftViewPosition = tabLeftPosition - leftTabWidth
  
          if (rightViewPosition > scrollAreaWidth) {    
            const diff = rightViewPosition - scrollAreaWidth
            const left = diff + scrollArea.scrollLeft
            this.setScrollPosition(scrollArea, left)      
          } else if (leftViewPosition < 0) {
            const left = scrollArea.scrollLeft + leftViewPosition - scrollAreaLeft
            this.setScrollPosition(scrollArea, left)
          }
        }
      })
    })

    const observer = new ResizeObserver(() => {
      tabs.forEach(tab => {
        const itemEl = tab.shadowRoot.querySelector('.rs-tab')
        const tabWidth = itemEl.clientWidth
        const tabLeft = itemEl.getBoundingClientRect().left
        const scrollAreaLeft = this.el.shadowRoot.querySelector('.scrollarea').getBoundingClientRect().left
        const diff = tabLeft - scrollAreaLeft
        indicator.style.setProperty('--rs-tab-indicator---width', `${tabs[0].clientWidth}px`)

        if (itemEl.classList.contains('-activated')) {
          this.setIndicatorStyle(diff, tabWidth)
        }

        tab.addEventListener('click', () => {
          this.setIndicatorStyle(diff, tabWidth)
        })
      })
    })
    observer.observe(tabItemEl)
  }

  render() {
    return <Host>
            <div class="rs-tab-bar">
              <div class="scroller">
                <div class="scrollarea">
                  <div class="scrollcontent">
                    <slot />
                    <div class="rs-tab-indicator -no-animating"/>
                  </div>
                </div>
              </div>
            </div>
          </Host>
  }
}

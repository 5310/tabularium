import { lit } from "deps"
const { LitElement, css, html, customElement } = lit

const TAGNAME = 't-tabularium'

@customElement(TAGNAME)
export default class CustomElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
      color: red;
    }
  `

  render() {
    return html`
      <h1>Hullo Tabularium!</h1>
      <slot></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [TAGNAME]: CustomElement
  }
}

console.log(CustomElement)

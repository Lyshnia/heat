import { customElement, html } from 'lit-element';
import { View } from '../../views/view';
import '@vaadin/vaadin-checkbox/src/vaadin-checkbox.js';

@customElement('about-view')
export class AboutView extends View {
  render() {
    return html`
<vaadin-checkbox>
  I agree 
</vaadin-checkbox>
`;
  }
}

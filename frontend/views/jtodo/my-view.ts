import {css, customElement, html, internalProperty, LitElement, TemplateResult} from 'lit-element';
import {MVEndpoint} from "Frontend/generated/MVEndpoint";
import {readAsDataURL} from 'promise-file-reader';
import '@vaadin/vaadin-upload';
import '@vaadin/vaadin-button';


@customElement('my-view')
export class MyView extends LitElement {
    static get styles() {
        return css`
      :host {
          display: block;
          height: 100%;
          background-color: red;
      }
      `;
    }

    @internalProperty()
    private names: String = ""

    @internalProperty()
    private img: String = ""

    render(): TemplateResult {
        console.log(this.names)
        return html`<h1>Whats good, ${this.names}!</h1><span>${(this as any).location.params.id}</span><br/>
        <p></p>
        <img src="${this.img}" alt="contact's avatar"/>
        <p>Upload image below</p>

        <vaadin-upload
                capture="camera"
                accept="image/*"
                max-files="1"
                @upload-before="${async (e: CustomEvent) => {
                    const file = e.detail.file;
                    e.preventDefault();
                    const base64Image = await readAsDataURL(file);
                    this.img = base64Image;
                }}"
        ></vaadin-upload>
        `;
    }

    async getNames() {
        this.names = await MVEndpoint.getNames()
    }

    // Remove this method to render the contents of this view inside Shadow DOM
    createRenderRoot() {
        return this;
    }


    connectedCallback() {
        super.connectedCallback();
        this.getNames();
    }
}

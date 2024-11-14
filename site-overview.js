// import { LitElement, html, css } from "lit";
// import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
// import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// export class SiteOverview extends DDDSuper(I18NMixin(LitElement)) {
//   static get properties() {
//     return {
//       title: { type: String },
//       description: { type: String },
//       logo: { type: String },
//       created: { type: String },
//       updated: { type: String },
//       hexCode: { type: String },
//       theme: { type: String },
//       icon: { type: String },
//       url: { type: String },
//     };
//   }

//   constructor() {
//     super();
//     this.title = '';
//     this.description = '';
//     this.logo = '';
//     this.created = '';
//     this.updated = '';
//     this.hexCode = '';
//     this.theme = '';
//     this.icon = '';
//     this.url = '';
//   }

//   static get styles() {
//     return [super.styles, css`
//       .container {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         background-color: var(--site-hex-code);
//         padding: var(--ddd-spacing-4);
//       }
//       .title, .description {
//         margin: var(--ddd-spacing-2);
//       }
//       .logo img {
//         max-width: 100px;
//         max-height: 100px;
//       }
//       .text-container {
//         padding: var(--ddd-spacing-3);
//       }
//       .info-row {
//         display: flex;
//         justify-content: space-between;
//       }
//       .label {
//         font-weight: bold;
//       }
//     `];
//   }

//   render() {
//     return html`
//       <div class="container" style="background-color:${this.hexCode}">
//         <div class="image-container">
//           <div class="logo" ?hidden="${this.logo === ''}">
//             <img src="${this.logo}" alt="${this.title}">
//           </div>
//         </div>

//         <div class="text-container">
//           <div class="title" ?hidden="${this.title === ''}">
//             <a href="${this.url}" target="_blank" rel="noopener noreferrer">
//               <span class="icon" ?hidden="${this.icon === ''}">
//                 <simple-icon icon="${this.icon}"></simple-icon>
//               </span>
//               ${this.title}
//             </a>
//           </div>

//           <div ?hidden="${this.description === ''}">
//             <div class="info-row">
//               <span class="label">Description</span>
//               <span>: ${this.description}</span>
//             </div>
//           </div>

//           <div ?hidden="${this.created === ''}">
//             <div class="info-row">
//               <span class="label">Date created</span>
//               <span>: ${this.created}</span>
//             </div>
//           </div>

//           <div ?hidden="${this.updated === ''}">
//             <div class="info-row">
//               <span class="label">Last updated</span>
//               <span>: ${this.updated}</span>
//             </div>
//           </div>

//           <div ?hidden="${this.theme === ''}">
//             <div class="info-row">
//               <span class="label">Theme</span>
//               <span>: ${this.theme}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   }

//   static get tag() {
//     return "site-overview";
//   }
// }

// customElements.define(SiteOverview.tag, SiteOverview);
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class SiteOverview extends DDDSuper(I18NMixin(LitElement)) {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      logo: { type: String },
      created: { type: String },
      updated: { type: String },
      hexCode: { type: String },
      theme: { type: String },
      icon: { type: String },
      url: { type: String },
    };
  }

  constructor() {
    super();
    this.title = '';
    this.description = '';
    this.logo = '';
    this.created = '';
    this.updated = '';
    this.hexCode = '';
    this.theme = '';
    this.icon = '';
    this.url = '';
  }

  static get styles() {
    return [super.styles, css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--site-hex-code);
        padding: var(--ddd-spacing-4);
      }
      .title, .description {
        margin: var(--ddd-spacing-2);
      }
    `];
  }

  render() {
    return html`
      <div class="container" style="background-color:${this.hexCode}">
        <div class="image-container">
          <div class="logo" ?hidden="${this.logo === ''}">
            <img src="${this.logo}" alt="${this.title}">
          </div>
        </div>

        <div class="text-container">
          <!-- Title with link to the associated webpage -->
          <div class="title" ?hidden="${this.title === ''}">
            <a href="${this.url}" target="_blank" rel="noopener noreferrer">
              <span class="icon" ?hidden="${this.icon === ''}">
                <simple-icon icon="${this.icon}"></simple-icon>
              </span>
              ${this.title}
            </a>
          </div>

          <!-- Other details (Description, Created Date, etc.) -->
          <div ?hidden="${this.description === ''}">
            <div class="info-row">
              <span class="label"><strong>Description</strong></span>
              <span>: ${this.description}</span>
            </div>
          </div>

          <div ?hidden="${this.created === ''}">
            <div class="info-row">
              <span class="label"><strong>Date created</strong></span>
              <span>: ${this.created}</span>
            </div>
          </div>

          <div ?hidden="${this.updated === ''}">
            <div class="info-row">
              <span class="label"><strong>Last updated</strong></span>
              <span>: ${this.updated}</span>
            </div>
          </div>

          <div ?hidden="${this.theme === ''}">
            <div class="info-row">
              <span class="label"><strong>Theme</strong></span>
              <span>: ${this.theme}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return 'site-overview';
  }
}

customElements.define(SiteOverview.tag, SiteOverview);



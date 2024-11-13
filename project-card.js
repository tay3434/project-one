import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class ProjectCard extends DDDSuper(I18NMixin(LitElement)) {
  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      created: { type: String },
      lastUpdated: { type: String },
      logo: { type: String },
      slug: { type: String }
    };
  }

  static get styles() {
    return [super.styles, css`
      .card {
        background-color: var(--ddd-theme-default-linkLight);
        border-radius: var(--ddd-radius-md);
        border: var(--ddd-border-sm);
        padding: var(--ddd-spacing-4);
        width: 300px;
        height: 450px;
        outline: 4px solid  var(--ddd-theme-default-white);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
      }
      .card:hover, .card:focus{
        background-color: var(--ddd-theme-default-white);
      }

      .image-container {
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius:  var(--ddd-radius-sm);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--ddd-radius-sm);
      }
      .info {
        font-size: var(--ddd-font-weight-bold);
        font-weight: var(--ddd-font-weight-bold); 
        text-align: center;
        /* line-height: var(-ddd-lh-120); */
        color: var(--ddd-theme-default-nittanyNavy);
        cursor: pointer;
        text-decoration: underline;
      }
      .description, .created, .lastUpdated {
        font-size: 16px;
        text-align: center;
        color: var(--ddd-theme-default-coalyGray);
      }
   

    `];
  }

  render() {
    return html`
      <div class="card" @click="${this.openSlug}">
        <div class="image-container">
          <img src="${this.logo || 'https://avatars.githubusercontent.com/u/12715666?s=200&v=4'}" alt="${this.title}" />
        </div>
        <div class="info" @click="${this.openTitleLink}">${this.title}</div>
        <div class="description">${this.description}</div>
        <div class="created">Created: ${this.created}</div>
        <div class="lastUpdated">Updated: ${this.lastUpdated}</div>
      </div>
    `;
  }

  openSlug() {
    if (this.slug) {
      window.open(this.slug, '_blank');
    }
  }

  // click on title of card and be directed to associated site in new window
  openTitleLink(e) {
    e.stopPropagation(); 
    if (this.title) {
      window.open(`https://haxtheweb.org/${this.title}`, '_blank');
    }
  }
}

customElements.define('project-card', ProjectCard);



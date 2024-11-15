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
      slug: { type: String },
      jsonUrl: { type: String },
      indexSource: { type: String },
      readTime: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        .card {
          background-color: var(--ddd-theme-default-linkLight);
          border-radius: var(--ddd-radius-md);
          border: var(--ddd-border-sm);
          padding: var(--ddd-spacing-4);
          width: 300px;
          height: 450px;
          outline: 4px solid var(--ddd-theme-default-white);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .card:hover, .card:focus {
          background-color: var(--ddd-theme-default-white);
        }

        .image-container {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info {
          font-weight: var(--ddd-font-weight-bold); 
          text-align: center;
          color: var(--ddd-theme-default-nittanyNavy);
          cursor: pointer;
          text-decoration: underline;
        }

        .description, .created, .lastUpdated {
          font-size: 16px;
          text-align: center;
          color: var(--ddd-theme-default-coalyGray);
        }

        .placeholder {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ddd-theme-default-limestoneLight);
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-weight-regular);
          text-align: center;
          font-family: var(--ddd-font-primary);
        }
      `
    ];
  }

  render() {
    return html`
      <div class="card" @click="${this.openSlug}">
        <div class="image-container">
          ${this.logo
            ? html`<img src="https://haxtheweb.org/${this.logo}"  alt="${this.title}" />`
            : html`<div class="placeholder">No Image</div>`
          }
        </div>
        <div class="info">
          <a href="https://haxtheweb.org/${this.slug}" target="_blank">${this.title}</a>
        </div>
        <div class="description">${this.description}</div>
        <div class="created">Created: ${this.created}</div>
        <div class="lastUpdated">Updated: ${this.lastUpdated}</div>
        <div class="lastUpdated"><a href="${this.indexSource}" target="_blank">Index Source</a></div>
        <div class="lastUpdated">Read Time: ${this.readTime} minutes</div>
      </div>
    `;
  }

  openSlug() {
    if (this.slug) {
      window.open(this.slug, '_blank');
    }
  }
}

customElements.define('project-card', ProjectCard);


    




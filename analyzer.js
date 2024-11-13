import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./project-card.js"; 

export class Analyzer extends DDDSuper(I18NMixin(LitElement)) {
  static get properties() {
    return {
      url: { type: String },
      isValid: { type: Boolean, reflect: true },
      items: { type: Array },
      siteData: { type: Object },
      placeholder: { type: String }
    };
  }

  constructor() {
    super();
    this.url = '';
    this.isValid = false;
    this.items = [];
    this.siteData = {};
    this.placeholder = 'https://haxtheweb.org/site.json';
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--ddd-spacing-5); 
      }
      .search-container {
        display: flex;
        align-items: center;
        border-radius: var(--ddd-radius-xl);
        padding: var(--ddd-spacing-6) var(--ddd-spacing-3);
        max-width: 600px;
        margin: var(--ddd-spacing-5) auto;
      }
      input {
        font-size: var(--ddd-font-weight-medium);
        width: 100%;
        padding: var(--ddd-spacing-3);
        border-radius: var(--ddd-radius-xs);
        border: var(--ddd-border-sm) var(--ddd-theme-default-slateLight) solid;
      }
      .results {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ddd-spacing-4);
        padding: var(--ddd-spacing-5);
        justify-content: center;
      }
    `;
  }

  updated(changedProperties) {
    if (changedProperties.has('url')) {
      this.isValid = this.url && this.url.endsWith('site.json');
    }
  }

  render() {
    return html`
      <div class="search-container">
        <input
          type="text"
          .value="${this.url}"
          placeholder="${this.placeholder}"
          @input="${this._updateUrl}"
          @keydown="${this._handleKeydown}" 
        />
        <button ?disabled="${!this.isValid}" @click="${this._analyze}">Analyze</button>
      </div>
      
      ${this.siteData.name ? this.renderOverview() : ''}
      
      <div class="results">
        ${this.items.map(item => html`
          <project-card
            title="${item.title}"
            description="${item.description}"
            created="${this.formatDate(item.metadata?.created)}"
            lastUpdated="${this.formatDate(item.metadata?.updated)}"
            logo="${this.getLogoUrl(item.metadata?.files?.[0]?.url)}"
            slug="${item.slug}"
          ></project-card>
        `)}
      </div>
    `;
  }

  _updateUrl(e) {
    this.url = e.target.value.trim();
  }

  _handleKeydown(e) {
    if (e.key === 'Enter' && this.isValid) {
      this._analyze();
    }
  }

  async _analyze() {
    if (!this.url.startsWith("https://") && !this.url.startsWith("http://")) {
      this.url = `https://${this.url}`;
    }

    this.items = [];
    this.siteData = {};
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      if (this.validateData(data)) {
        this.siteData = data;
        this.items = data.items || [];
      } else {
        alert("Invalid JSON schema.");
      }
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      alert("Failed to fetch or parse data.");
    }
  }

  validateData(data) {
    return data && data.name && data.description && Array.isArray(data.items) && data.items.length > 0;
  }

  renderOverview() {
    return html`
      <div class="overview">
        <h3>${this.siteData.name}</h3>
        <p>${this.siteData.description}</p>
        <p>Created on: ${this.formatDate(this.siteData.created)}</p>
      </div>
    `;
  }

  formatDate(timestamp) {
    return timestamp ? new Date(parseInt(timestamp) * 1000).toLocaleDateString() : '';
  }

  getLogoUrl(logoUrl) {
    return logoUrl ? logoUrl : "https://via.placeholder.com/150";
  }

  static get tag() {
    return 'analyzer-element';
  }
}

customElements.define(Analyzer.tag, Analyzer);





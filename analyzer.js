import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./project-card.js";
import "./site-overview.js"; // Ensure the site-overview is imported

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
    this.siteData = null;
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
      .overview-container {
        margin-bottom: var(--ddd-spacing-5);
        background-color: var(--ddd-theme-default-lightGray);
        padding: var(--ddd-spacing-4);
        border-radius: var(--ddd-radius-md);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
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

      ${this.siteData && this.siteData.name
        ? html`
          <div class="overview-container">
            <site-overview
              title="${this.siteData.name}"
              description="${this.siteData.description}"
              logo="${this.siteData.logo || ''}"
              created="${this.formatDate(this.siteData.metadata?.created)}"
              updated="${this.formatDate(this.siteData.metadata?.updated)}"
              hexCode="${this.siteData.hexCode || '#ffffff'}"
              theme="${this.siteData.theme || ''}"
              icon="${this.siteData.icon || ''}"
              url="${this.siteData.url || '#'}">
            </site-overview>
          </div>
        ` : ''
      }

      <div class="results">
        ${this.items.map(item => html`
          <project-card
            tabindex="0"
            title="${item.title}"
            description="${item.description}"
            created="${this.formatDate(item.metadata?.created)}"
            lastUpdated="${this.formatDate(item.metadata?.updated)}"
            logo="${item.metadata?.files?.[0]?.url || ''}"
            slug="${item.slug}"
            indexSource="${this.url}${item.location}"
            readTime="${item.metadata?.readTime || ''}"
          ></project-card>
        `)}
      </div>
    `;
  }

  _updateUrl(e) {
    this.url = e.target.value;
  }

  _handleKeydown(e) {
    if (e.key === 'Enter' && this.isValid) {
      this._analyze();
    }
  }

  async _analyze() {
    this.loading = true;
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      if (this.validateSchema(data)) {
        this.processData(data);
      } else {
        alert("Invalid JSON schema");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Invalid URL or network error");
    } finally {
      this.loading = false;
    }
  }

  validateSchema(data) {
    return data && Array.isArray(data.items) && data.items.length > 0;
  }

  processData(data) {
    this.items = data.items;
    this.siteData = data;
  }

  formatDate(timestamp) {
    return timestamp ? new Date(parseInt(timestamp) * 1000).toLocaleDateString() : '';
  }

  static get tag() {
    return 'analyzer-element';
  }
}

customElements.define(Analyzer.tag, Analyzer);




import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./project-card.js";
import "./site-overview.js"; // Import SiteOverview component

export class ProjectOne extends DDDSuper(I18NMixin(LitElement)) {
  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      siteData: { type: Object },
      jsonUrl: { type: String, attribute: 'json-url' }
    };
  }

  constructor() {
    super();
    this.items = [];
    this.title = '';
    this.loading = false;
    this.jsonUrl = '';
    this.siteData = null;
  }

  static get styles() {
    return [super.styles, css`
      :host {
        display: block;
        width: 100%;
      }
      .results {
        opacity: ${this.loading ? 0.1 : 1};
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        gap: var(--ddd-spacing-4);
        padding: var(--ddd-spacing-5);
      }
      .overview-container {
        margin-bottom: var(--ddd-spacing-5);
        background-color: var(--ddd-theme-default-lightGray);
        padding: var(--ddd-spacing-4);
        border-radius: var(--ddd-radius-md);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 100%;
      }
      .search-container {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--ddd-radius-md);
        border: var(--ddd-border-sm);
        padding: var(--ddd-spacing-3);
        max-width: 600px;
        margin: var(--ddd-spacing-2) auto;
      }
      .search-input {
        flex: 1;
        font-size: var(--ddd-font-weight-medium);
        border: none;
      }
      .search-input:focus {
        outline: none;
      }
      button {
        border-radius: var(--ddd-radius-sm);
        padding: var(--ddd-spacing-2);
        font-size: var(--ddd-font-weight-medium);
        cursor: pointer;
        margin-left: var(--ddd-spacing-3);
        font-family: var(--ddd-font-primary);
        background-color: var(--ddd-theme-default-athertonViolet);
        color: var(--ddd-theme-default-white);
        border: solid var(--ddd-theme-default-white);
      }
      button:hover, button:focus{
        background-color: var(--ddd-theme-default-alertImmediate);
      }
      button[disabled]{
        opacity: 0.75;
      }
      project-card:focus{
        outline: 2px solid var(--ddd-theme-default-athertonViolet);
        outline-offset: 2px;
        border-radius: var(--ddd-radius-md);
        background-color: var(--ddd-theme-default-white);
      }
    `];
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <div class="search-container">
        <input 
          id="input"
          class="search-input" 
          placeholder="https://haxtheweb.org/site.json" 
          @input="${this.inputChanged}" 
          @keydown="${this._handleKeydown}" />
        <button ?disabled="${!this.isValid}" @click="${this._analyze}">Analyze</button>
      </div>

      ${this.siteData?.name
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
          </div>`
        : ''
      }

      <div class="results">
        ${this.items.map(item => html`
          <project-card

            title="${item.title}"
            description="${item.description}"
            created="${this.formatDate(item.metadata?.created)}"
            lastUpdated="${this.formatDate(item.metadata?.updated)}"
            logo="${this.getLogoUrl(item.metadata?.files?.[0]?.url)}"
            slug="${item.slug}"
            url="${item.url}"
          ></project-card>
        `)}
      </div>
    `;
  }

  inputChanged(e) {
    this.jsonUrl = e.target.value.trim();
    this.isValid = !!this.jsonUrl;
  }

  _handleKeydown(e) {
    if (e.key === 'Enter' && this.isValid) {
      this._analyze();
    }
  }

  async _analyze() {
    if (!this.jsonUrl.startsWith("http://") && !this.jsonUrl.startsWith("https://")) {
      this.jsonUrl = `https://${this.jsonUrl}`;
    }
    if (!this.jsonUrl.endsWith("site.json")) {
      this.jsonUrl = `${this.jsonUrl.replace(/\/?$/, '')}/site.json`;
    }

    this.loading = true;
    try {
      const response = await fetch(this.jsonUrl);
      const data = await response.json();
      if (this.validateSchema(data)) {
        this.processData(data);
      } else {
        alert("Invalid JSON schema");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Invalid Search.");
    } finally {
      this.loading = false;
    }
  }

  validateSchema(data) {
    return data && Array.isArray(data.items) && data.items.length > 0;
  }

  processData(data) {
    this.items = data.items;
    this.title = data.name;
    this.siteData = data; // Store site data for site overview
  }

  formatDate(timestamp) {
    return timestamp ? new Date(parseInt(timestamp) * 1000).toLocaleDateString() : '';
  }

  getLogoUrl(url) {
    return url || 'https://via.placeholder.com/150';
  }

  static get tag() {
    return 'project-one';
  }
}

customElements.define(ProjectOne.tag, ProjectOne);


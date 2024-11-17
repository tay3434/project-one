import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./project-card.js";
import "./site-overview.js"; 

import '@haxtheweb/hax-iconset/hax-iconset.js';
import '@haxtheweb/simple-icon/simple-icon.js';

export class ProjectOne extends DDDSuper(I18NMixin(LitElement)) {

  static get properties() {
    return {
      title: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array },
      data: { type: Object },
      jsonUrl: { type: String, attribute: 'json-url' }
    };
  }

  constructor() {
    super();
    this.items = [];
    this.title = '';
    this.loading = false;
    this.jsonUrl = '';
    this.data = null;
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
        display: flex;
        margin: 0 auto;
        padding: var(--ddd-spacing-4);
        width: 100%;
        align-items: center; 
        justify-content: center;
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
      button:hover, button:focus {
        background-color: var(--ddd-theme-default-alertImmediate);
      }
      button[disabled] {
        opacity: 0.75;
      }
      project-card:focus {
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

     ${this.data?.name
        ? html` 
          <div class="overview-container">
          <site-overview
              title="${this.data.name}"
              description="${this.data.description}"
              logo="${this.data.metadata.site.logo}"
              created="${this.formatDate(this.data.metadata.site.created)}"
              updated="${this.formatDate(this.data.metadata.site.updated)}"
              hexCode="${this.data.metadata.theme.variables.hexCode}"
              theme="${this.data.metadata.theme.name}"
              icon="${this.data.metadata.theme.variables.icon}"
              jsonUrl="${this.jsonUrl}"   
          ></site-overview>
          </div>
        ` : ""
      } 

          <div class="results">
        ${this.items.map(item => 
          html`
          <project-card
            title="${item.title}"
            description="${item.description}"
            created="${this.formatDate(item.metadata.created)}"
            lastUpdated="${this.formatDate(item.metadata.updated)}"
            logo="${this.getLogoUrl(item.metadata?.files?.[0]?.url)}"
            slug="https://haxtheweb.org/${item.slug}"
            location="https://haxtheweb.org/${item.location}"
            jsonUrl="${item.jsonUrl}"
            readTime="${item.readTime}"
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
      console.log("Fetched data:", data);
  
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
    console.log("Processing data:", data);
    
    this.data = {
      name: data.title || "No Title Provided",
      description: data.description || "No description available",
      metadata: {
        site: data.metadata?.site || {},
        theme: data.metadata?.theme || {}
      }
    };
    
    this.items = data.items.map(item => ({
      ...item,
      readTime: item.metadata?.readtime || "Unknown",
      logo: data.metadata?.site?.logo || ""
    }));
  
  }
  

  formatDate(timestamp) {
    return timestamp ? new Date(parseInt(timestamp) * 1000).toLocaleDateString() : '';
  }

  getLogoUrl(jsonUrl) {
    return jsonUrl;
  }

  static get tag() {
    return 'project-one';
  }
}

customElements.define(ProjectOne.tag, ProjectOne);




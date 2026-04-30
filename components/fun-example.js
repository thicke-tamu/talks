// Define class.
class FunExample extends HTMLElement {
    static observedAttributes = ['title'];
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const template = parsedHtml.getElementById('fun-example');
        const templateContent = template.content;
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
    connectedCallback() {
        setTitle(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        setTitle(this);
    }
}

// Helper variables.
const html = `
<template id="fun-example">
    <style>
        div.container {
            margin: 1em 0em;
        }
        h6.title {
            --border-radius: 3px;
            margin: 0 0 0 0.3em;
            padding: 0.2em 0.5em;
            background-color: #DDDDDD;
            border-top-left-radius: var(--border-radius);
            border-top-right-radius: var(--border-radius);
            display: inline-block;
            font-size: 1rem;
        }
        div.line {
            margin-top: 0px;
            margin-bottom: 0.6em;
            height: 2px;
            background: linear-gradient(90deg, #AAAAAAFF, #AAAAAAFF 20%, #AAAAAA00 60%);
        }
    </style>
    <div class="container">
        <h6 class="title" id="title">Example</h6>
        <div class="line"></div>
        <slot></slot>
    </div>
</template>`;

const parser = new DOMParser();
const parsedHtml = parser.parseFromString(html, "text/html");

// Helper function.
function setTitle(el) {
    const title = el.getAttribute('title');
    const shadowRoot = el.shadowRoot;
    const headerEl = shadowRoot.querySelector('#title');
    if (title) {
        headerEl.innerText = title;
    }
}

// Add element to the list of customElements.
customElements.define('fun-example', FunExample);
if (!window.chewyCustomElements) {
    window.chewyCustomElements = {};
}
window.chewyCustomElements['fun-example'] = { isInline: false }
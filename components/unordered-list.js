// Define class.
class UnorderedList extends HTMLElement {
    static observedAttributes = [];
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        createList(this);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        //createList(this);
    }
}

// Helper function.
function createList(el) {
    const html = `
<template id="unordered-list">
    <ul class="container" role="list">
        <slot></slot>
    </ul>
</template>`;
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(html, "text/html");
    const template = parsedHtml.getElementById('unordered-list');
    const templateContent = template.content;
    const shadowRoot = el.shadowRoot;
    shadowRoot.appendChild(templateContent.cloneNode(true));
}

// Add element to the list of customElements.
customElements.define('unordered-list', UnorderedList);
if (!window.chewyCustomElements) {
    window.chewyCustomElements = {};
}
window.chewyCustomElements['unordered-list'] = { isInline: false }
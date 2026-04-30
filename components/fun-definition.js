// Define class.
class FunDefinition extends HTMLElement {
    static observedAttributes = ['title', 'prefix'];
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const template = parsedHtml.getElementById('fun-definition');
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
<template id="fun-definition">
    <style>
        div.container {
            --box-border-width: 3px;
            --title-vertical-margin: 0.35em;
            --first-and-last-para-margin: 0.7em;
            --main-color: #228822;
            --second-color: #80B380;
            --title-total-height: calc(1lh + var(--title-vertical-margin)*2);
            --title-vertical-offset: calc(var(--title-total-height)*0.5 + var(--box-border-width)*0.5);
            margin: 1em 0;
            padding-top: calc(var(--title-vertical-offset) - var(--box-border-width));
            break-inside: avoid;
        }
        h6.title {
            position: absolute;
            top: calc(0px - var(--title-vertical-offset));
            left: 0.3em;
            margin: 0;
            padding: var(--title-vertical-margin) 0.6em;
            background-color: var(--main-color);
            color: white;
            border-width: 0px;
            border-radius: 2px;
            font-size: 1rem;
        }
        div.body {
            position: relative;
            border: var(--box-border-width) solid var(--second-color);
            border-radius: 2px;
        }
        div.holder {
            margin: calc(var(--title-total-height) - var(--title-vertical-offset) + var(--first-and-last-para-margin)) 0.5em var(--first-and-last-para-margin);
        }
        ::slotted(p:first-child) {
            margin-top: var(--first-and-last-para-margin);
        }
        ::slotted(p:last-child) {
            margin-bottom: var(--first-and-last-para-margin);
        }
    </style>
    <div class="container">
        <div class="body">
            <h6 class="title" id="title">Definition</h6>
            <div class="holder"><slot></slot></div>
        </div>
    </div>
</template>`;

const parser = new DOMParser();
const parsedHtml = parser.parseFromString(html, "text/html");

// Helper funciton.
function setTitle(el) {
    const title = el.getAttribute('title');
    const prefix = el.getAttribute('prefix');
    const shadowRoot = el.shadowRoot;
    const headerEl = shadowRoot.querySelector('#title');
    if (prefix && title) {
        headerEl.innerText = `${prefix}: ${title}`;
    } else if (prefix && !title) {
        headerEl.innerText = `${prefix}`;
    } else if (prefix == '' && title) {
        headerEl.innerText = `${title}`;
    } else if (!prefix && title) {
        headerEl.innerText = `Definition: ${title}`;
    } else if (!prefix && !title) {
        headerEl.innerText = `Definition`;
    }
}

// Add element to the list of customElements.
customElements.define('fun-definition', FunDefinition);
if (!window.chewyCustomElements) {
    window.chewyCustomElements = {};
}
window.chewyCustomElements['fun-definition'] = { isInline: false }
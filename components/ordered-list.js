// Define class.
class OrderedList extends HTMLElement {
    static observedAttributes = ['format', 'start'];
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
    const format = el.getAttribute('format');
    let start = el.getAttribute('start');

    if (!start) {
        start = 1;
    }

    // Determine which type of list this is.
    let prefix = '';
    let suffix = '.';
    let listType;
    if (format) {
        const listTypes  = /[1aAiI]/g;
        const match = format.match(listTypes);
        if (!match) {
            throw new Error('The format of a ordered-list must contain at least one of: 1, a, A, i, I.')
        }
        if (match.length > 1) {
            throw new Error('More than 1 type of list given. Can only use ONE of the following in the format attribute: 1, a, A, i, I.')
        }
        if (match.length == 0) {
            throw new Error('No numbering type was seen in format. You must have one of the following in the format attribute: 1, a, A, i, I.')
        }
        switch (match[0]) {
            case '1':
                listType = 'decimal';
                break;
            case 'a':
                listType = 'lower-latin';
                break;
            case 'A':
                listType = 'upper-latin';
                break;
            case 'i':
                listType = 'lower-roman';
                break;
            case 'I':
                listType = 'upper-roman';
                break;
            default:
                throw new Error('This line should not be reached.')
        }
        const idx = format.search(listTypes);
        prefix = format.substring(0, idx).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
        suffix = format.substring(idx + 1, format.length).replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    }

    const html = `
<template id="ordered-list">
    <style>
        ol.container {
            --ol-indent: 40px;
            --li-padding: 0.25em;
            counter-set: list-item ${start-1};
            display: block;
            padding-left: var(--ol-indent);
            margin: 1em 0;
        }
        ::slotted(li) {
            list-style-type: none;
            margin-left: var(--ol-indent);
        }
        ::slotted(li):before {
            content: "${prefix}" counter(list-item, ${listType}) "${suffix} ";
            display: inline-block;
            text-align: right;
            width: var(--ol-indent);
            padding-right: var(--li-padding);
            margin-left: calc(-80px - var(--li-padding));
        }
    </style>
    <ol class="container" role="list">
        <slot></slot>
    </ol>
</template>`;
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(html, "text/html");
    const template = parsedHtml.getElementById('ordered-list');
    const templateContent = template.content;
    const shadowRoot = el.shadowRoot;
    shadowRoot.appendChild(templateContent.cloneNode(true));
}

// Add element to the list of customElements.
customElements.define('ordered-list', OrderedList);
if (!window.chewyCustomElements) {
    window.chewyCustomElements = {};
}
window.chewyCustomElements['ordered-list'] = { isInline: false }
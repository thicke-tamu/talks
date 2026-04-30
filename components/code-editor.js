import { createCodeMirror, getEditorText, setEditorText, onDocChange } from "./code-mirror/codemirror-bundle.js";

// Define class.
class CodeEditor extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const template = parsedHtml.getElementById('code-editor');
        const templateContent = template.content;
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }
    connectedCallback() {
        const shadowRoot = this.shadowRoot;
        const editorEl = shadowRoot.querySelector('#editorContainer');
        createCodeMirror(editorEl);
        this.addEventListener('replaceText', replaceText);
        // Dispatch a custom event each time the editor text changes.
        onDocChange(this.dispatchEditorChange);
    }
    dispatchEditorChange = (txt) => {
        this.dispatchEvent(new CustomEvent('editorChange', { detail: txt }));
    }
    // Makes it possible to get the editor's text from outside the element by
    // simply accessing the text property of the code-editor element.
    get text() {
        return getEditorText();
    }
}

// Helper variables.
const html = `
<template id="code-editor">
    <style>
        div.container {
            
        }
        div#editorContainer {
            
        }
    </style>
    <div class="container">
        (Press Esc and then Tab to exit the editor via keyboard.)
        <div id="editorContainer"></div>
    </div>
</template>`;

const parser = new DOMParser();
const parsedHtml = parser.parseFromString(html, "text/html");

function replaceText(e) {
    const txt = e.detail;
    setEditorText(txt);
}

// Add element to the list of customElements.
customElements.define('code-editor', CodeEditor);
if (!window.chewyCustomElements) {
    window.chewyCustomElements = {};
}
window.chewyCustomElements['code-editor'] = { isInline: false }
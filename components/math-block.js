// Define class.
class MathBlock extends HTMLElement {
    static observedAttributes = ['latex', 'environment'];

    constructor() {
        super();
        this.running = false; // is MathJax currently rendering this element?
        this.updatePending = false; // is there an update that MathJax should render?
    }

    connectedCallback() {
        this.displayMath();
    }

    disconnectedCallback() {
        this.removeMath();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.running) {
            this.updatePending = true;
        } else {
            this.redisplayMath();
        }
    }

    displayMath() {
        this.updatePending = false;
        this.running = true;
        const latex = this.getAttribute('latex');
        let envir = this.getAttribute('environment');
        if (!envir) {
            envir = 'equation';
        }
        this.innerHTML = `\\begin{${envir}} ` + latex + ` \\end{${envir}}`;
        if (!Object.hasOwn(MathJax, 'typesetPromise')) {
            setTimeout(this.displayMath, 100);
        }
        else {
            MathJax.typesetPromise([this])
                .then(() => {
                    this.running = false;
                    if (this.updatePending) {
                        this.displayMath();
                    }
                })
                .catch((err) => this.innerHTML = `<span style="color: red">${err}</span>`);
        }
    }

    removeMath() {
        MathJax.typesetClear(this);
    }

    redisplayMath = () => {
        if (!Object.hasOwn(MathJax, 'typesetClear')) {
            setTimeout(this.redisplayMath, 100);
        }
        else {
            this.removeMath();
            this.displayMath();
        }
    }
}

// Add element to the list of customElements.
customElements.define('math-block', MathBlock);
if (!window.chewyCustomElements) {
    window.chewyCustomElements = {};
}
window.chewyCustomElements['math-block'] = { isInline: false }
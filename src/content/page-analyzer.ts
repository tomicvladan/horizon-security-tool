import * as url from 'url';

import { LibraryExtractor } from './library-extractor';
import { LinkExtractor } from './link-extractor';
import { FormExtractor } from './form-extractor';

export class PageAnalyzer {

    private libraryExtractor = new LibraryExtractor();
    private linkExtractor;

    private _libraries = [];
    private _links = {};
    private _forms = {};

    constructor() {
    }

    get libraries(): Array<any> { return this.libraries; }

    get links(): any { return this._links }

    public extractLibraries() {
        return this.libraryExtractor.extract();
    }

    public extractLinks() {
        this.linkExtractor = new LinkExtractor();
        return this.linkExtractor.extract();
    }

    public extractForms() {
        let formExtractor = new FormExtractor();
        return formExtractor.extract();
    }

    public extract() {
        this._libraries = this.extractLibraries();
        this._links = this.extractLinks();
        this._forms = this.extractForms();
    }

    public getState() {
        return {
            libraries: this._libraries,
            links: this._links,
            forms: this._forms,
            url: url.parse(location.href, true).host
        }
    }
}
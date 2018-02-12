import * as url from 'url';

export class LinkNode {
    sublinks: any = {};
    methods: any;
    exists: boolean;
}

/**
 * Tree-like data structure
 */
export class LinkCollection {

    private _links: LinkNode = new LinkNode();

    public get links(): LinkNode { return this._links; }

    /**
     * Adds link as LinkNode only if not exists.
     * Returns added or existing LinkNode which corresponds to the given link
     */
    public add(link: string | HTMLAnchorElement): { node: LinkNode, added: boolean } {
        let segments: Array<string>;

        if (typeof(link) === 'string') {
            const address: url.Url = url.parse(link, true);

            segments = (address.pathname || '').split('/');
            segments[0] = address.protocol + '//' + address.host;

        } else {
            segments = (link.pathname || '').split('/');
            segments[0] = (link as any).origin;
        }

        let node: LinkNode = this._links;
        let added = false;

        segments.forEach(segment => {
            if (!node.sublinks[segment]) {
                node.sublinks[segment] = new LinkNode();

                added = true;
            }

            node = node.sublinks[segment];
        });

        node.exists = true;

        return {
            node,
            added
        };
    }

    /**
     * Returns LinkNode if exists for the given link
     */
    public get(link: string): LinkNode {
        const address: url.Url = url.parse(link, true);

        const segments = (address.pathname || '').split('/');
        segments[0] = address.protocol + '//' + address.host;

        let node: LinkNode = this._links;

        for(let i = 0; i < segments.length; i++) {
            if (node.sublinks[segments[i]]) {
                node = node.sublinks[segments[i]];
            } else {
                node = null;
                break;
            }
        }

        return node;
    }

    /**
     * Merges given LinkNodes into its LinkNode collection
     */
    public addCollection(newLinkCollection: LinkNode): boolean {
        let changed = false;

        const segmentIteration = function(links: LinkNode, newLinks: LinkNode) {
            if (!newLinks.sublinks) {
                return;
            }
            if (!links.sublinks) {
                links.sublinks = {};
            }
            for (let segment in newLinks.sublinks) {
                if (newLinks.sublinks.hasOwnProperty(segment)) {
                    if (!links.sublinks[segment]) {
                        links.sublinks[segment] = newLinks.sublinks[segment];
                        changed = true;
                    } else {
                        if (newLinks.methods) {
                            for (let method in newLinks.methods) {
                                if (newLinks.methods.hasOwnProperty(method)) {
                                    if (!links.methods[method]) {
                                        links.methods[method] = newLinks.methods[method];
                                    }
                                }
                            }
                        }

                        links.exists = links.exists || newLinks.exists;

                        segmentIteration(links.sublinks[segment], newLinks.sublinks[segment]);
                    }
                }
            }
        }

        segmentIteration(this._links, newLinkCollection);

        return changed;
    }

    /**
     * Converts the LinkNode collection into an array, grouped by domain name
     */
    public toArray(includeHost = true): Array<{ url: string, links: Array<{ url: string, methods: any}>}> {
        const items = [];

        const segmentIteration = function(
            url: string,
            node: LinkNode,
            links: Array<{ url: string, methods: any}>
        ) {
            for (let segment in node.sublinks) {
                // segment &&
                if (node.sublinks.hasOwnProperty(segment)) {
                    const subnode = node.sublinks[segment];

                    if (subnode.exists) {
                        links.push({
                            url: url + '/' + segment,
                            methods: subnode.methods
                        });
                    }

                    if (subnode.sublinks) {
                        segmentIteration(url || !includeHost ? url + '/' + segment : segment, subnode, links);
                    }
                }
            }
        }

        for (let site in this._links.sublinks) {
            if (site &&  this._links.sublinks.hasOwnProperty(site)) {
                const item = { url: site, links: []};
                const siteNode = this._links.sublinks[site];

                if (siteNode.exists) {
                    item.links.push({
                        url: site,
                        methods: siteNode.methods
                    });
                }

                segmentIteration(includeHost ? site : '', siteNode, item.links);

                items.push(item);
            }
        }

        return items;
    }

}
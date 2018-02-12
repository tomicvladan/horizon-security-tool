import { LinkCollection } from '../common/link-collection';

export class LinkExtractor {

    private linkCollection = new LinkCollection();

    public extract(): any {
        const allLinks: NodeListOf<HTMLAnchorElement> = document.getElementsByTagName('a');

        for (let i = 0; i < allLinks.length; i++) {
            const link = allLinks[i];

            if (!link.pathname) {
                continue;
            }

            this.linkCollection.add(link);
        }

        return this.linkCollection.links;
    }
}
# Horizon

Web application security testing tool.

While browsing web sites, the tool collects the information and shows it in developer tools. It collects information about links, forms and asynchronous HTTP requests. Captured forms and HTTP requests can be modified and resent.

## Usage

To collect the data, the tool must be enabled first, by clicking on the toolbar button. In developer tools, there is a new tab where all collected data for the current web site is shown. If the same site is being browsed in two or more tabs, then the data is merged and complete data is shown in the tool. The tool has the following sections:

1) Links - here are shown all links found on the currently opened web site. If some parts of the page are loaded dynamically, then data can be refreshed with the corresponding button in that tab.

2) Forms - all raw forms found on the currently opened site are shown in this tab. Parameters of the forms can be modified and forms can be submitted. There is the refresh button in this tab too.

3) HTTP Requests - for every asynchronous HTTP request, its parameter structure and up to five captured requests are shown. Headers and parameters of every captured request can be modified. Captured request can be resent, deleted or copied. Copying is useful when the same or similar headers and parameters are needed for a different URL. Also new requests can be added manually. When a request is resent, the response can be viewed in the "Responses" tab.

4) Libraries - if web site uses any of the most popular front-end libraries (like JQuery, React, Angular) then their version numbers will be shown in this tab.

5) Responses - here are listed all responses from resent requests.


DISCLAIMER: This tools is created only for legal security testing of web applications and the author is not responsible for any eventual damage.



## Building

Web-ext tool is needed, to install it:

```bash
npm install --global web-ext
```


To build the project (the code will be generated in dist directory):

```bash
npm install

npm run-script build
```


To run the project (in another console):

```bash
npm run-script start
```

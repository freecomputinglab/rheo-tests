(function(){var e=`/**
 * Beige theme for reveal.js.
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
@import url(./fonts/league-gothic/league-gothic.css);
@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);
section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #f7f3de;
  --r-main-font: Lato, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #333;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: League Gothic, Impact, sans-serif;
  --r-heading-color: #333;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 20px 20px rgba(0, 0, 0, 0.15);
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #8b743d;
  --r-link-color-dark: rgb(118.15, 98.6, 51.85);
  --r-link-color-hover: rgb(179.36, 150.84, 82.64);
  --r-selection-background-color: rgba(79, 64, 28, 0.99);
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: rgb(247, 242, 211);
  background: -moz-radial-gradient(center, circle cover, rgb(255, 255, 255) 0%, rgb(247, 242, 211) 100%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgb(255, 255, 255)), color-stop(100%, rgb(247, 242, 211)));
  background: -webkit-radial-gradient(center, circle cover, rgb(255, 255, 255) 0%, rgb(247, 242, 211) 100%);
  background: -o-radial-gradient(center, circle cover, rgb(255, 255, 255) 0%, rgb(247, 242, 211) 100%);
  background: -ms-radial-gradient(center, circle cover, rgb(255, 255, 255) 0%, rgb(247, 242, 211) 100%);
  background: radial-gradient(center, circle cover, rgb(255, 255, 255) 0%, rgb(247, 242, 211) 100%);
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,t=`/**
 * Black compact & high contrast reveal.js theme, with headers not in capitals.
 *
 * By Peter Kehl. Based on black.(s)css by Hakim El Hattab, http://hakim.se
 *
 * - Keep the source similar to black.css - for easy comparison.
 * - $mainFontSize controls code blocks, too (although under some ratio).
 */
@import url(./fonts/source-sans-pro/source-sans-pro.css);
section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #000;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #000000;
  --r-main-font: Source Sans Pro, Helvetica, sans-serif;
  --r-main-font-size: 42px;
  --r-main-color: #fff;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Source Sans Pro, Helvetica, sans-serif;
  --r-heading-color: #fff;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: 600;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 2.5em;
  --r-heading2-size: 1.6em;
  --r-heading3-size: 1.3em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #42affa;
  --r-link-color-dark: rgb(19.8216494845, 155.4536082474, 248.7783505155);
  --r-link-color-hover: rgb(94.35, 187, 250.75);
  --r-selection-background-color: rgb(113.25, 195, 251.25);
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: #000000;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,n=`/**
 * Black theme for reveal.js. This is the opposite of the 'white' theme.
 *
 * By Hakim El Hattab, http://hakim.se
 */
@import url(./fonts/source-sans-pro/source-sans-pro.css);
section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #222;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #191919;
  --r-main-font: Source Sans Pro, Helvetica, sans-serif;
  --r-main-font-size: 42px;
  --r-main-color: #fff;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Source Sans Pro, Helvetica, sans-serif;
  --r-heading-color: #fff;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: 600;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 2.5em;
  --r-heading2-size: 1.6em;
  --r-heading3-size: 1.3em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #42affa;
  --r-link-color-dark: rgb(19.8216494845, 155.4536082474, 248.7783505155);
  --r-link-color-hover: rgb(94.35, 187, 250.75);
  --r-selection-background-color: rgba(66, 175, 250, 0.75);
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: #191919;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,r=`/**
 * Blood theme for reveal.js
 * Author: Walther http://github.com/Walther
 *
 * Designed to be used with highlight.js theme
 * "monokai_sublime.css" available from
 * https://github.com/isagalaev/highlight.js/
 *
 * For other themes, change $codeBackground accordingly.
 *
 */
@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,700,300italic,700italic);
section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #222;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #222;
  --r-main-font: Ubuntu, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #eee;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Ubuntu, sans-serif;
  --r-heading-color: #eee;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: 2px 2px 2px #222;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 20px 20px rgba(0, 0, 0, 0.15);
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #a23;
  --r-link-color-dark: rgb(144.5, 28.9, 43.35);
  --r-link-color-hover: rgb(214.2, 51, 71.4);
  --r-selection-background-color: #a23;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: #222;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}
.reveal p {
  font-weight: 300;
  text-shadow: 1px 1px #222;
}

section.has-light-background p, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4 {
  text-shadow: none;
}

.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  font-weight: 700;
}

.reveal p code {
  background-color: #23241f;
  display: inline-block;
  border-radius: 7px;
}

.reveal small code {
  vertical-align: baseline;
}`,i=`/**
 * Dracula Dark theme for reveal.js.
 * Based on https://draculatheme.com
 */
/**
 * Dracula colors by Zeno Rocha
 * https://draculatheme.com/contribute
 */
html * {
  color-profile: sRGB;
  rendering-intent: auto;
}

section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #282A36;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #282A36;
  --r-main-font: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #F8F8F2;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: League Gothic, Impact, sans-serif;
  --r-heading-color: #BD93F9;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: none;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: Fira Code, Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace;
  --r-link-color: #FF79C6;
  --r-link-color-dark: rgb(255, 64.6, 174.0089552239);
  --r-link-color-hover: #8BE9FD;
  --r-selection-background-color: #44475A;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: #282A36;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}
:root {
  --r-bold-color: #FFB86C;
  --r-italic-color: #F1FA8C;
  --r-inline-code-color: #50FA7B;
  --r-list-bullet-color: #8BE9FD;
}

.reveal strong, .reveal b {
  color: var(--r-bold-color);
}
.reveal em, .reveal i, .reveal blockquote {
  color: var(--r-italic-color);
}
.reveal code {
  color: var(--r-inline-code-color);
}
.reveal ul li::marker, .reveal ol li::marker {
  color: var(--r-list-bullet-color);
}`,a=`/**
 * League theme for reveal.js.
 *
 * This was the default theme pre-3.0.0.
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
@import url(./fonts/league-gothic/league-gothic.css);
@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);
section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #222;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #2b2b2b;
  --r-main-font: Lato, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #eee;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: League Gothic, Impact, sans-serif;
  --r-heading-color: #eee;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.3), 0 3px 5px rgba(0, 0, 0, 0.2), 0 5px 10px rgba(0, 0, 0, 0.25), 0 20px 20px rgba(0, 0, 0, 0.15);
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #13DAEC;
  --r-link-color-dark: rgb(16.15, 185.3, 200.6);
  --r-link-color-hover: rgb(66.2, 225.4, 239.8);
  --r-selection-background-color: #FF5E99;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: rgb(28, 30, 32);
  background: -moz-radial-gradient(center, circle cover, rgb(85, 90, 95) 0%, rgb(28, 30, 32) 100%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, rgb(85, 90, 95)), color-stop(100%, rgb(28, 30, 32)));
  background: -webkit-radial-gradient(center, circle cover, rgb(85, 90, 95) 0%, rgb(28, 30, 32) 100%);
  background: -o-radial-gradient(center, circle cover, rgb(85, 90, 95) 0%, rgb(28, 30, 32) 100%);
  background: -ms-radial-gradient(center, circle cover, rgb(85, 90, 95) 0%, rgb(28, 30, 32) 100%);
  background: radial-gradient(center, circle cover, rgb(85, 90, 95) 0%, rgb(28, 30, 32) 100%);
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,o=`/**
 * Solarized Dark theme for reveal.js.
 * Author: Achim Staebler
 */
@import url(./fonts/league-gothic/league-gothic.css);
@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);
/**
 * Solarized colors by Ethan Schoonover
 */
section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #222;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #002b36;
  --r-main-font: Lato, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #93a1a1;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: League Gothic, Impact, sans-serif;
  --r-heading-color: #eee8d5;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #268bd2;
  --r-link-color-dark: rgb(32.3, 118.15, 178.5);
  --r-link-color-hover: rgb(77.5161290323, 162.8774193548, 222.8838709677);
  --r-selection-background-color: #d33682;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: #002b36;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,s=`/**
 * Black theme for reveal.js.
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
@import url(https://fonts.googleapis.com/css?family=Montserrat:700);
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,700,400italic,700italic);
section.has-light-background, section.has-light-background h1, section.has-light-background h2, section.has-light-background h3, section.has-light-background h4, section.has-light-background h5, section.has-light-background h6 {
  color: #222;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #111;
  --r-main-font: Open Sans, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #eee;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Montserrat, Impact, sans-serif;
  --r-heading-color: #eee;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: -0.03em;
  --r-heading-text-transform: none;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #e7ad52;
  --r-link-color-dark: rgb(225.2802030457, 153.4573604061, 40.7697969543);
  --r-link-color-hover: rgb(235.8, 189.4, 116.6);
  --r-selection-background-color: #e7ad52;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 240, 240, 240;
  --r-overlay-element-fg-color: 0, 0, 0;
}

.reveal-viewport {
  background: #111;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,c=`/**
 * A simple theme for reveal.js presentations, similar
 * to the default theme. The accent color is brown.
 *
 * This theme is Copyright (C) 2012-2013 Owen Versteeg, http://owenversteeg.com - it is MIT licensed.
 */
.reveal a {
  line-height: 1.3em;
}

section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #F0F1EB;
  --r-main-font: Palatino Linotype, Book Antiqua, Palatino, FreeSerif, serif;
  --r-main-font-size: 40px;
  --r-main-color: #000;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Palatino Linotype, Book Antiqua, Palatino, FreeSerif, serif;
  --r-heading-color: #383D3D;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: none;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #51483D;
  --r-link-color-dark: rgb(68.85, 61.2, 51.85);
  --r-link-color-hover: rgb(122.9830985915, 109.3183098592, 92.6169014085);
  --r-selection-background-color: #26351C;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: #F0F1EB;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,l=`/**
 * A simple theme for reveal.js presentations, similar
 * to the default theme. The accent color is darkblue.
 *
 * This theme is Copyright (C) 2012 Owen Versteeg, https://github.com/StereotypicalApps. It is MIT licensed.
 * reveal.js is Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
@import url(https://fonts.googleapis.com/css?family=News+Cycle:400,700);
@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);
section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #fff;
  --r-main-font: Lato, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #000;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: News Cycle, Impact, sans-serif;
  --r-heading-color: #000;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: none;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #00008B;
  --r-link-color-dark: rgb(0, 0, 118.15);
  --r-link-color-hover: rgb(0, 0, 213.2);
  --r-selection-background-color: rgba(0, 0, 0, 0.99);
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: #fff;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,u=`/**
 * Sky theme for reveal.js.
 *
 * Copyright (C) 2011-2012 Hakim El Hattab, http://hakim.se
 */
@import url(https://fonts.googleapis.com/css?family=Quicksand:400,700,400italic,700italic);
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,400,700);
.reveal a {
  line-height: 1.3em;
}

section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #f7fbfc;
  --r-main-font: Open Sans, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #333;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Quicksand, sans-serif;
  --r-heading-color: #333;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: -0.08em;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #3b759e;
  --r-link-color-dark: rgb(50.15, 99.45, 134.3);
  --r-link-color-hover: rgb(84.330875576, 146.9815668203, 191.269124424);
  --r-selection-background-color: #134674;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: #add9e4;
  background: -moz-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, #f7fbfc), color-stop(100%, #add9e4));
  background: -webkit-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);
  background: -o-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);
  background: -ms-radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);
  background: radial-gradient(center, circle cover, #f7fbfc 0%, #add9e4 100%);
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,d=`/**
 * Solarized Light theme for reveal.js.
 * Author: Achim Staebler
 */
@import url(./fonts/league-gothic/league-gothic.css);
@import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic);
/**
 * Solarized colors by Ethan Schoonover
 */
html * {
  color-profile: sRGB;
  rendering-intent: auto;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #fdf6e3;
  --r-main-font: Lato, sans-serif;
  --r-main-font-size: 40px;
  --r-main-color: #657b83;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: League Gothic, Impact, sans-serif;
  --r-heading-color: #586e75;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: normal;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 3.77em;
  --r-heading2-size: 2.11em;
  --r-heading3-size: 1.55em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #268bd2;
  --r-link-color-dark: rgb(32.3, 118.15, 178.5);
  --r-link-color-hover: rgb(77.5161290323, 162.8774193548, 222.8838709677);
  --r-selection-background-color: #d33682;
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: #fdf6e3;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,f=`/**
 * White compact & high contrast reveal.js theme, with headers not in capitals.
 *
 * By Peter Kehl. Based on white.(s)css by Hakim El Hattab, http://hakim.se
 *
 * - Keep the source similar to black.css - for easy comparison.
 * - $mainFontSize controls code blocks, too (although under some ratio).
 */
@import url(./fonts/source-sans-pro/source-sans-pro.css);
section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #fff;
  --r-main-font: Source Sans Pro, Helvetica, sans-serif;
  --r-main-font-size: 42px;
  --r-main-color: #000;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Source Sans Pro, Helvetica, sans-serif;
  --r-heading-color: #000;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: 600;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 2.5em;
  --r-heading2-size: 1.6em;
  --r-heading3-size: 1.3em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #2a76dd;
  --r-link-color-dark: rgb(30.7720647773, 99.5566801619, 192.7779352227);
  --r-link-color-hover: rgb(73.95, 138.55, 226.1);
  --r-selection-background-color: rgb(95.25, 152.25, 229.5);
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: #fff;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,p=`/**
 * White theme for reveal.js. This is the opposite of the 'black' theme.
 *
 * By Hakim El Hattab, http://hakim.se
 */
@import url(./fonts/source-sans-pro/source-sans-pro.css);
section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #fff;
  --r-main-font: Source Sans Pro, Helvetica, sans-serif;
  --r-main-font-size: 42px;
  --r-main-color: #222;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Source Sans Pro, Helvetica, sans-serif;
  --r-heading-color: #222;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: uppercase;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: 600;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 2.5em;
  --r-heading2-size: 1.6em;
  --r-heading3-size: 1.3em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #2a76dd;
  --r-link-color-dark: rgb(30.7720647773, 99.5566801619, 192.7779352227);
  --r-link-color-hover: rgb(73.95, 138.55, 226.1);
  --r-selection-background-color: rgb(95.25, 152.25, 229.5);
  --r-selection-color: #fff;
  --r-overlay-element-bg-color: 0, 0, 0;
  --r-overlay-element-fg-color: 240, 240, 240;
}

.reveal-viewport {
  background: #fff;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,m=`/**
 * White compact & high contrast reveal.js theme, with headers not in capitals.
 *
 * By Peter Kehl. Based on white.(s)css by Hakim El Hattab, http://hakim.se
 *
 * - Keep the source similar to black.css - for easy comparison.
 * - $mainFontSize controls code blocks, too (although under some ratio).
 */
@import url(./fonts/source-sans-pro/source-sans-pro.css);
section.has-dark-background, section.has-dark-background h1, section.has-dark-background h2, section.has-dark-background h3, section.has-dark-background h4, section.has-dark-background h5, section.has-dark-background h6 {
  color: #fff;
}

/*********************************************
 * GLOBAL STYLES
 *********************************************/
:root {
  --r-background-color: #fff;
  --r-main-font: Source Sans Pro, Helvetica, sans-serif;
  --r-main-font-size: 25px;
  --r-main-color: #000;
  --r-block-margin: 20px;
  --r-heading-margin: 0 0 20px 0;
  --r-heading-font: Source Sans Pro, Helvetica, sans-serif;
  --r-heading-color: #000;
  --r-heading-line-height: 1.2;
  --r-heading-letter-spacing: normal;
  --r-heading-text-transform: none;
  --r-heading-text-shadow: none;
  --r-heading-font-weight: 450;
  --r-heading1-text-shadow: none;
  --r-heading1-size: 2.5em;
  --r-heading2-size: 1.6em;
  --r-heading3-size: 1.3em;
  --r-heading4-size: 1em;
  --r-code-font: monospace;
  --r-link-color: #2a76dd;
  --r-link-color-dark: #1a53a1;
  --r-link-color-hover: #6ca0e8;
  --r-selection-background-color: #98bdef;
  --r-selection-color: #fff;
}

.reveal-viewport {
  background: #fff;
  background-color: var(--r-background-color);
}

.reveal {
  font-family: var(--r-main-font);
  font-size: var(--r-main-font-size);
  font-weight: normal;
  color: var(--r-main-color);
}

.reveal ::selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal ::-moz-selection {
  color: var(--r-selection-color);
  background: var(--r-selection-background-color);
  text-shadow: none;
}

.reveal .slides section,
.reveal .slides section > section {
  line-height: 1.3;
  font-weight: inherit;
}

/*********************************************
 * HEADERS
 *********************************************/
.reveal h1,
.reveal h2,
.reveal h3,
.reveal h4,
.reveal h5,
.reveal h6 {
  margin: var(--r-heading-margin);
  color: var(--r-heading-color);
  font-family: var(--r-heading-font);
  font-weight: var(--r-heading-font-weight);
  line-height: var(--r-heading-line-height);
  letter-spacing: var(--r-heading-letter-spacing);
  text-transform: var(--r-heading-text-transform);
  text-shadow: var(--r-heading-text-shadow);
  word-wrap: break-word;
}

.reveal h1 {
  font-size: var(--r-heading1-size);
}

.reveal h2 {
  font-size: var(--r-heading2-size);
}

.reveal h3 {
  font-size: var(--r-heading3-size);
}

.reveal h4 {
  font-size: var(--r-heading4-size);
}

.reveal h1 {
  text-shadow: var(--r-heading1-text-shadow);
}

/*********************************************
 * OTHER
 *********************************************/
.reveal p {
  margin: var(--r-block-margin) 0;
  line-height: 1.3;
}

/* Remove trailing margins after titles */
.reveal h1:last-child,
.reveal h2:last-child,
.reveal h3:last-child,
.reveal h4:last-child,
.reveal h5:last-child,
.reveal h6:last-child {
  margin-bottom: 0;
}

/* Ensure certain elements are never larger than the slide itself */
.reveal img,
.reveal video,
.reveal iframe {
  max-width: 95%;
  max-height: 95%;
}

.reveal strong,
.reveal b {
  font-weight: bold;
}

.reveal em {
  font-style: italic;
}

.reveal ol,
.reveal dl,
.reveal ul {
  display: inline-block;
  text-align: left;
  margin: 0 0 0 1em;
}

.reveal ol {
  list-style-type: decimal;
}

.reveal ul {
  list-style-type: disc;
}

.reveal ul ul {
  list-style-type: square;
}

.reveal ul ul ul {
  list-style-type: circle;
}

.reveal ul ul,
.reveal ul ol,
.reveal ol ol,
.reveal ol ul {
  display: block;
  margin-left: 40px;
}

.reveal dt {
  font-weight: bold;
}

.reveal dd {
  margin-left: 40px;
}

.reveal blockquote {
  display: block;
  position: relative;
  width: 70%;
  margin: var(--r-block-margin) auto;
  padding: 5px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
}

.reveal blockquote p:first-child,
.reveal blockquote p:last-child {
  display: inline-block;
}

.reveal q {
  font-style: italic;
}

.reveal pre {
  display: block;
  position: relative;
  width: 90%;
  margin: var(--r-block-margin) auto;
  text-align: left;
  font-size: 0.55em;
  font-family: var(--r-code-font);
  line-height: 1.2em;
  word-wrap: break-word;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
}

.reveal code {
  font-family: var(--r-code-font);
  text-transform: none;
  tab-size: 2;
}

.reveal pre code {
  display: block;
  padding: 5px;
  overflow: auto;
  max-height: 400px;
  word-wrap: normal;
}

.reveal .code-wrapper {
  white-space: normal;
}

.reveal .code-wrapper code {
  white-space: pre;
}

.reveal table {
  margin: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

.reveal table th {
  font-weight: bold;
}

.reveal table th,
.reveal table td {
  text-align: left;
  padding: 0.2em 0.5em 0.2em 0.5em;
  border-bottom: 1px solid;
}

.reveal table th[align=center],
.reveal table td[align=center] {
  text-align: center;
}

.reveal table th[align=right],
.reveal table td[align=right] {
  text-align: right;
}

.reveal table tbody tr:last-child th,
.reveal table tbody tr:last-child td {
  border-bottom: none;
}

.reveal sup {
  vertical-align: super;
  font-size: smaller;
}

.reveal sub {
  vertical-align: sub;
  font-size: smaller;
}

.reveal small {
  display: inline-block;
  font-size: 0.6em;
  line-height: 1.2em;
  vertical-align: top;
}

.reveal small * {
  vertical-align: top;
}

.reveal img {
  margin: var(--r-block-margin) 0;
}

/*********************************************
 * LINKS
 *********************************************/
.reveal a {
  color: var(--r-link-color);
  text-decoration: none;
  transition: color 0.15s ease;
}

.reveal a:hover {
  color: var(--r-link-color-hover);
  text-shadow: none;
  border: none;
}

.reveal .roll span:after {
  color: #fff;
  background: var(--r-link-color-dark);
}

/*********************************************
 * Frame helper
 *********************************************/
.reveal .r-frame {
  border: 4px solid var(--r-main-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.reveal a .r-frame {
  transition: all 0.15s linear;
}

.reveal a:hover .r-frame {
  border-color: var(--r-link-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.55);
}

/*********************************************
 * NAVIGATION CONTROLS
 *********************************************/
.reveal .controls {
  color: var(--r-link-color);
}

/*********************************************
 * PROGRESS BAR
 *********************************************/
.reveal .progress {
  background: rgba(0, 0, 0, 0.2);
  color: var(--r-link-color);
}

/*********************************************
 * PRINT BACKGROUND
 *********************************************/
@media print {
  .backgrounds {
    background-color: var(--r-background-color);
  }
}`,h=(e,t)=>{for(let n in t)e[n]=t[n];return e},g=(e,t)=>Array.from(e.querySelectorAll(t)),_=(e,t,n)=>{n?e.classList.add(t):e.classList.remove(t)},v=e=>{if(typeof e==`string`){if(e===`null`)return null;if(e===`true`)return!0;if(e===`false`)return!1;if(e.match(/^-?[\d\.]+$/))return parseFloat(e)}return e},y=(e,t)=>{e.style.transform=t},b=(e,t)=>{let n=e.matches||e.matchesSelector||e.msMatchesSelector;return!(!n||!n.call(e,t))},x=(e,t)=>{if(typeof e.closest==`function`)return e.closest(t);for(;e;){if(b(e,t))return e;e=e.parentNode}return null},S=e=>{let t=(e||=document.documentElement).requestFullscreen||e.webkitRequestFullscreen||e.webkitRequestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen;t&&t.apply(e)},C=e=>{let t=document.createElement(`style`);return t.type=`text/css`,e&&e.length>0&&(t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e))),document.head.appendChild(t),t},ee=()=>{let e={};location.search.replace(/[A-Z0-9]+?=([\w\.%-]*)/gi,(t=>{e[t.split(`=`).shift()]=t.split(`=`).pop()}));for(let t in e){let n=e[t];e[t]=v(unescape(n))}return e.dependencies!==void 0&&delete e.dependencies,e},w={mp4:`video/mp4`,m4a:`video/mp4`,ogv:`video/ogg`,mpeg:`video/mpeg`,webm:`video/webm`},te=navigator.userAgent,T=/(iphone|ipod|ipad|android)/gi.test(te)||navigator.platform===`MacIntel`&&navigator.maxTouchPoints>1,E=/android/gi.test(te),D=function(e){if(e){var t=function(e){return[].slice.call(e)},n=3,r=[],i=null,a=`requestAnimationFrame`in e?function(){e.cancelAnimationFrame(i),i=e.requestAnimationFrame((function(){return s(r.filter((function(e){return e.dirty&&e.active})))}))}:function(){},o=function(e){return function(){r.forEach((function(t){return t.dirty=e})),a()}},s=function(e){e.filter((function(e){return!e.styleComputed})).forEach((function(e){e.styleComputed=d(e)})),e.filter(f).forEach(p);var t=e.filter(u);t.forEach(l),t.forEach((function(e){p(e),c(e)})),t.forEach(m)},c=function(e){return e.dirty=0},l=function(e){e.availableWidth=e.element.parentNode.clientWidth,e.currentWidth=e.element.scrollWidth,e.previousFontSize=e.currentFontSize,e.currentFontSize=Math.min(Math.max(e.minSize,e.availableWidth/e.currentWidth*e.previousFontSize),e.maxSize),e.whiteSpace=e.multiLine&&e.currentFontSize===e.minSize?`normal`:`nowrap`},u=function(e){return e.dirty!==2||e.dirty===2&&e.element.parentNode.clientWidth!==e.availableWidth},d=function(t){var n=e.getComputedStyle(t.element,null);return t.currentFontSize=parseFloat(n.getPropertyValue(`font-size`)),t.display=n.getPropertyValue(`display`),t.whiteSpace=n.getPropertyValue(`white-space`),!0},f=function(e){var t=!1;return!e.preStyleTestCompleted&&(/inline-/.test(e.display)||(t=!0,e.display=`inline-block`),e.whiteSpace!==`nowrap`&&(t=!0,e.whiteSpace=`nowrap`),e.preStyleTestCompleted=!0,t)},p=function(e){e.element.style.whiteSpace=e.whiteSpace,e.element.style.display=e.display,e.element.style.fontSize=e.currentFontSize+`px`},m=function(e){e.element.dispatchEvent(new CustomEvent(`fit`,{detail:{oldValue:e.previousFontSize,newValue:e.currentFontSize,scaleFactor:e.currentFontSize/e.previousFontSize}}))},h=function(e,t){return function(){e.dirty=t,e.active&&a()}},g=function(e){return function(){r=r.filter((function(t){return t.element!==e.element})),e.observeMutations&&e.observer.disconnect(),e.element.style.whiteSpace=e.originalStyle.whiteSpace,e.element.style.display=e.originalStyle.display,e.element.style.fontSize=e.originalStyle.fontSize}},_=function(e){return function(){e.active||(e.active=!0,a())}},v=function(e){return function(){return e.active=!1}},y=function(e){e.observeMutations&&(e.observer=new MutationObserver(h(e,1)),e.observer.observe(e.element,e.observeMutations))},b={minSize:16,maxSize:512,multiLine:!0,observeMutations:`MutationObserver`in e&&{subtree:!0,childList:!0,characterData:!0}},x=null,S=function(){e.clearTimeout(x),x=e.setTimeout(o(2),w.observeWindowDelay)},C=[`resize`,`orientationchange`];return Object.defineProperty(w,`observeWindow`,{set:function(t){var n=`${t?`add`:`remove`}EventListener`;C.forEach((function(t){e[n](t,S)}))}}),w.observeWindow=!0,w.observeWindowDelay=100,w.fitAll=o(n),w}function ee(e,t){var i=Object.assign({},b,t),o=e.map((function(e){var t=Object.assign({},i,{element:e,active:!0});return function(e){e.originalStyle={whiteSpace:e.element.style.whiteSpace,display:e.element.style.display,fontSize:e.element.style.fontSize},y(e),e.newbie=!0,e.dirty=!0,r.push(e)}(t),{element:e,fit:h(t,n),unfreeze:_(t),freeze:v(t),unsubscribe:g(t)}}));return a(),o}function w(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};return typeof e==`string`?ee(t(document.querySelectorAll(e)),n):ee([e],n)[0]}}(typeof window>`u`?null:window),ne=class{constructor(e){this.Reveal=e,this.startEmbeddedIframe=this.startEmbeddedIframe.bind(this)}shouldPreload(e){if(this.Reveal.isScrollView())return!0;let t=this.Reveal.getConfig().preloadIframes;return typeof t!=`boolean`&&(t=e.hasAttribute(`data-preload`)),t}load(e,t={}){e.style.display=this.Reveal.getConfig().display,g(e,`img[data-src], video[data-src], audio[data-src], iframe[data-src]`).forEach((e=>{(e.tagName!==`IFRAME`||this.shouldPreload(e))&&(e.setAttribute(`src`,e.getAttribute(`data-src`)),e.setAttribute(`data-lazy-loaded`,``),e.removeAttribute(`data-src`))})),g(e,`video, audio`).forEach((e=>{let t=0;g(e,`source[data-src]`).forEach((e=>{e.setAttribute(`src`,e.getAttribute(`data-src`)),e.removeAttribute(`data-src`),e.setAttribute(`data-lazy-loaded`,``),t+=1})),T&&e.tagName===`VIDEO`&&e.setAttribute(`playsinline`,``),t>0&&e.load()}));let n=e.slideBackgroundElement;if(n){n.style.display=`block`;let r=e.slideBackgroundContentElement,i=e.getAttribute(`data-background-iframe`);if(!1===n.hasAttribute(`data-loaded`)){n.setAttribute(`data-loaded`,`true`);let a=e.getAttribute(`data-background-image`),o=e.getAttribute(`data-background-video`),s=e.hasAttribute(`data-background-video-loop`),c=e.hasAttribute(`data-background-video-muted`);if(a)/^data:/.test(a.trim())?r.style.backgroundImage=`url(${a.trim()})`:r.style.backgroundImage=a.split(`,`).map((e=>`url(${((e=``)=>encodeURI(e).replace(/%5B/g,`[`).replace(/%5D/g,`]`).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`)))(decodeURI(e.trim()))})`)).join(`,`);else if(o){let e=document.createElement(`video`);s&&e.setAttribute(`loop`,``),(c||this.Reveal.isSpeakerNotes())&&(e.muted=!0),T&&(e.muted=!0,e.setAttribute(`playsinline`,``)),o.split(`,`).forEach((t=>{let n=document.createElement(`source`);n.setAttribute(`src`,t);let r=((e=``)=>w[e.split(`.`).pop()])(t);r&&n.setAttribute(`type`,r),e.appendChild(n)})),r.appendChild(e)}else if(i&&!0!==t.excludeIframes){let e=document.createElement(`iframe`);e.setAttribute(`allowfullscreen`,``),e.setAttribute(`mozallowfullscreen`,``),e.setAttribute(`webkitallowfullscreen`,``),e.setAttribute(`allow`,`autoplay`),e.setAttribute(`data-src`,i),e.style.width=`100%`,e.style.height=`100%`,e.style.maxHeight=`100%`,e.style.maxWidth=`100%`,r.appendChild(e)}}let a=r.querySelector(`iframe[data-src]`);a&&this.shouldPreload(n)&&!/autoplay=(1|true|yes)/gi.test(i)&&a.getAttribute(`src`)!==i&&a.setAttribute(`src`,i)}this.layout(e)}layout(e){Array.from(e.querySelectorAll(`.r-fit-text`)).forEach((e=>{D(e,{minSize:24,maxSize:.8*this.Reveal.getConfig().height,observeMutations:!1,observeWindow:!1})}))}unload(e){e.style.display=`none`;let t=this.Reveal.getSlideBackground(e);t&&(t.style.display=`none`,g(t,`iframe[src]`).forEach((e=>{e.removeAttribute(`src`)}))),g(e,`video[data-lazy-loaded][src], audio[data-lazy-loaded][src], iframe[data-lazy-loaded][src]`).forEach((e=>{e.setAttribute(`data-src`,e.getAttribute(`src`)),e.removeAttribute(`src`)})),g(e,`video[data-lazy-loaded] source[src], audio source[src]`).forEach((e=>{e.setAttribute(`data-src`,e.getAttribute(`src`)),e.removeAttribute(`src`)}))}formatEmbeddedContent(){let e=(e,t,n)=>{g(this.Reveal.getSlidesElement(),`iframe[`+e+`*="`+t+`"]`).forEach((t=>{let r=t.getAttribute(e);r&&r.indexOf(n)===-1&&t.setAttribute(e,r+(/\?/.test(r)?`&`:`?`)+n)}))};e(`src`,`youtube.com/embed/`,`enablejsapi=1`),e(`data-src`,`youtube.com/embed/`,`enablejsapi=1`),e(`src`,`player.vimeo.com/`,`api=1`),e(`data-src`,`player.vimeo.com/`,`api=1`)}startEmbeddedContent(e){if(e){let t=this.Reveal.isSpeakerNotes();g(e,`img[src$=".gif"]`).forEach((e=>{e.setAttribute(`src`,e.getAttribute(`src`))})),g(e,`video, audio`).forEach((e=>{if(x(e,`.fragment`)&&!x(e,`.fragment.visible`))return;let n=this.Reveal.getConfig().autoPlayMedia;if(typeof n!=`boolean`&&(n=e.hasAttribute(`data-autoplay`)||!!x(e,`.slide-background`)),n&&typeof e.play==`function`){if(t&&!e.muted)return;if(e.readyState>1)this.startEmbeddedMedia({target:e});else if(T){let t=e.play();t&&typeof t.catch==`function`&&!1===e.controls&&t.catch((()=>{e.controls=!0,e.addEventListener(`play`,(()=>{e.controls=!1}))}))}else e.removeEventListener(`loadeddata`,this.startEmbeddedMedia),e.addEventListener(`loadeddata`,this.startEmbeddedMedia)}})),t||(g(e,`iframe[src]`).forEach((e=>{x(e,`.fragment`)&&!x(e,`.fragment.visible`)||this.startEmbeddedIframe({target:e})})),g(e,`iframe[data-src]`).forEach((e=>{x(e,`.fragment`)&&!x(e,`.fragment.visible`)||e.getAttribute(`src`)!==e.getAttribute(`data-src`)&&(e.removeEventListener(`load`,this.startEmbeddedIframe),e.addEventListener(`load`,this.startEmbeddedIframe),e.setAttribute(`src`,e.getAttribute(`data-src`)))})))}}startEmbeddedMedia(e){let t=!!x(e.target,`html`),n=!!x(e.target,`.present`);t&&n&&(e.target.paused||e.target.ended)&&(e.target.currentTime=0,e.target.play()),e.target.removeEventListener(`loadeddata`,this.startEmbeddedMedia)}startEmbeddedIframe(e){let t=e.target;if(t&&t.contentWindow){let n=!!x(e.target,`html`),r=!!x(e.target,`.present`);if(n&&r){let e=this.Reveal.getConfig().autoPlayMedia;typeof e!=`boolean`&&(e=t.hasAttribute(`data-autoplay`)||!!x(t,`.slide-background`)),/youtube\.com\/embed\//.test(t.getAttribute(`src`))&&e?t.contentWindow.postMessage(`{"event":"command","func":"playVideo","args":""}`,`*`):/player\.vimeo\.com\//.test(t.getAttribute(`src`))&&e?t.contentWindow.postMessage(`{"method":"play"}`,`*`):t.contentWindow.postMessage(`slide:start`,`*`)}}}stopEmbeddedContent(e,t={}){t=h({unloadIframes:!0},t),e&&e.parentNode&&(g(e,`video, audio`).forEach((e=>{e.hasAttribute(`data-ignore`)||typeof e.pause!=`function`||(e.setAttribute(`data-paused-by-reveal`,``),e.pause())})),g(e,`iframe`).forEach((e=>{e.contentWindow&&e.contentWindow.postMessage(`slide:stop`,`*`),e.removeEventListener(`load`,this.startEmbeddedIframe)})),g(e,`iframe[src*="youtube.com/embed/"]`).forEach((e=>{!e.hasAttribute(`data-ignore`)&&e.contentWindow&&typeof e.contentWindow.postMessage==`function`&&e.contentWindow.postMessage(`{"event":"command","func":"pauseVideo","args":""}`,`*`)})),g(e,`iframe[src*="player.vimeo.com/"]`).forEach((e=>{!e.hasAttribute(`data-ignore`)&&e.contentWindow&&typeof e.contentWindow.postMessage==`function`&&e.contentWindow.postMessage(`{"method":"pause"}`,`*`)})),!0===t.unloadIframes&&g(e,`iframe[data-src]`).forEach((e=>{e.setAttribute(`src`,`about:blank`),e.removeAttribute(`src`)})))}},O=`.slides section`,k=`.slides>section`,re=`.slides>section.present>section`,ie=/registerPlugin|registerKeyboardShortcut|addKeyBinding|addEventListener|showPreview/,ae=class{constructor(e){this.Reveal=e}render(){this.element=document.createElement(`div`),this.element.className=`slide-number`,this.Reveal.getRevealElement().appendChild(this.element)}configure(e,t){let n=`none`;e.slideNumber&&!this.Reveal.isPrintView()&&(e.showSlideNumber===`all`||e.showSlideNumber===`speaker`&&this.Reveal.isSpeakerNotes())&&(n=`block`),this.element.style.display=n}update(){this.Reveal.getConfig().slideNumber&&this.element&&(this.element.innerHTML=this.getSlideNumber())}getSlideNumber(e=this.Reveal.getCurrentSlide()){let t,n=this.Reveal.getConfig(),r=`h.v`;if(typeof n.slideNumber==`function`)t=n.slideNumber(e);else{typeof n.slideNumber==`string`&&(r=n.slideNumber),/c/.test(r)||this.Reveal.getHorizontalSlides().length!==1||(r=`c`);let i=e&&e.dataset.visibility===`uncounted`?0:1;switch(t=[],r){case`c`:t.push(this.Reveal.getSlidePastCount(e)+i);break;case`c/t`:t.push(this.Reveal.getSlidePastCount(e)+i,`/`,this.Reveal.getTotalSlides());break;default:let n=this.Reveal.getIndices(e);t.push(n.h+i);let a=r===`h/v`?`/`:`.`;this.Reveal.isVerticalSlide(e)&&t.push(a,n.v+1)}}let i=`#`+this.Reveal.location.getHash(e);return this.formatNumber(t[0],t[1],t[2],i)}formatNumber(e,t,n,r=`#`+this.Reveal.location.getHash()){return typeof n!=`number`||isNaN(n)?`<a href="${r}">\n\t\t\t\t\t<span class="slide-number-a">${e}</span>\n\t\t\t\t\t</a>`:`<a href="${r}">\n\t\t\t\t\t<span class="slide-number-a">${e}</span>\n\t\t\t\t\t<span class="slide-number-delimiter">${t}</span>\n\t\t\t\t\t<span class="slide-number-b">${n}</span>\n\t\t\t\t\t</a>`}destroy(){this.element.remove()}},oe=class{constructor(e){this.Reveal=e,this.onInput=this.onInput.bind(this),this.onBlur=this.onBlur.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}render(){this.element=document.createElement(`div`),this.element.className=`jump-to-slide`,this.jumpInput=document.createElement(`input`),this.jumpInput.type=`text`,this.jumpInput.className=`jump-to-slide-input`,this.jumpInput.placeholder=`Jump to slide`,this.jumpInput.addEventListener(`input`,this.onInput),this.jumpInput.addEventListener(`keydown`,this.onKeyDown),this.jumpInput.addEventListener(`blur`,this.onBlur),this.element.appendChild(this.jumpInput)}show(){this.indicesOnShow=this.Reveal.getIndices(),this.Reveal.getRevealElement().appendChild(this.element),this.jumpInput.focus()}hide(){this.isVisible()&&(this.element.remove(),this.jumpInput.value=``,clearTimeout(this.jumpTimeout),delete this.jumpTimeout)}isVisible(){return!!this.element.parentNode}jump(){clearTimeout(this.jumpTimeout),delete this.jumpTimeout;let e,t=this.jumpInput.value.trim(``);if(/^\d+$/.test(t)){let n=this.Reveal.getConfig().slideNumber;if(n===`c`||n===`c/t`){let n=this.Reveal.getSlides()[parseInt(t,10)-1];n&&(e=this.Reveal.getIndices(n))}}return e||=(/^\d+\.\d+$/.test(t)&&(t=t.replace(`.`,`/`)),this.Reveal.location.getIndicesFromHash(t,{oneBasedIndex:!0})),!e&&/\S+/i.test(t)&&t.length>1&&(e=this.search(t)),e&&t!==``?(this.Reveal.slide(e.h,e.v,e.f),!0):(this.Reveal.slide(this.indicesOnShow.h,this.indicesOnShow.v,this.indicesOnShow.f),!1)}jumpAfter(e){clearTimeout(this.jumpTimeout),this.jumpTimeout=setTimeout((()=>this.jump()),e)}search(e){let t=RegExp(`\\b`+e.trim()+`\\b`,`i`),n=this.Reveal.getSlides().find((e=>t.test(e.innerText)));return n?this.Reveal.getIndices(n):null}cancel(){this.Reveal.slide(this.indicesOnShow.h,this.indicesOnShow.v,this.indicesOnShow.f),this.hide()}confirm(){this.jump(),this.hide()}destroy(){this.jumpInput.removeEventListener(`input`,this.onInput),this.jumpInput.removeEventListener(`keydown`,this.onKeyDown),this.jumpInput.removeEventListener(`blur`,this.onBlur),this.element.remove()}onKeyDown(e){e.keyCode===13?this.confirm():e.keyCode===27&&(this.cancel(),e.stopImmediatePropagation())}onInput(e){this.jumpAfter(200)}onBlur(){setTimeout((()=>this.hide()),1)}},A=e=>{let t=e.match(/^#([0-9a-f]{3})$/i);if(t&&t[1])return t=t[1],{r:17*parseInt(t.charAt(0),16),g:17*parseInt(t.charAt(1),16),b:17*parseInt(t.charAt(2),16)};let n=e.match(/^#([0-9a-f]{6})$/i);if(n&&n[1])return n=n[1],{r:parseInt(n.slice(0,2),16),g:parseInt(n.slice(2,4),16),b:parseInt(n.slice(4,6),16)};let r=e.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);if(r)return{r:parseInt(r[1],10),g:parseInt(r[2],10),b:parseInt(r[3],10)};let i=e.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i);return i?{r:parseInt(i[1],10),g:parseInt(i[2],10),b:parseInt(i[3],10),a:parseFloat(i[4])}:null},se=class{constructor(e){this.Reveal=e}render(){this.element=document.createElement(`div`),this.element.className=`backgrounds`,this.Reveal.getRevealElement().appendChild(this.element)}create(){this.element.innerHTML=``,this.element.classList.add(`no-transition`),this.Reveal.getHorizontalSlides().forEach((e=>{let t=this.createBackground(e,this.element);g(e,`section`).forEach((e=>{this.createBackground(e,t),t.classList.add(`stack`)}))})),this.Reveal.getConfig().parallaxBackgroundImage?(this.element.style.backgroundImage=`url("`+this.Reveal.getConfig().parallaxBackgroundImage+`")`,this.element.style.backgroundSize=this.Reveal.getConfig().parallaxBackgroundSize,this.element.style.backgroundRepeat=this.Reveal.getConfig().parallaxBackgroundRepeat,this.element.style.backgroundPosition=this.Reveal.getConfig().parallaxBackgroundPosition,setTimeout((()=>{this.Reveal.getRevealElement().classList.add(`has-parallax-background`)}),1)):(this.element.style.backgroundImage=``,this.Reveal.getRevealElement().classList.remove(`has-parallax-background`))}createBackground(e,t){let n=document.createElement(`div`);n.className=`slide-background `+e.className.replace(/present|past|future/,``);let r=document.createElement(`div`);return r.className=`slide-background-content`,n.appendChild(r),t.appendChild(n),e.slideBackgroundElement=n,e.slideBackgroundContentElement=r,this.sync(e),n}sync(e){let t=e.slideBackgroundElement,n=e.slideBackgroundContentElement,r={background:e.getAttribute(`data-background`),backgroundSize:e.getAttribute(`data-background-size`),backgroundImage:e.getAttribute(`data-background-image`),backgroundVideo:e.getAttribute(`data-background-video`),backgroundIframe:e.getAttribute(`data-background-iframe`),backgroundColor:e.getAttribute(`data-background-color`),backgroundGradient:e.getAttribute(`data-background-gradient`),backgroundRepeat:e.getAttribute(`data-background-repeat`),backgroundPosition:e.getAttribute(`data-background-position`),backgroundTransition:e.getAttribute(`data-background-transition`),backgroundOpacity:e.getAttribute(`data-background-opacity`)},i=e.hasAttribute(`data-preload`);e.classList.remove(`has-dark-background`),e.classList.remove(`has-light-background`),t.removeAttribute(`data-loaded`),t.removeAttribute(`data-background-hash`),t.removeAttribute(`data-background-size`),t.removeAttribute(`data-background-transition`),t.style.backgroundColor=``,n.style.backgroundSize=``,n.style.backgroundRepeat=``,n.style.backgroundPosition=``,n.style.backgroundImage=``,n.style.opacity=``,n.innerHTML=``,r.background&&(/^(http|file|\/\/)/gi.test(r.background)||/\.(svg|png|jpg|jpeg|gif|bmp|webp)([?#\s]|$)/gi.test(r.background)?e.setAttribute(`data-background-image`,r.background):t.style.background=r.background),(r.background||r.backgroundColor||r.backgroundGradient||r.backgroundImage||r.backgroundVideo||r.backgroundIframe)&&t.setAttribute(`data-background-hash`,r.background+r.backgroundSize+r.backgroundImage+r.backgroundVideo+r.backgroundIframe+r.backgroundColor+r.backgroundGradient+r.backgroundRepeat+r.backgroundPosition+r.backgroundTransition+r.backgroundOpacity),r.backgroundSize&&t.setAttribute(`data-background-size`,r.backgroundSize),r.backgroundColor&&(t.style.backgroundColor=r.backgroundColor),r.backgroundGradient&&(t.style.backgroundImage=r.backgroundGradient),r.backgroundTransition&&t.setAttribute(`data-background-transition`,r.backgroundTransition),i&&t.setAttribute(`data-preload`,``),r.backgroundSize&&(n.style.backgroundSize=r.backgroundSize),r.backgroundRepeat&&(n.style.backgroundRepeat=r.backgroundRepeat),r.backgroundPosition&&(n.style.backgroundPosition=r.backgroundPosition),r.backgroundOpacity&&(n.style.opacity=r.backgroundOpacity);let a=this.getContrastClass(e);typeof a==`string`&&e.classList.add(a)}getContrastClass(e){let t=e.slideBackgroundElement,n=e.getAttribute(`data-background-color`);if(!n||!A(n)){let e=window.getComputedStyle(t);e&&e.backgroundColor&&(n=e.backgroundColor)}if(n){let e=A(n);if(e&&e.a!==0)return typeof(r=n)==`string`&&(r=A(r)),(r?(299*r.r+587*r.g+114*r.b)/1e3:null)<128?`has-dark-background`:`has-light-background`}var r;return null}bubbleSlideContrastClassToElement(e,t){[`has-light-background`,`has-dark-background`].forEach((n=>{e.classList.contains(n)?t.classList.add(n):t.classList.remove(n)}),this)}update(e=!1){let t=this.Reveal.getConfig(),n=this.Reveal.getCurrentSlide(),r=this.Reveal.getIndices(),i=null,a=t.rtl?`future`:`past`,o=t.rtl?`past`:`future`;if(Array.from(this.element.childNodes).forEach(((t,n)=>{t.classList.remove(`past`,`present`,`future`),n<r.h?t.classList.add(a):n>r.h?t.classList.add(o):(t.classList.add(`present`),i=t),(e||n===r.h)&&g(t,`.slide-background`).forEach(((e,t)=>{e.classList.remove(`past`,`present`,`future`);let a=typeof r.v==`number`?r.v:0;t<a?e.classList.add(`past`):t>a?e.classList.add(`future`):(e.classList.add(`present`),n===r.h&&(i=e))}))})),this.previousBackground&&!this.previousBackground.closest(`body`)&&(this.previousBackground=null),i&&this.previousBackground){let e=this.previousBackground.getAttribute(`data-background-hash`),t=i.getAttribute(`data-background-hash`);if(t&&t===e&&i!==this.previousBackground){this.element.classList.add(`no-transition`);let e=i.querySelector(`video`),t=this.previousBackground.querySelector(`video`);if(e&&t){let n=e.parentNode;t.parentNode.appendChild(e),n.appendChild(t)}}}let s=i!==this.previousBackground;if(s&&this.previousBackground&&this.Reveal.slideContent.stopEmbeddedContent(this.previousBackground,{unloadIframes:!this.Reveal.slideContent.shouldPreload(this.previousBackground)}),s&&i){this.Reveal.slideContent.startEmbeddedContent(i);let e=i.querySelector(`.slide-background-content`);if(e){let t=e.style.backgroundImage||``;/\.gif/i.test(t)&&(e.style.backgroundImage=``,window.getComputedStyle(e).opacity,e.style.backgroundImage=t)}this.previousBackground=i}n&&this.bubbleSlideContrastClassToElement(n,this.Reveal.getRevealElement()),setTimeout((()=>{this.element.classList.remove(`no-transition`)}),10)}updateParallax(){let e=this.Reveal.getIndices();if(this.Reveal.getConfig().parallaxBackgroundImage){let t,n,r=this.Reveal.getHorizontalSlides(),i=this.Reveal.getVerticalSlides(),a=this.element.style.backgroundSize.split(` `);a.length===1?t=n=parseInt(a[0],10):(t=parseInt(a[0],10),n=parseInt(a[1],10));let o,s,c=this.element.offsetWidth,l=r.length;o=typeof this.Reveal.getConfig().parallaxBackgroundHorizontal==`number`?this.Reveal.getConfig().parallaxBackgroundHorizontal:l>1?(t-c)/(l-1):0,s=o*e.h*-1;let u,d,f=this.element.offsetHeight,p=i.length;u=typeof this.Reveal.getConfig().parallaxBackgroundVertical==`number`?this.Reveal.getConfig().parallaxBackgroundVertical:(n-f)/(p-1),d=p>0?u*e.v:0,this.element.style.backgroundPosition=s+`px `+-d+`px`}}destroy(){this.element.remove()}},j=0,ce=class{constructor(e){this.Reveal=e}run(e,t){this.reset();let n=this.Reveal.getSlides(),r=n.indexOf(t),i=n.indexOf(e);if(e&&t&&e.hasAttribute(`data-auto-animate`)&&t.hasAttribute(`data-auto-animate`)&&e.getAttribute(`data-auto-animate-id`)===t.getAttribute(`data-auto-animate-id`)&&!(r>i?t:e).hasAttribute(`data-auto-animate-restart`)){this.autoAnimateStyleSheet=this.autoAnimateStyleSheet||C();let n=this.getAutoAnimateOptions(t);e.dataset.autoAnimate=`pending`,t.dataset.autoAnimate=`pending`,n.slideDirection=r>i?`forward`:`backward`;let a=e.style.display===`none`;a&&(e.style.display=this.Reveal.getConfig().display);let o=this.getAutoAnimatableElements(e,t).map((e=>this.autoAnimateElements(e.from,e.to,e.options||{},n,j++)));if(a&&(e.style.display=`none`),t.dataset.autoAnimateUnmatched!==`false`&&!0===this.Reveal.getConfig().autoAnimateUnmatched){let e=.8*n.duration,r=.2*n.duration;this.getUnmatchedAutoAnimateElements(t).forEach((e=>{let t=this.getAutoAnimateOptions(e,n),r=`unmatched`;t.duration===n.duration&&t.delay===n.delay||(r=`unmatched-`+ j++,o.push(`[data-auto-animate="running"] [data-auto-animate-target="${r}"] { transition: opacity ${t.duration}s ease ${t.delay}s; }`)),e.dataset.autoAnimateTarget=r}),this),o.push(`[data-auto-animate="running"] [data-auto-animate-target="unmatched"] { transition: opacity ${e}s ease ${r}s; }`)}this.autoAnimateStyleSheet.innerHTML=o.join(``),requestAnimationFrame((()=>{this.autoAnimateStyleSheet&&(getComputedStyle(this.autoAnimateStyleSheet).fontWeight,t.dataset.autoAnimate=`running`)})),this.Reveal.dispatchEvent({type:`autoanimate`,data:{fromSlide:e,toSlide:t,sheet:this.autoAnimateStyleSheet}})}}reset(){g(this.Reveal.getRevealElement(),`[data-auto-animate]:not([data-auto-animate=""])`).forEach((e=>{e.dataset.autoAnimate=``})),g(this.Reveal.getRevealElement(),`[data-auto-animate-target]`).forEach((e=>{delete e.dataset.autoAnimateTarget})),this.autoAnimateStyleSheet&&this.autoAnimateStyleSheet.parentNode&&(this.autoAnimateStyleSheet.parentNode.removeChild(this.autoAnimateStyleSheet),this.autoAnimateStyleSheet=null)}autoAnimateElements(e,t,n,r,i){e.dataset.autoAnimateTarget=``,t.dataset.autoAnimateTarget=i;let a=this.getAutoAnimateOptions(t,r);n.delay!==void 0&&(a.delay=n.delay),n.duration!==void 0&&(a.duration=n.duration),n.easing!==void 0&&(a.easing=n.easing);let o=this.getAutoAnimatableProperties(`from`,e,n),s=this.getAutoAnimatableProperties(`to`,t,n);if(t.classList.contains(`fragment`)&&delete s.styles.opacity,!1!==n.translate||!1!==n.scale){let e=this.Reveal.getScale(),t={x:(o.x-s.x)/e,y:(o.y-s.y)/e,scaleX:o.width/s.width,scaleY:o.height/s.height};t.x=Math.round(1e3*t.x)/1e3,t.y=Math.round(1e3*t.y)/1e3,t.scaleX=Math.round(1e3*t.scaleX)/1e3,t.scaleX=Math.round(1e3*t.scaleX)/1e3;let r=!1!==n.translate&&(t.x!==0||t.y!==0),i=!1!==n.scale&&(t.scaleX!==0||t.scaleY!==0);if(r||i){let e=[];r&&e.push(`translate(${t.x}px, ${t.y}px)`),i&&e.push(`scale(${t.scaleX}, ${t.scaleY})`),o.styles.transform=e.join(` `),o.styles[`transform-origin`]=`top left`,s.styles.transform=`none`}}for(let e in s.styles){let t=s.styles[e],n=o.styles[e];t===n?delete s.styles[e]:(!0===t.explicitValue&&(s.styles[e]=t.value),!0===n.explicitValue&&(o.styles[e]=n.value))}let c=``,l=Object.keys(s.styles);return l.length>0&&(o.styles.transition=`none`,s.styles.transition=`all ${a.duration}s ${a.easing} ${a.delay}s`,s.styles[`transition-property`]=l.join(`, `),s.styles[`will-change`]=l.join(`, `),c=`[data-auto-animate-target="`+i+`"] {`+Object.keys(o.styles).map((e=>e+`: `+o.styles[e]+` !important;`)).join(``)+`}[data-auto-animate="running"] [data-auto-animate-target="`+i+`"] {`+Object.keys(s.styles).map((e=>e+`: `+s.styles[e]+` !important;`)).join(``)+`}`),c}getAutoAnimateOptions(e,t){let n={easing:this.Reveal.getConfig().autoAnimateEasing,duration:this.Reveal.getConfig().autoAnimateDuration,delay:0};if(n=h(n,t),e.parentNode){let t=x(e.parentNode,`[data-auto-animate-target]`);t&&(n=this.getAutoAnimateOptions(t,n))}return e.dataset.autoAnimateEasing&&(n.easing=e.dataset.autoAnimateEasing),e.dataset.autoAnimateDuration&&(n.duration=parseFloat(e.dataset.autoAnimateDuration)),e.dataset.autoAnimateDelay&&(n.delay=parseFloat(e.dataset.autoAnimateDelay)),n}getAutoAnimatableProperties(e,t,n){let r=this.Reveal.getConfig(),i={styles:[]};if(!1!==n.translate||!1!==n.scale){let e;if(typeof n.measure==`function`)e=n.measure(t);else if(r.center)e=t.getBoundingClientRect();else{let n=this.Reveal.getScale();e={x:t.offsetLeft*n,y:t.offsetTop*n,width:t.offsetWidth*n,height:t.offsetHeight*n}}i.x=e.x,i.y=e.y,i.width=e.width,i.height=e.height}let a=getComputedStyle(t);return(n.styles||r.autoAnimateStyles).forEach((t=>{let n;typeof t==`string`&&(t={property:t}),t.from!==void 0&&e===`from`?n={value:t.from,explicitValue:!0}:t.to!==void 0&&e===`to`?n={value:t.to,explicitValue:!0}:(t.property===`line-height`&&(n=parseFloat(a[`line-height`])/parseFloat(a[`font-size`])),isNaN(n)&&(n=a[t.property])),n!==``&&(i.styles[t.property]=n)})),i}getAutoAnimatableElements(e,t){let n=(typeof this.Reveal.getConfig().autoAnimateMatcher==`function`?this.Reveal.getConfig().autoAnimateMatcher:this.getAutoAnimatePairs).call(this,e,t),r=[];return n.filter(((e,t)=>{if(r.indexOf(e.to)===-1)return r.push(e.to),!0}))}getAutoAnimatePairs(e,t){let n=[],r=`h1, h2, h3, h4, h5, h6, p, li`;return this.findAutoAnimateMatches(n,e,t,`[data-id]`,(e=>e.nodeName+`:::`+e.getAttribute(`data-id`))),this.findAutoAnimateMatches(n,e,t,r,(e=>e.nodeName+`:::`+e.textContent.trim())),this.findAutoAnimateMatches(n,e,t,`img, video, iframe`,(e=>e.nodeName+`:::`+(e.getAttribute(`src`)||e.getAttribute(`data-src`)))),this.findAutoAnimateMatches(n,e,t,`pre`,(e=>e.nodeName+`:::`+e.textContent.trim())),n.forEach((e=>{b(e.from,r)?e.options={scale:!1}:b(e.from,`pre`)&&(e.options={scale:!1,styles:[`width`,`height`]},this.findAutoAnimateMatches(n,e.from,e.to,`.hljs .hljs-ln-code`,(e=>e.textContent),{scale:!1,styles:[],measure:this.getLocalBoundingBox.bind(this)}),this.findAutoAnimateMatches(n,e.from,e.to,`.hljs .hljs-ln-numbers[data-line-number]`,(e=>e.getAttribute(`data-line-number`)),{scale:!1,styles:[`width`],measure:this.getLocalBoundingBox.bind(this)}))}),this),n}getLocalBoundingBox(e){let t=this.Reveal.getScale();return{x:Math.round(e.offsetLeft*t*100)/100,y:Math.round(e.offsetTop*t*100)/100,width:Math.round(e.offsetWidth*t*100)/100,height:Math.round(e.offsetHeight*t*100)/100}}findAutoAnimateMatches(e,t,n,r,i,a){let o={},s={};[].slice.call(t.querySelectorAll(r)).forEach(((e,t)=>{let n=i(e);typeof n==`string`&&n.length&&(o[n]=o[n]||[],o[n].push(e))})),[].slice.call(n.querySelectorAll(r)).forEach(((t,n)=>{let r=i(t),c;if(s[r]=s[r]||[],s[r].push(t),o[r]){let e=s[r].length-1,t=o[r].length-1;o[r][e]?(c=o[r][e],o[r][e]=null):o[r][t]&&(c=o[r][t],o[r][t]=null)}c&&e.push({from:c,to:t,options:a})}))}getUnmatchedAutoAnimateElements(e){return[].slice.call(e.children).reduce(((e,t)=>{let n=t.querySelector(`[data-auto-animate-target]`);return t.hasAttribute(`data-auto-animate-target`)||n||e.push(t),t.querySelector(`[data-auto-animate-target]`)&&(e=e.concat(this.getUnmatchedAutoAnimateElements(t))),e}),[])}},le=class{constructor(e){this.Reveal=e,this.active=!1,this.activatedCallbacks=[],this.onScroll=this.onScroll.bind(this)}activate(){if(this.active)return;let e=this.Reveal.getState();this.active=!0,this.slideHTMLBeforeActivation=this.Reveal.getSlidesElement().innerHTML;let t=g(this.Reveal.getRevealElement(),k),n=g(this.Reveal.getRevealElement(),`.backgrounds>.slide-background`),r;this.viewportElement.classList.add(`loading-scroll-mode`,`reveal-scroll`);let i=window.getComputedStyle(this.viewportElement);i&&i.background&&(r=i.background);let a=[],o=t[0].parentNode,s,c=(e,t,i,o)=>{let c;if(s&&this.Reveal.shouldAutoAnimateBetween(s,e))c=document.createElement(`div`),c.className=`scroll-page-content scroll-auto-animate-page`,c.style.display=`none`,s.closest(`.scroll-page-content`).parentNode.appendChild(c);else{let e=document.createElement(`div`);if(e.className=`scroll-page`,a.push(e),o&&n.length>t){let i=n[t],a=window.getComputedStyle(i);a&&a.background?e.style.background=a.background:r&&(e.style.background=r)}else r&&(e.style.background=r);let i=document.createElement(`div`);i.className=`scroll-page-sticky`,e.appendChild(i),c=document.createElement(`div`),c.className=`scroll-page-content`,i.appendChild(c)}c.appendChild(e),e.classList.remove(`past`,`future`),e.setAttribute(`data-index-h`,t),e.setAttribute(`data-index-v`,i),e.slideBackgroundElement&&(e.slideBackgroundElement.remove(`past`,`future`),c.insertBefore(e.slideBackgroundElement,e)),s=e};t.forEach(((e,t)=>{this.Reveal.isVerticalStack(e)?e.querySelectorAll(`section`).forEach(((e,n)=>{c(e,t,n,!0)})):c(e,t,0)}),this),this.createProgressBar(),g(this.Reveal.getRevealElement(),`.stack`).forEach((e=>e.remove())),a.forEach((e=>o.appendChild(e))),this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()),this.Reveal.layout(),this.Reveal.setState(e),this.activatedCallbacks.forEach((e=>e())),this.activatedCallbacks=[],this.restoreScrollPosition(),this.viewportElement.classList.remove(`loading-scroll-mode`),this.viewportElement.addEventListener(`scroll`,this.onScroll,{passive:!0})}deactivate(){if(!this.active)return;let e=this.Reveal.getState();this.active=!1,this.viewportElement.removeEventListener(`scroll`,this.onScroll),this.viewportElement.classList.remove(`reveal-scroll`),this.removeProgressBar(),this.Reveal.getSlidesElement().innerHTML=this.slideHTMLBeforeActivation,this.Reveal.sync(),this.Reveal.setState(e),this.slideHTMLBeforeActivation=null}toggle(e){typeof e==`boolean`?e?this.activate():this.deactivate():this.isActive()?this.deactivate():this.activate()}isActive(){return this.active}createProgressBar(){this.progressBar=document.createElement(`div`),this.progressBar.className=`scrollbar`,this.progressBarInner=document.createElement(`div`),this.progressBarInner.className=`scrollbar-inner`,this.progressBar.appendChild(this.progressBarInner),this.progressBarPlayhead=document.createElement(`div`),this.progressBarPlayhead.className=`scrollbar-playhead`,this.progressBarInner.appendChild(this.progressBarPlayhead),this.viewportElement.insertBefore(this.progressBar,this.viewportElement.firstChild);let e=e=>{let t=(e.clientY-this.progressBarInner.getBoundingClientRect().top)/this.progressBarHeight;t=Math.max(Math.min(t,1),0),this.viewportElement.scrollTop=t*(this.viewportElement.scrollHeight-this.viewportElement.offsetHeight)},t=n=>{this.draggingProgressBar=!1,this.showProgressBar(),document.removeEventListener(`mousemove`,e),document.removeEventListener(`mouseup`,t)};this.progressBarInner.addEventListener(`mousedown`,(n=>{n.preventDefault(),this.draggingProgressBar=!0,document.addEventListener(`mousemove`,e),document.addEventListener(`mouseup`,t),e(n)}))}removeProgressBar(){this.progressBar&&=(this.progressBar.remove(),null)}layout(){this.isActive()&&(this.syncPages(),this.syncScrollPosition())}syncPages(){let e=this.Reveal.getConfig(),t=this.Reveal.getComputedSlideSize(window.innerWidth,window.innerHeight),n=this.Reveal.getScale(),r=e.scrollLayout===`compact`,i=this.viewportElement.offsetHeight,a=t.height*n,o=r?a:i;this.scrollTriggerHeight=r?a:i,this.viewportElement.style.setProperty(`--page-height`,o+`px`),this.viewportElement.style.scrollSnapType=typeof e.scrollSnap==`string`?`y ${e.scrollSnap}`:``,this.slideTriggers=[],this.pages=Array.from(this.Reveal.getRevealElement().querySelectorAll(`.scroll-page`)).map((n=>{let a=this.createPage({pageElement:n,slideElement:n.querySelector(`section`),stickyElement:n.querySelector(`.scroll-page-sticky`),contentElement:n.querySelector(`.scroll-page-content`),backgroundElement:n.querySelector(`.slide-background`),autoAnimateElements:n.querySelectorAll(`.scroll-auto-animate-page`),autoAnimatePages:[]});a.pageElement.style.setProperty(`--slide-height`,!0===e.center?`auto`:t.height+`px`),this.slideTriggers.push({page:a,activate:()=>this.activatePage(a),deactivate:()=>this.deactivatePage(a)}),this.createFragmentTriggersForPage(a),a.autoAnimateElements.length>0&&this.createAutoAnimateTriggersForPage(a);let s=Math.max(a.scrollTriggers.length-1,0);s+=a.autoAnimatePages.reduce(((e,t)=>e+Math.max(t.scrollTriggers.length-1,0)),a.autoAnimatePages.length),a.pageElement.querySelectorAll(`.scroll-snap-point`).forEach((e=>e.remove()));for(let e=0;e<s+1;e++){let t=document.createElement(`div`);t.className=`scroll-snap-point`,t.style.height=this.scrollTriggerHeight+`px`,t.style.scrollSnapAlign=r?`center`:`start`,a.pageElement.appendChild(t),e===0&&(t.style.marginTop=-this.scrollTriggerHeight+`px`)}return r&&a.scrollTriggers.length>0?(a.pageHeight=i,a.pageElement.style.setProperty(`--page-height`,i+`px`)):(a.pageHeight=o,a.pageElement.style.removeProperty(`--page-height`)),a.scrollPadding=this.scrollTriggerHeight*s,a.totalHeight=a.pageHeight+a.scrollPadding,a.pageElement.style.setProperty(`--page-scroll-padding`,a.scrollPadding+`px`),s>0?(a.stickyElement.style.position=`sticky`,a.stickyElement.style.top=Math.max((i-a.pageHeight)/2,0)+`px`):(a.stickyElement.style.position=`relative`,a.pageElement.style.scrollSnapAlign=a.pageHeight<i?`center`:`start`),a})),this.setTriggerRanges(),this.viewportElement.setAttribute(`data-scrollbar`,e.scrollProgress),e.scrollProgress&&this.totalScrollTriggerCount>1?(this.progressBar||this.createProgressBar(),this.syncProgressBar()):this.removeProgressBar()}setTriggerRanges(){this.totalScrollTriggerCount=this.slideTriggers.reduce(((e,t)=>e+Math.max(t.page.scrollTriggers.length,1)),0);let e=0;this.slideTriggers.forEach(((t,n)=>{t.range=[e,e+Math.max(t.page.scrollTriggers.length,1)/this.totalScrollTriggerCount];let r=(t.range[1]-t.range[0])/t.page.scrollTriggers.length;t.page.scrollTriggers.forEach(((t,n)=>{t.range=[e+n*r,e+(n+1)*r]})),e=t.range[1]})),this.slideTriggers[this.slideTriggers.length-1].range[1]=1}createFragmentTriggersForPage(e,t){t||=e.slideElement;let n=this.Reveal.fragments.sort(t.querySelectorAll(`.fragment`),!0);return n.length&&(e.fragments=this.Reveal.fragments.sort(t.querySelectorAll(`.fragment:not(.disabled)`)),e.scrollTriggers.push({activate:()=>{this.Reveal.fragments.update(-1,e.fragments,t)}}),n.forEach(((n,r)=>{e.scrollTriggers.push({activate:()=>{this.Reveal.fragments.update(r,e.fragments,t)}})}))),e.scrollTriggers.length}createAutoAnimateTriggersForPage(e){e.autoAnimateElements.length>0&&this.slideTriggers.push(...Array.from(e.autoAnimateElements).map(((t,n)=>{let r=this.createPage({slideElement:t.querySelector(`section`),contentElement:t,backgroundElement:t.querySelector(`.slide-background`)});return this.createFragmentTriggersForPage(r,r.slideElement),e.autoAnimatePages.push(r),{page:r,activate:()=>this.activatePage(r),deactivate:()=>this.deactivatePage(r)}})))}createPage(e){return e.scrollTriggers=[],e.indexh=parseInt(e.slideElement.getAttribute(`data-index-h`),10),e.indexv=parseInt(e.slideElement.getAttribute(`data-index-v`),10),e}syncProgressBar(){this.progressBarInner.querySelectorAll(`.scrollbar-slide`).forEach((e=>e.remove()));let e=this.viewportElement.scrollHeight,t=this.viewportElement.offsetHeight,n=t/e;this.progressBarHeight=this.progressBarInner.offsetHeight,this.playheadHeight=Math.max(n*this.progressBarHeight,8),this.progressBarScrollableHeight=this.progressBarHeight-this.playheadHeight;let r=t/e*this.progressBarHeight,i=Math.min(r/8,4);this.progressBarPlayhead.style.height=this.playheadHeight-i+`px`,r>6?this.slideTriggers.forEach((e=>{let{page:t}=e;t.progressBarSlide=document.createElement(`div`),t.progressBarSlide.className=`scrollbar-slide`,t.progressBarSlide.style.top=e.range[0]*this.progressBarHeight+`px`,t.progressBarSlide.style.height=(e.range[1]-e.range[0])*this.progressBarHeight-i+`px`,t.progressBarSlide.classList.toggle(`has-triggers`,t.scrollTriggers.length>0),this.progressBarInner.appendChild(t.progressBarSlide),t.scrollTriggerElements=t.scrollTriggers.map(((n,r)=>{let a=document.createElement(`div`);return a.className=`scrollbar-trigger`,a.style.top=(n.range[0]-e.range[0])*this.progressBarHeight+`px`,a.style.height=(n.range[1]-n.range[0])*this.progressBarHeight-i+`px`,t.progressBarSlide.appendChild(a),r===0&&(a.style.display=`none`),a}))})):this.pages.forEach((e=>e.progressBarSlide=null))}syncScrollPosition(){let e=this.viewportElement.offsetHeight,t=e/this.viewportElement.scrollHeight,n=this.viewportElement.scrollTop,r=this.viewportElement.scrollHeight-e,i=Math.max(Math.min(n/r,1),0),a=Math.max(Math.min((n+e/2)/this.viewportElement.scrollHeight,1),0),o;this.slideTriggers.forEach((e=>{let{page:n}=e;i>=e.range[0]-2*t&&i<=e.range[1]+2*t&&!n.loaded?(n.loaded=!0,this.Reveal.slideContent.load(n.slideElement)):n.loaded&&(n.loaded=!1,this.Reveal.slideContent.unload(n.slideElement)),i>=e.range[0]&&i<=e.range[1]?(this.activateTrigger(e),o=e.page):e.active&&this.deactivateTrigger(e)})),o&&o.scrollTriggers.forEach((e=>{a>=e.range[0]&&a<=e.range[1]?this.activateTrigger(e):e.active&&this.deactivateTrigger(e)})),this.setProgressBarValue(n/(this.viewportElement.scrollHeight-e))}setProgressBarValue(e){this.progressBar&&(this.progressBarPlayhead.style.transform=`translateY(${e*this.progressBarScrollableHeight}px)`,this.getAllPages().filter((e=>e.progressBarSlide)).forEach((e=>{e.progressBarSlide.classList.toggle(`active`,!0===e.active),e.scrollTriggers.forEach(((t,n)=>{e.scrollTriggerElements[n].classList.toggle(`active`,!0===e.active&&!0===t.active)}))})),this.showProgressBar())}showProgressBar(){this.progressBar.classList.add(`visible`),clearTimeout(this.hideProgressBarTimeout),this.Reveal.getConfig().scrollProgress!==`auto`||this.draggingProgressBar||(this.hideProgressBarTimeout=setTimeout((()=>{this.progressBar&&this.progressBar.classList.remove(`visible`)}),500))}prev(){this.viewportElement.scrollTop-=this.scrollTriggerHeight}next(){this.viewportElement.scrollTop+=this.scrollTriggerHeight}scrollToSlide(e){if(this.active){let t=this.getScrollTriggerBySlide(e);t&&(this.viewportElement.scrollTop=t.range[0]*(this.viewportElement.scrollHeight-this.viewportElement.offsetHeight))}else this.activatedCallbacks.push((()=>this.scrollToSlide(e)))}storeScrollPosition(){clearTimeout(this.storeScrollPositionTimeout),this.storeScrollPositionTimeout=setTimeout((()=>{sessionStorage.setItem(`reveal-scroll-top`,this.viewportElement.scrollTop),sessionStorage.setItem(`reveal-scroll-origin`,location.origin+location.pathname),this.storeScrollPositionTimeout=null}),50)}restoreScrollPosition(){let e=sessionStorage.getItem(`reveal-scroll-top`),t=sessionStorage.getItem(`reveal-scroll-origin`);e&&t===location.origin+location.pathname&&(this.viewportElement.scrollTop=parseInt(e,10))}activatePage(e){if(!e.active){e.active=!0;let{slideElement:t,backgroundElement:n,contentElement:r,indexh:i,indexv:a}=e;r.style.display=`block`,t.classList.add(`present`),n&&n.classList.add(`present`),this.Reveal.setCurrentScrollPage(t,i,a),this.Reveal.backgrounds.bubbleSlideContrastClassToElement(t,this.viewportElement),Array.from(r.parentNode.querySelectorAll(`.scroll-page-content`)).forEach((e=>{e!==r&&(e.style.display=`none`)}))}}deactivatePage(e){e.active&&(e.active=!1,e.slideElement&&e.slideElement.classList.remove(`present`),e.backgroundElement&&e.backgroundElement.classList.remove(`present`))}activateTrigger(e){e.active||(e.active=!0,e.activate())}deactivateTrigger(e){e.active&&(e.active=!1,e.deactivate&&e.deactivate())}getSlideByIndices(e,t){let n=this.getAllPages().find((n=>n.indexh===e&&n.indexv===t));return n?n.slideElement:null}getScrollTriggerBySlide(e){return this.slideTriggers.find((t=>t.page.slideElement===e))}getAllPages(){return this.pages.flatMap((e=>[e,...e.autoAnimatePages||[]]))}onScroll(){this.syncScrollPosition(),this.storeScrollPosition()}get viewportElement(){return this.Reveal.getViewportElement()}},ue=class{constructor(e){this.Reveal=e}async activate(){let e=this.Reveal.getConfig(),t=g(this.Reveal.getRevealElement(),O),n=e.slideNumber&&/all|print/i.test(e.showSlideNumber),r=this.Reveal.getComputedSlideSize(window.innerWidth,window.innerHeight),i=Math.floor(r.width*(1+e.margin)),a=Math.floor(r.height*(1+e.margin)),o=r.width,s=r.height;await new Promise(requestAnimationFrame),C(`@page{size:`+i+`px `+a+`px; margin: 0px;}`),C(`.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: `+o+`px; max-height:`+s+`px}`),document.documentElement.classList.add(`reveal-print`,`print-pdf`),document.body.style.width=i+`px`,document.body.style.height=a+`px`;let c=this.Reveal.getViewportElement(),l;if(c){let e=window.getComputedStyle(c);e&&e.background&&(l=e.background)}await new Promise(requestAnimationFrame),this.Reveal.layoutSlideContents(o,s),await new Promise(requestAnimationFrame);let u=t.map((e=>e.scrollHeight)),d=[],f=t[0].parentNode,p=1;t.forEach((function(t,r){if(!1===t.classList.contains(`stack`)){let c=(i-o)/2,f=(a-s)/2,m=u[r],h=Math.max(Math.ceil(m/a),1);h=Math.min(h,e.pdfMaxPagesPerSlide),(h===1&&e.center||t.classList.contains(`center`))&&(f=Math.max((a-m)/2,0));let _=document.createElement(`div`);if(d.push(_),_.className=`pdf-page`,_.style.height=(a+e.pdfPageHeightOffset)*h+`px`,l&&(_.style.background=l),_.appendChild(t),t.style.left=c+`px`,t.style.top=f+`px`,t.style.width=o+`px`,this.Reveal.slideContent.layout(t),t.slideBackgroundElement&&_.insertBefore(t.slideBackgroundElement,t),e.showNotes){let n=this.Reveal.getSlideNotes(t);if(n){let t=typeof e.showNotes==`string`?e.showNotes:`inline`,r=document.createElement(`div`);r.classList.add(`speaker-notes`),r.classList.add(`speaker-notes-pdf`),r.setAttribute(`data-layout`,t),r.innerHTML=n,t===`separate-page`?d.push(r):(r.style.left=`8px`,r.style.bottom=`8px`,r.style.width=i-16+`px`,_.appendChild(r))}}if(n){let e=document.createElement(`div`);e.classList.add(`slide-number`),e.classList.add(`slide-number-pdf`),e.innerHTML=p++,_.appendChild(e)}if(e.pdfSeparateFragments){let e=this.Reveal.fragments.sort(_.querySelectorAll(`.fragment`),!0),t;e.forEach((function(e,r){t&&t.forEach((function(e){e.classList.remove(`current-fragment`)})),e.forEach((function(e){e.classList.add(`visible`,`current-fragment`)}),this);let i=_.cloneNode(!0);if(n){let e=r+1;i.querySelector(`.slide-number-pdf`).innerHTML+=`.`+e}d.push(i),t=e}),this),e.forEach((function(e){e.forEach((function(e){e.classList.remove(`visible`,`current-fragment`)}))}))}else g(_,`.fragment:not(.fade-out)`).forEach((function(e){e.classList.add(`visible`)}))}}),this),await new Promise(requestAnimationFrame),d.forEach((e=>f.appendChild(e))),this.Reveal.slideContent.layout(this.Reveal.getSlidesElement()),this.Reveal.dispatchEvent({type:`pdf-ready`}),c.classList.remove(`loading-scroll-mode`)}isActive(){return this.Reveal.getConfig().view===`print`}},de=class{constructor(e){this.Reveal=e}configure(e,t){!1===e.fragments?this.disable():!1===t.fragments&&this.enable()}disable(){g(this.Reveal.getSlidesElement(),`.fragment`).forEach((e=>{e.classList.add(`visible`),e.classList.remove(`current-fragment`)}))}enable(){g(this.Reveal.getSlidesElement(),`.fragment`).forEach((e=>{e.classList.remove(`visible`),e.classList.remove(`current-fragment`)}))}availableRoutes(){let e=this.Reveal.getCurrentSlide();if(e&&this.Reveal.getConfig().fragments){let t=e.querySelectorAll(`.fragment:not(.disabled)`),n=e.querySelectorAll(`.fragment:not(.disabled):not(.visible)`);return{prev:t.length-n.length>0,next:!!n.length}}return{prev:!1,next:!1}}sort(e,t=!1){e=Array.from(e);let n=[],r=[],i=[];e.forEach((e=>{if(e.hasAttribute(`data-fragment-index`)){let t=parseInt(e.getAttribute(`data-fragment-index`),10);n[t]||(n[t]=[]),n[t].push(e)}else r.push([e])})),n=n.concat(r);let a=0;return n.forEach((e=>{e.forEach((e=>{i.push(e),e.setAttribute(`data-fragment-index`,a)})),a++})),!0===t?n:i}sortAll(){this.Reveal.getHorizontalSlides().forEach((e=>{let t=g(e,`section`);t.forEach(((e,t)=>{this.sort(e.querySelectorAll(`.fragment`))}),this),t.length===0&&this.sort(e.querySelectorAll(`.fragment`))}))}update(e,t,n=this.Reveal.getCurrentSlide()){let r={shown:[],hidden:[]};if(n&&this.Reveal.getConfig().fragments&&(t||=this.sort(n.querySelectorAll(`.fragment`))).length){let i=0;if(typeof e!=`number`){let t=this.sort(n.querySelectorAll(`.fragment.visible`)).pop();t&&(e=parseInt(t.getAttribute(`data-fragment-index`)||0,10))}Array.from(t).forEach(((t,n)=>{if(t.hasAttribute(`data-fragment-index`)&&(n=parseInt(t.getAttribute(`data-fragment-index`),10)),i=Math.max(i,n),n<=e){let i=t.classList.contains(`visible`);t.classList.add(`visible`),t.classList.remove(`current-fragment`),n===e&&(this.Reveal.announceStatus(this.Reveal.getStatusText(t)),t.classList.add(`current-fragment`),this.Reveal.slideContent.startEmbeddedContent(t)),i||(r.shown.push(t),this.Reveal.dispatchEvent({target:t,type:`visible`,bubbles:!1}))}else{let e=t.classList.contains(`visible`);t.classList.remove(`visible`),t.classList.remove(`current-fragment`),e&&(this.Reveal.slideContent.stopEmbeddedContent(t),r.hidden.push(t),this.Reveal.dispatchEvent({target:t,type:`hidden`,bubbles:!1}))}})),e=typeof e==`number`?e:-1,e=Math.max(Math.min(e,i),-1),n.setAttribute(`data-fragment`,e)}return r.hidden.length&&this.Reveal.dispatchEvent({type:`fragmenthidden`,data:{fragment:r.hidden[0],fragments:r.hidden}}),r.shown.length&&this.Reveal.dispatchEvent({type:`fragmentshown`,data:{fragment:r.shown[0],fragments:r.shown}}),r}sync(e=this.Reveal.getCurrentSlide()){return this.sort(e.querySelectorAll(`.fragment`))}goto(e,t=0){let n=this.Reveal.getCurrentSlide();if(n&&this.Reveal.getConfig().fragments){let r=this.sort(n.querySelectorAll(`.fragment:not(.disabled)`));if(r.length){if(typeof e!=`number`){let t=this.sort(n.querySelectorAll(`.fragment:not(.disabled).visible`)).pop();e=t?parseInt(t.getAttribute(`data-fragment-index`)||0,10):-1}e+=t;let i=this.update(e,r);return this.Reveal.controls.update(),this.Reveal.progress.update(),this.Reveal.getConfig().fragmentInURL&&this.Reveal.location.writeURL(),!(!i.shown.length&&!i.hidden.length)}}return!1}next(){return this.goto(null,1)}prev(){return this.goto(null,-1)}},fe=class{constructor(e){this.Reveal=e,this.active=!1,this.onSlideClicked=this.onSlideClicked.bind(this)}activate(){if(this.Reveal.getConfig().overview&&!this.Reveal.isScrollView()&&!this.isActive()){this.active=!0,this.Reveal.getRevealElement().classList.add(`overview`),this.Reveal.cancelAutoSlide(),this.Reveal.getSlidesElement().appendChild(this.Reveal.getBackgroundsElement()),g(this.Reveal.getRevealElement(),O).forEach((e=>{e.classList.contains(`stack`)||e.addEventListener(`click`,this.onSlideClicked,!0)}));let e=this.Reveal.getComputedSlideSize();this.overviewSlideWidth=e.width+70,this.overviewSlideHeight=e.height+70,this.Reveal.getConfig().rtl&&(this.overviewSlideWidth=-this.overviewSlideWidth),this.Reveal.updateSlidesVisibility(),this.layout(),this.update(),this.Reveal.layout();let t=this.Reveal.getIndices();this.Reveal.dispatchEvent({type:`overviewshown`,data:{indexh:t.h,indexv:t.v,currentSlide:this.Reveal.getCurrentSlide()}})}}layout(){this.Reveal.getHorizontalSlides().forEach(((e,t)=>{e.setAttribute(`data-index-h`,t),y(e,`translate3d(`+t*this.overviewSlideWidth+`px, 0, 0)`),e.classList.contains(`stack`)&&g(e,`section`).forEach(((e,n)=>{e.setAttribute(`data-index-h`,t),e.setAttribute(`data-index-v`,n),y(e,`translate3d(0, `+n*this.overviewSlideHeight+`px, 0)`)}))})),Array.from(this.Reveal.getBackgroundsElement().childNodes).forEach(((e,t)=>{y(e,`translate3d(`+t*this.overviewSlideWidth+`px, 0, 0)`),g(e,`.slide-background`).forEach(((e,t)=>{y(e,`translate3d(0, `+t*this.overviewSlideHeight+`px, 0)`)}))}))}update(){let e=Math.min(window.innerWidth,window.innerHeight),t=Math.max(e/5,150)/e,n=this.Reveal.getIndices();this.Reveal.transformSlides({overview:[`scale(`+t+`)`,`translateX(`+-n.h*this.overviewSlideWidth+`px)`,`translateY(`+-n.v*this.overviewSlideHeight+`px)`].join(` `)})}deactivate(){if(this.Reveal.getConfig().overview){this.active=!1,this.Reveal.getRevealElement().classList.remove(`overview`),this.Reveal.getRevealElement().classList.add(`overview-deactivating`),setTimeout((()=>{this.Reveal.getRevealElement().classList.remove(`overview-deactivating`)}),1),this.Reveal.getRevealElement().appendChild(this.Reveal.getBackgroundsElement()),g(this.Reveal.getRevealElement(),O).forEach((e=>{y(e,``),e.removeEventListener(`click`,this.onSlideClicked,!0)})),g(this.Reveal.getBackgroundsElement(),`.slide-background`).forEach((e=>{y(e,``)})),this.Reveal.transformSlides({overview:``});let e=this.Reveal.getIndices();this.Reveal.slide(e.h,e.v),this.Reveal.layout(),this.Reveal.cueAutoSlide(),this.Reveal.dispatchEvent({type:`overviewhidden`,data:{indexh:e.h,indexv:e.v,currentSlide:this.Reveal.getCurrentSlide()}})}}toggle(e){typeof e==`boolean`?e?this.activate():this.deactivate():this.isActive()?this.deactivate():this.activate()}isActive(){return this.active}onSlideClicked(e){if(this.isActive()){e.preventDefault();let t=e.target;for(;t&&!t.nodeName.match(/section/gi);)t=t.parentNode;if(t&&!t.classList.contains(`disabled`)&&(this.deactivate(),t.nodeName.match(/section/gi))){let e=parseInt(t.getAttribute(`data-index-h`),10),n=parseInt(t.getAttribute(`data-index-v`),10);this.Reveal.slide(e,n)}}}},pe=class{constructor(e){this.Reveal=e,this.shortcuts={},this.bindings={},this.onDocumentKeyDown=this.onDocumentKeyDown.bind(this)}configure(e,t){e.navigationMode===`linear`?(this.shortcuts[`&#8594;  ,  &#8595;  ,  SPACE  ,  N  ,  L  ,  J`]=`Next slide`,this.shortcuts[`&#8592;  ,  &#8593;  ,  P  ,  H  ,  K`]=`Previous slide`):(this.shortcuts[`N  ,  SPACE`]=`Next slide`,this.shortcuts[`P  ,  Shift SPACE`]=`Previous slide`,this.shortcuts[`&#8592;  ,  H`]=`Navigate left`,this.shortcuts[`&#8594;  ,  L`]=`Navigate right`,this.shortcuts[`&#8593;  ,  K`]=`Navigate up`,this.shortcuts[`&#8595;  ,  J`]=`Navigate down`),this.shortcuts[`Alt + &#8592;/&#8593/&#8594;/&#8595;`]=`Navigate without fragments`,this.shortcuts[`Shift + &#8592;/&#8593/&#8594;/&#8595;`]=`Jump to first/last slide`,this.shortcuts[`B  ,  .`]=`Pause`,this.shortcuts.F=`Fullscreen`,this.shortcuts.G=`Jump to slide`,this.shortcuts[`ESC, O`]=`Slide overview`}bind(){document.addEventListener(`keydown`,this.onDocumentKeyDown,!1)}unbind(){document.removeEventListener(`keydown`,this.onDocumentKeyDown,!1)}addKeyBinding(e,t){typeof e==`object`&&e.keyCode?this.bindings[e.keyCode]={callback:t,key:e.key,description:e.description}:this.bindings[e]={callback:t,key:null,description:null}}removeKeyBinding(e){delete this.bindings[e]}triggerKey(e){this.onDocumentKeyDown({keyCode:e})}registerKeyboardShortcut(e,t){this.shortcuts[e]=t}getShortcuts(){return this.shortcuts}getBindings(){return this.bindings}onDocumentKeyDown(e){let t=this.Reveal.getConfig();if(typeof t.keyboardCondition==`function`&&!1===t.keyboardCondition(e)||t.keyboardCondition===`focused`&&!this.Reveal.isFocused())return!0;let n=e.keyCode,r=!this.Reveal.isAutoSliding();this.Reveal.onUserInput(e);let i=document.activeElement&&!0===document.activeElement.isContentEditable,a=document.activeElement&&document.activeElement.tagName&&/input|textarea/i.test(document.activeElement.tagName),o=document.activeElement&&document.activeElement.className&&/speaker-notes/i.test(document.activeElement.className),s=!([32,37,38,39,40,63,78,80,191].indexOf(e.keyCode)!==-1&&e.shiftKey||e.altKey)&&(e.shiftKey||e.altKey||e.ctrlKey||e.metaKey);if(i||a||o||s)return;let c,l=[66,86,190,191,112];if(typeof t.keyboard==`object`)for(c in t.keyboard)t.keyboard[c]===`togglePause`&&l.push(parseInt(c,10));if(this.Reveal.isOverlayOpen()&&![`Escape`,`f`,`c`,`b`,`.`].includes(e.key)||this.Reveal.isPaused()&&l.indexOf(n)===-1)return!1;let u=t.navigationMode===`linear`||!this.Reveal.hasHorizontalSlides()||!this.Reveal.hasVerticalSlides(),d=!1;if(typeof t.keyboard==`object`){for(c in t.keyboard)if(parseInt(c,10)===n){let n=t.keyboard[c];typeof n==`function`?n.apply(null,[e]):typeof n==`string`&&typeof this.Reveal[n]==`function`&&this.Reveal[n].call(),d=!0}}if(!1===d){for(c in this.bindings)if(parseInt(c,10)===n){let t=this.bindings[c].callback;typeof t==`function`?t.apply(null,[e]):typeof t==`string`&&typeof this.Reveal[t]==`function`&&this.Reveal[t].call(),d=!0}}!1===d&&(d=!0,n===80||n===33?this.Reveal.prev({skipFragments:e.altKey}):n===78||n===34?this.Reveal.next({skipFragments:e.altKey}):n===72||n===37?e.shiftKey?this.Reveal.slide(0):!this.Reveal.overview.isActive()&&u?t.rtl?this.Reveal.next({skipFragments:e.altKey}):this.Reveal.prev({skipFragments:e.altKey}):this.Reveal.left({skipFragments:e.altKey}):n===76||n===39?e.shiftKey?this.Reveal.slide(this.Reveal.getHorizontalSlides().length-1):!this.Reveal.overview.isActive()&&u?t.rtl?this.Reveal.prev({skipFragments:e.altKey}):this.Reveal.next({skipFragments:e.altKey}):this.Reveal.right({skipFragments:e.altKey}):n===75||n===38?e.shiftKey?this.Reveal.slide(void 0,0):!this.Reveal.overview.isActive()&&u?this.Reveal.prev({skipFragments:e.altKey}):this.Reveal.up({skipFragments:e.altKey}):n===74||n===40?e.shiftKey?this.Reveal.slide(void 0,Number.MAX_VALUE):!this.Reveal.overview.isActive()&&u?this.Reveal.next({skipFragments:e.altKey}):this.Reveal.down({skipFragments:e.altKey}):n===36?this.Reveal.slide(0):n===35?this.Reveal.slide(this.Reveal.getHorizontalSlides().length-1):n===32?(this.Reveal.overview.isActive()&&this.Reveal.overview.deactivate(),e.shiftKey?this.Reveal.prev({skipFragments:e.altKey}):this.Reveal.next({skipFragments:e.altKey})):[58,59,66,86,190].includes(n)||n===191&&!e.shiftKey?this.Reveal.togglePause():n===70?S(t.embedded?this.Reveal.getViewportElement():document.documentElement):n===65?t.autoSlideStoppable&&this.Reveal.toggleAutoSlide(r):n===71?t.jumpToSlide&&this.Reveal.toggleJumpToSlide():n===67&&this.Reveal.isOverlayOpen()?this.Reveal.closeOverlay():n!==63&&n!==191||!e.shiftKey?n===112?this.Reveal.toggleHelp():d=!1:this.Reveal.toggleHelp()),d?e.preventDefault&&e.preventDefault():n!==27&&n!==79||(!1===this.Reveal.closeOverlay()&&this.Reveal.overview.toggle(),e.preventDefault&&e.preventDefault()),this.Reveal.cueAutoSlide()}},me=class{MAX_REPLACE_STATE_FREQUENCY=1e3;constructor(e){this.Reveal=e,this.writeURLTimeout=0,this.replaceStateTimestamp=0,this.onWindowHashChange=this.onWindowHashChange.bind(this)}bind(){window.addEventListener(`hashchange`,this.onWindowHashChange,!1)}unbind(){window.removeEventListener(`hashchange`,this.onWindowHashChange,!1)}getIndicesFromHash(e=window.location.hash,t={}){let n=e.replace(/^#\/?/,``),r=n.split(`/`);if(/^[0-9]*$/.test(r[0])||!n.length){let e=this.Reveal.getConfig(),n,i=e.hashOneBasedIndex||t.oneBasedIndex?1:0,a=parseInt(r[0],10)-i||0,o=parseInt(r[1],10)-i||0;return e.fragmentInURL&&(n=parseInt(r[2],10),isNaN(n)&&(n=void 0)),{h:a,v:o,f:n}}{let e,t;/\/[-\d]+$/g.test(n)&&(t=parseInt(n.split(`/`).pop(),10),t=isNaN(t)?void 0:t,n=n.split(`/`).shift());try{e=document.getElementById(decodeURIComponent(n)).closest(`.slides section`)}catch{}if(e)return{...this.Reveal.getIndices(e),f:t}}return null}readURL(){let e=this.Reveal.getIndices(),t=this.getIndicesFromHash();t?t.h===e.h&&t.v===e.v&&t.f===void 0||this.Reveal.slide(t.h,t.v,t.f):this.Reveal.slide(e.h||0,e.v||0)}writeURL(e){let t=this.Reveal.getConfig(),n=this.Reveal.getCurrentSlide();if(clearTimeout(this.writeURLTimeout),typeof e==`number`)this.writeURLTimeout=setTimeout(this.writeURL,e);else if(n){let e=this.getHash();t.history?window.location.hash=e:t.hash&&(e===`/`?this.debouncedReplaceState(window.location.pathname+window.location.search):this.debouncedReplaceState(`#`+e))}}replaceState(e){window.history.replaceState(null,null,e),this.replaceStateTimestamp=Date.now()}debouncedReplaceState(e){clearTimeout(this.replaceStateTimeout),Date.now()-this.replaceStateTimestamp>this.MAX_REPLACE_STATE_FREQUENCY?this.replaceState(e):this.replaceStateTimeout=setTimeout((()=>this.replaceState(e)),this.MAX_REPLACE_STATE_FREQUENCY)}getHash(e){let t=`/`,n=e||this.Reveal.getCurrentSlide(),r=n?n.getAttribute(`id`):null;r&&=encodeURIComponent(r);let i=this.Reveal.getIndices(e);if(this.Reveal.getConfig().fragmentInURL||(i.f=void 0),typeof r==`string`&&r.length)t=`/`+r,i.f>=0&&(t+=`/`+i.f);else{let e=this.Reveal.getConfig().hashOneBasedIndex?1:0;(i.h>0||i.v>0||i.f>=0)&&(t+=i.h+e),(i.v>0||i.f>=0)&&(t+=`/`+(i.v+e)),i.f>=0&&(t+=`/`+i.f)}return t}onWindowHashChange(e){this.readURL()}},he=class{constructor(e){this.Reveal=e,this.onNavigateLeftClicked=this.onNavigateLeftClicked.bind(this),this.onNavigateRightClicked=this.onNavigateRightClicked.bind(this),this.onNavigateUpClicked=this.onNavigateUpClicked.bind(this),this.onNavigateDownClicked=this.onNavigateDownClicked.bind(this),this.onNavigatePrevClicked=this.onNavigatePrevClicked.bind(this),this.onNavigateNextClicked=this.onNavigateNextClicked.bind(this),this.onEnterFullscreen=this.onEnterFullscreen.bind(this)}render(){let e=this.Reveal.getConfig().rtl,t=this.Reveal.getRevealElement();this.element=document.createElement(`aside`),this.element.className=`controls`,this.element.innerHTML=`<button class="navigate-left" aria-label="${e?`next slide`:`previous slide`}"><div class="controls-arrow"></div></button>\n\t\t\t<button class="navigate-right" aria-label="${e?`previous slide`:`next slide`}"><div class="controls-arrow"></div></button>\n\t\t\t<button class="navigate-up" aria-label="above slide"><div class="controls-arrow"></div></button>\n\t\t\t<button class="navigate-down" aria-label="below slide"><div class="controls-arrow"></div></button>`,this.Reveal.getRevealElement().appendChild(this.element),this.controlsLeft=g(t,`.navigate-left`),this.controlsRight=g(t,`.navigate-right`),this.controlsUp=g(t,`.navigate-up`),this.controlsDown=g(t,`.navigate-down`),this.controlsPrev=g(t,`.navigate-prev`),this.controlsNext=g(t,`.navigate-next`),this.controlsFullscreen=g(t,`.enter-fullscreen`),this.controlsRightArrow=this.element.querySelector(`.navigate-right`),this.controlsLeftArrow=this.element.querySelector(`.navigate-left`),this.controlsDownArrow=this.element.querySelector(`.navigate-down`)}configure(e,t){this.element.style.display=e.controls&&(e.controls!==`speaker-only`||this.Reveal.isSpeakerNotes())?`block`:`none`,this.element.setAttribute(`data-controls-layout`,e.controlsLayout),this.element.setAttribute(`data-controls-back-arrows`,e.controlsBackArrows)}bind(){let e=[`touchstart`,`click`];E&&(e=[`touchstart`]),e.forEach((e=>{this.controlsLeft.forEach((t=>t.addEventListener(e,this.onNavigateLeftClicked,!1))),this.controlsRight.forEach((t=>t.addEventListener(e,this.onNavigateRightClicked,!1))),this.controlsUp.forEach((t=>t.addEventListener(e,this.onNavigateUpClicked,!1))),this.controlsDown.forEach((t=>t.addEventListener(e,this.onNavigateDownClicked,!1))),this.controlsPrev.forEach((t=>t.addEventListener(e,this.onNavigatePrevClicked,!1))),this.controlsNext.forEach((t=>t.addEventListener(e,this.onNavigateNextClicked,!1))),this.controlsFullscreen.forEach((t=>t.addEventListener(e,this.onEnterFullscreen,!1)))}))}unbind(){[`touchstart`,`click`].forEach((e=>{this.controlsLeft.forEach((t=>t.removeEventListener(e,this.onNavigateLeftClicked,!1))),this.controlsRight.forEach((t=>t.removeEventListener(e,this.onNavigateRightClicked,!1))),this.controlsUp.forEach((t=>t.removeEventListener(e,this.onNavigateUpClicked,!1))),this.controlsDown.forEach((t=>t.removeEventListener(e,this.onNavigateDownClicked,!1))),this.controlsPrev.forEach((t=>t.removeEventListener(e,this.onNavigatePrevClicked,!1))),this.controlsNext.forEach((t=>t.removeEventListener(e,this.onNavigateNextClicked,!1))),this.controlsFullscreen.forEach((t=>t.removeEventListener(e,this.onEnterFullscreen,!1)))}))}update(){let e=this.Reveal.availableRoutes();[...this.controlsLeft,...this.controlsRight,...this.controlsUp,...this.controlsDown,...this.controlsPrev,...this.controlsNext].forEach((e=>{e.classList.remove(`enabled`,`fragmented`),e.setAttribute(`disabled`,`disabled`)})),e.left&&this.controlsLeft.forEach((e=>{e.classList.add(`enabled`),e.removeAttribute(`disabled`)})),e.right&&this.controlsRight.forEach((e=>{e.classList.add(`enabled`),e.removeAttribute(`disabled`)})),e.up&&this.controlsUp.forEach((e=>{e.classList.add(`enabled`),e.removeAttribute(`disabled`)})),e.down&&this.controlsDown.forEach((e=>{e.classList.add(`enabled`),e.removeAttribute(`disabled`)})),(e.left||e.up)&&this.controlsPrev.forEach((e=>{e.classList.add(`enabled`),e.removeAttribute(`disabled`)})),(e.right||e.down)&&this.controlsNext.forEach((e=>{e.classList.add(`enabled`),e.removeAttribute(`disabled`)}));let t=this.Reveal.getCurrentSlide();if(t){let e=this.Reveal.fragments.availableRoutes();e.prev&&this.controlsPrev.forEach((e=>{e.classList.add(`fragmented`,`enabled`),e.removeAttribute(`disabled`)})),e.next&&this.controlsNext.forEach((e=>{e.classList.add(`fragmented`,`enabled`),e.removeAttribute(`disabled`)}));let n=this.Reveal.isVerticalSlide(t),r=n&&t.parentElement&&t.parentElement.querySelectorAll(`:scope > section`).length>1;n&&r?(e.prev&&this.controlsUp.forEach((e=>{e.classList.add(`fragmented`,`enabled`),e.removeAttribute(`disabled`)})),e.next&&this.controlsDown.forEach((e=>{e.classList.add(`fragmented`,`enabled`),e.removeAttribute(`disabled`)}))):(e.prev&&this.controlsLeft.forEach((e=>{e.classList.add(`fragmented`,`enabled`),e.removeAttribute(`disabled`)})),e.next&&this.controlsRight.forEach((e=>{e.classList.add(`fragmented`,`enabled`),e.removeAttribute(`disabled`)})))}if(this.Reveal.getConfig().controlsTutorial){let t=this.Reveal.getIndices();!this.Reveal.hasNavigatedVertically()&&e.down?this.controlsDownArrow.classList.add(`highlight`):(this.controlsDownArrow.classList.remove(`highlight`),this.Reveal.getConfig().rtl?!this.Reveal.hasNavigatedHorizontally()&&e.left&&t.v===0?this.controlsLeftArrow.classList.add(`highlight`):this.controlsLeftArrow.classList.remove(`highlight`):!this.Reveal.hasNavigatedHorizontally()&&e.right&&t.v===0?this.controlsRightArrow.classList.add(`highlight`):this.controlsRightArrow.classList.remove(`highlight`))}}destroy(){this.unbind(),this.element.remove()}onNavigateLeftClicked(e){e.preventDefault(),this.Reveal.onUserInput(),this.Reveal.getConfig().navigationMode===`linear`?this.Reveal.prev():this.Reveal.left()}onNavigateRightClicked(e){e.preventDefault(),this.Reveal.onUserInput(),this.Reveal.getConfig().navigationMode===`linear`?this.Reveal.next():this.Reveal.right()}onNavigateUpClicked(e){e.preventDefault(),this.Reveal.onUserInput(),this.Reveal.up()}onNavigateDownClicked(e){e.preventDefault(),this.Reveal.onUserInput(),this.Reveal.down()}onNavigatePrevClicked(e){e.preventDefault(),this.Reveal.onUserInput(),this.Reveal.prev()}onNavigateNextClicked(e){e.preventDefault(),this.Reveal.onUserInput(),this.Reveal.next()}onEnterFullscreen(e){let t=this.Reveal.getConfig(),n=this.Reveal.getViewportElement();S(t.embedded?n:n.parentElement)}},ge=class{constructor(e){this.Reveal=e,this.onProgressClicked=this.onProgressClicked.bind(this)}render(){this.element=document.createElement(`div`),this.element.className=`progress`,this.Reveal.getRevealElement().appendChild(this.element),this.bar=document.createElement(`span`),this.element.appendChild(this.bar)}configure(e,t){this.element.style.display=e.progress?`block`:`none`}bind(){this.Reveal.getConfig().progress&&this.element&&this.element.addEventListener(`click`,this.onProgressClicked,!1)}unbind(){this.Reveal.getConfig().progress&&this.element&&this.element.removeEventListener(`click`,this.onProgressClicked,!1)}update(){if(this.Reveal.getConfig().progress&&this.bar){let e=this.Reveal.getProgress();this.Reveal.getTotalSlides()<2&&(e=0),this.bar.style.transform=`scaleX(`+e+`)`}}getMaxWidth(){return this.Reveal.getRevealElement().offsetWidth}onProgressClicked(e){this.Reveal.onUserInput(e),e.preventDefault();let t=this.Reveal.getSlides(),n=t.length,r=Math.floor(e.clientX/this.getMaxWidth()*n);this.Reveal.getConfig().rtl&&(r=n-r);let i=this.Reveal.getIndices(t[r]);this.Reveal.slide(i.h,i.v)}destroy(){this.element.remove()}},_e=class{constructor(e){this.Reveal=e,this.lastMouseWheelStep=0,this.cursorHidden=!1,this.cursorInactiveTimeout=0,this.onDocumentCursorActive=this.onDocumentCursorActive.bind(this),this.onDocumentMouseScroll=this.onDocumentMouseScroll.bind(this)}configure(e,t){e.mouseWheel?document.addEventListener(`wheel`,this.onDocumentMouseScroll,!1):document.removeEventListener(`wheel`,this.onDocumentMouseScroll,!1),e.hideInactiveCursor?(document.addEventListener(`mousemove`,this.onDocumentCursorActive,!1),document.addEventListener(`mousedown`,this.onDocumentCursorActive,!1)):(this.showCursor(),document.removeEventListener(`mousemove`,this.onDocumentCursorActive,!1),document.removeEventListener(`mousedown`,this.onDocumentCursorActive,!1))}showCursor(){this.cursorHidden&&(this.cursorHidden=!1,this.Reveal.getRevealElement().style.cursor=``)}hideCursor(){!1===this.cursorHidden&&(this.cursorHidden=!0,this.Reveal.getRevealElement().style.cursor=`none`)}destroy(){this.showCursor(),document.removeEventListener(`wheel`,this.onDocumentMouseScroll,!1),document.removeEventListener(`mousemove`,this.onDocumentCursorActive,!1),document.removeEventListener(`mousedown`,this.onDocumentCursorActive,!1)}onDocumentCursorActive(e){this.showCursor(),clearTimeout(this.cursorInactiveTimeout),this.cursorInactiveTimeout=setTimeout(this.hideCursor.bind(this),this.Reveal.getConfig().hideCursorTime)}onDocumentMouseScroll(e){if(Date.now()-this.lastMouseWheelStep>1e3){this.lastMouseWheelStep=Date.now();let t=e.detail||-e.wheelDelta;t>0?this.Reveal.next():t<0&&this.Reveal.prev()}}},M=(e,t)=>{let n=document.createElement(`script`);n.type=`text/javascript`,n.async=!1,n.defer=!1,n.src=e,typeof t==`function`&&(n.onload=n.onreadystatechange=e=>{(e.type===`load`||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=n.onerror=null,t())},n.onerror=e=>{n.onload=n.onreadystatechange=n.onerror=null,t(Error(`Failed loading script: `+n.src+`
`+e))});let r=document.querySelector(`head`);r.insertBefore(n,r.lastChild)},ve=class{constructor(e){this.Reveal=e,this.state=`idle`,this.registeredPlugins={},this.asyncDependencies=[]}load(e,t){return this.state=`loading`,e.forEach(this.registerPlugin.bind(this)),new Promise((e=>{let n=[],r=0;if(t.forEach((e=>{e.condition&&!e.condition()||(e.async?this.asyncDependencies.push(e):n.push(e))})),n.length){r=n.length;let t=t=>{t&&typeof t.callback==`function`&&t.callback(),--r==0&&this.initPlugins().then(e)};n.forEach((e=>{typeof e.id==`string`?(this.registerPlugin(e),t(e)):typeof e.src==`string`?M(e.src,(()=>t(e))):(console.warn(`Unrecognized plugin format`,e),t())}))}else this.initPlugins().then(e)}))}initPlugins(){return new Promise((e=>{let t=Object.values(this.registeredPlugins),n=t.length;if(n===0)this.loadAsync().then(e);else{let r,i=()=>{--n==0?this.loadAsync().then(e):r()},a=0;r=()=>{let e=t[a++];if(typeof e.init==`function`){let t=e.init(this.Reveal);t&&typeof t.then==`function`?t.then(i):i()}else i()},r()}}))}loadAsync(){return this.state=`loaded`,this.asyncDependencies.length&&this.asyncDependencies.forEach((e=>{M(e.src,e.callback)})),Promise.resolve()}registerPlugin(e){arguments.length===2&&typeof arguments[0]==`string`?(e=arguments[1]).id=arguments[0]:typeof e==`function`&&(e=e());let t=e.id;typeof t==`string`?this.registeredPlugins[t]===void 0?(this.registeredPlugins[t]=e,this.state===`loaded`&&typeof e.init==`function`&&e.init(this.Reveal)):console.warn(`reveal.js: "`+t+`" plugin has already been registered`):console.warn(`Unrecognized plugin format; can't find plugin.id`,e)}hasPlugin(e){return!!this.registeredPlugins[e]}getPlugin(e){return this.registeredPlugins[e]}getRegisteredPlugins(){return this.registeredPlugins}destroy(){Object.values(this.registeredPlugins).forEach((e=>{typeof e.destroy==`function`&&e.destroy()})),this.registeredPlugins={},this.asyncDependencies=[]}},ye=class{constructor(e){this.Reveal=e,this.onSlidesClicked=this.onSlidesClicked.bind(this),this.iframeTriggerSelector=null,this.mediaTriggerSelector=`[data-preview-image], [data-preview-video]`,this.stateProps=[`previewIframe`,`previewImage`,`previewVideo`,`previewFit`],this.state={}}update(){this.Reveal.getConfig().previewLinks?this.iframeTriggerSelector=`a[href]:not([data-preview-link=false]), [data-preview-link]:not(a):not([data-preview-link=false])`:this.iframeTriggerSelector=`[data-preview-link]:not([data-preview-link=false])`;let e=this.Reveal.getSlidesElement().querySelectorAll(this.iframeTriggerSelector).length>0,t=this.Reveal.getSlidesElement().querySelectorAll(this.mediaTriggerSelector).length>0;e||t?this.Reveal.getSlidesElement().addEventListener(`click`,this.onSlidesClicked,!1):this.Reveal.getSlidesElement().removeEventListener(`click`,this.onSlidesClicked,!1)}createOverlay(e){this.dom=document.createElement(`div`),this.dom.classList.add(`r-overlay`),this.dom.classList.add(e),this.viewport=document.createElement(`div`),this.viewport.classList.add(`r-overlay-viewport`),this.dom.appendChild(this.viewport),this.Reveal.getRevealElement().appendChild(this.dom)}previewIframe(e){this.close(),this.state={previewIframe:e},this.createOverlay(`r-overlay-preview`),this.dom.dataset.state=`loading`,this.viewport.innerHTML=`<header class="r-overlay-header">\n\t\t\t\t<a class="r-overlay-button r-overlay-external" href="${e}" target="_blank"><span class="icon"></span></a>\n\t\t\t\t<button class="r-overlay-button r-overlay-close"><span class="icon"></span></button>\n\t\t\t</header>\n\t\t\t<div class="r-overlay-spinner"></div>\n\t\t\t<div class="r-overlay-content">\n\t\t\t\t<iframe src="${e}"></iframe>\n\t\t\t\t<small class="r-overlay-content-inner">\n\t\t\t\t\t<span class="r-overlay-error x-frame-error">Unable to load iframe. This is likely due to the site's policy (x-frame-options).</span>\n\t\t\t\t</small>\n\t\t\t</div>`,this.dom.querySelector(`iframe`).addEventListener(`load`,(e=>{this.dom.dataset.state=`loaded`}),!1),this.dom.querySelector(`.r-overlay-close`).addEventListener(`click`,(e=>{this.close(),e.preventDefault()}),!1),this.dom.querySelector(`.r-overlay-external`).addEventListener(`click`,(e=>{this.close()}),!1),this.Reveal.dispatchEvent({type:`previewiframe`,data:{url:e}})}previewMedia(e,t,n){if(t!==`image`&&t!==`video`)return void console.warn(`Please specify a valid media type to preview (image|video)`);this.close(),n||=`scale-down`,this.createOverlay(`r-overlay-preview`),this.dom.dataset.state=`loading`,this.dom.dataset.previewFit=n,this.viewport.innerHTML=`<header class="r-overlay-header">
				<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>
			</header>
			<div class="r-overlay-spinner"></div>
			<div class="r-overlay-content"></div>`;let r=this.dom.querySelector(`.r-overlay-content`);if(t===`image`){this.state={previewImage:e,previewFit:n};let t=document.createElement(`img`,{});t.src=e,r.appendChild(t),t.addEventListener(`load`,(()=>{this.dom.dataset.state=`loaded`}),!1),t.addEventListener(`error`,(()=>{this.dom.dataset.state=`error`,r.innerHTML=`<span class="r-overlay-error">Unable to load image.</span>`}),!1),this.dom.style.cursor=`zoom-out`,this.dom.addEventListener(`click`,(e=>{this.close()}),!1),this.Reveal.dispatchEvent({type:`previewimage`,data:{url:e}})}else{if(t!==`video`)throw Error(`Please specify a valid media type to preview`);{this.state={previewVideo:e,previewFit:n};let t=document.createElement(`video`);t.autoplay=this.dom.dataset.previewAutoplay!==`false`,t.controls=this.dom.dataset.previewControls!==`false`,t.loop=this.dom.dataset.previewLoop===`true`,t.muted=this.dom.dataset.previewMuted===`true`,t.playsInline=!0,t.src=e,r.appendChild(t),t.addEventListener(`loadeddata`,(()=>{this.dom.dataset.state=`loaded`}),!1),t.addEventListener(`error`,(()=>{this.dom.dataset.state=`error`,r.innerHTML=`<span class="r-overlay-error">Unable to load video.</span>`}),!1),this.Reveal.dispatchEvent({type:`previewvideo`,data:{url:e}})}}this.dom.querySelector(`.r-overlay-close`).addEventListener(`click`,(e=>{this.close(),e.preventDefault()}),!1)}previewImage(e,t){this.previewMedia(e,`image`,t)}previewVideo(e,t){this.previewMedia(e,`video`,t)}toggleHelp(e){typeof e==`boolean`?e?this.showHelp():this.close():this.dom?this.close():this.showHelp()}showHelp(){if(this.Reveal.getConfig().help){this.close(),this.createOverlay(`r-overlay-help`);let e=`<p class="title">Keyboard Shortcuts</p>`,t=this.Reveal.keyboard.getShortcuts(),n=this.Reveal.keyboard.getBindings();e+=`<table><th>KEY</th><th>ACTION</th>`;for(let n in t)e+=`<tr><td>${n}</td><td>${t[n]}</td></tr>`;for(let t in n)n[t].key&&n[t].description&&(e+=`<tr><td>${n[t].key}</td><td>${n[t].description}</td></tr>`);e+=`</table>`,this.viewport.innerHTML=`\n\t\t\t\t<header class="r-overlay-header">\n\t\t\t\t\t<button class="r-overlay-button r-overlay-close">Esc <span class="icon"></span></button>\n\t\t\t\t</header>\n\t\t\t\t<div class="r-overlay-content">\n\t\t\t\t\t<div class="r-overlay-help-content">${e}</div>\n\t\t\t\t</div>\n\t\t\t`,this.dom.querySelector(`.r-overlay-close`).addEventListener(`click`,(e=>{this.close(),e.preventDefault()}),!1),this.Reveal.dispatchEvent({type:`showhelp`})}}isOpen(){return!!this.dom}close(){return!!this.dom&&(this.dom.remove(),this.dom=null,this.state={},this.Reveal.dispatchEvent({type:`closeoverlay`}),!0)}getState(){return this.state}setState(e){this.stateProps.every((t=>this.state[t]===e[t]))||(e.previewIframe?this.previewIframe(e.previewIframe):e.previewImage?this.previewImage(e.previewImage,e.previewFit):e.previewVideo?this.previewVideo(e.previewVideo,e.previewFit):this.close())}onSlidesClicked(e){let t=e.target,n=t.closest(this.iframeTriggerSelector),r=t.closest(this.mediaTriggerSelector);if(n){if(e.metaKey||e.shiftKey||e.altKey)return;let t=n.getAttribute(`href`)||n.getAttribute(`data-preview-link`);t&&(this.previewIframe(t),e.preventDefault())}else if(r){if(r.hasAttribute(`data-preview-image`)){let t=r.dataset.previewImage||r.getAttribute(`src`);t&&(this.previewImage(t,r.dataset.previewFit),e.preventDefault())}else if(r.hasAttribute(`data-preview-video`)){let t=r.dataset.previewVideo||r.getAttribute(`src`);if(!t){let e=r.querySelector(`source`);e&&(t=e.getAttribute(`src`))}t&&(this.previewVideo(t,r.dataset.previewFit),e.preventDefault())}}}destroy(){this.close()}},be=class{constructor(e){this.Reveal=e,this.touchStartX=0,this.touchStartY=0,this.touchStartCount=0,this.touchCaptured=!1,this.onPointerDown=this.onPointerDown.bind(this),this.onPointerMove=this.onPointerMove.bind(this),this.onPointerUp=this.onPointerUp.bind(this),this.onTouchStart=this.onTouchStart.bind(this),this.onTouchMove=this.onTouchMove.bind(this),this.onTouchEnd=this.onTouchEnd.bind(this)}bind(){let e=this.Reveal.getRevealElement();`onpointerdown`in window?(e.addEventListener(`pointerdown`,this.onPointerDown,!1),e.addEventListener(`pointermove`,this.onPointerMove,!1),e.addEventListener(`pointerup`,this.onPointerUp,!1)):window.navigator.msPointerEnabled?(e.addEventListener(`MSPointerDown`,this.onPointerDown,!1),e.addEventListener(`MSPointerMove`,this.onPointerMove,!1),e.addEventListener(`MSPointerUp`,this.onPointerUp,!1)):(e.addEventListener(`touchstart`,this.onTouchStart,!1),e.addEventListener(`touchmove`,this.onTouchMove,!1),e.addEventListener(`touchend`,this.onTouchEnd,!1))}unbind(){let e=this.Reveal.getRevealElement();e.removeEventListener(`pointerdown`,this.onPointerDown,!1),e.removeEventListener(`pointermove`,this.onPointerMove,!1),e.removeEventListener(`pointerup`,this.onPointerUp,!1),e.removeEventListener(`MSPointerDown`,this.onPointerDown,!1),e.removeEventListener(`MSPointerMove`,this.onPointerMove,!1),e.removeEventListener(`MSPointerUp`,this.onPointerUp,!1),e.removeEventListener(`touchstart`,this.onTouchStart,!1),e.removeEventListener(`touchmove`,this.onTouchMove,!1),e.removeEventListener(`touchend`,this.onTouchEnd,!1)}isSwipePrevented(e){if(b(e,`video[controls], audio[controls]`))return!0;for(;e&&typeof e.hasAttribute==`function`;){if(e.hasAttribute(`data-prevent-swipe`))return!0;e=e.parentNode}return!1}onTouchStart(e){if(this.touchCaptured=!1,this.isSwipePrevented(e.target))return!0;this.touchStartX=e.touches[0].clientX,this.touchStartY=e.touches[0].clientY,this.touchStartCount=e.touches.length}onTouchMove(e){if(this.isSwipePrevented(e.target))return!0;let t=this.Reveal.getConfig();if(this.touchCaptured)E&&e.preventDefault();else{this.Reveal.onUserInput(e);let n=e.touches[0].clientX,r=e.touches[0].clientY;if(e.touches.length===1&&this.touchStartCount!==2){let i=this.Reveal.availableRoutes({includeFragments:!0}),a=n-this.touchStartX,o=r-this.touchStartY;a>40&&Math.abs(a)>Math.abs(o)?(this.touchCaptured=!0,t.navigationMode===`linear`?t.rtl?this.Reveal.next():this.Reveal.prev():this.Reveal.left()):a<-40&&Math.abs(a)>Math.abs(o)?(this.touchCaptured=!0,t.navigationMode===`linear`?t.rtl?this.Reveal.prev():this.Reveal.next():this.Reveal.right()):o>40&&i.up?(this.touchCaptured=!0,t.navigationMode===`linear`?this.Reveal.prev():this.Reveal.up()):o<-40&&i.down&&(this.touchCaptured=!0,t.navigationMode===`linear`?this.Reveal.next():this.Reveal.down()),t.embedded?(this.touchCaptured||this.Reveal.isVerticalSlide())&&e.preventDefault():e.preventDefault()}}}onTouchEnd(e){this.touchCaptured=!1}onPointerDown(e){e.pointerType!==e.MSPOINTER_TYPE_TOUCH&&e.pointerType!==`touch`||(e.touches=[{clientX:e.clientX,clientY:e.clientY}],this.onTouchStart(e))}onPointerMove(e){e.pointerType!==e.MSPOINTER_TYPE_TOUCH&&e.pointerType!==`touch`||(e.touches=[{clientX:e.clientX,clientY:e.clientY}],this.onTouchMove(e))}onPointerUp(e){e.pointerType!==e.MSPOINTER_TYPE_TOUCH&&e.pointerType!==`touch`||(e.touches=[{clientX:e.clientX,clientY:e.clientY}],this.onTouchEnd(e))}},N=`focus`,P=`blur`,xe=class{constructor(e){this.Reveal=e,this.onRevealPointerDown=this.onRevealPointerDown.bind(this),this.onDocumentPointerDown=this.onDocumentPointerDown.bind(this)}configure(e,t){e.embedded?this.blur():(this.focus(),this.unbind())}bind(){this.Reveal.getConfig().embedded&&this.Reveal.getRevealElement().addEventListener(`pointerdown`,this.onRevealPointerDown,!1)}unbind(){this.Reveal.getRevealElement().removeEventListener(`pointerdown`,this.onRevealPointerDown,!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!1)}focus(){this.state!==N&&(this.Reveal.getRevealElement().classList.add(`focused`),document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!1)),this.state=N}blur(){this.state!==P&&(this.Reveal.getRevealElement().classList.remove(`focused`),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!1)),this.state=P}isFocused(){return this.state===N}destroy(){this.Reveal.getRevealElement().classList.remove(`focused`)}onRevealPointerDown(e){this.focus()}onDocumentPointerDown(e){let t=x(e.target,`.reveal`);t&&t===this.Reveal.getRevealElement()||this.blur()}},Se=class{constructor(e){this.Reveal=e}render(){this.element=document.createElement(`div`),this.element.className=`speaker-notes`,this.element.setAttribute(`data-prevent-swipe`,``),this.element.setAttribute(`tabindex`,`0`),this.Reveal.getRevealElement().appendChild(this.element)}configure(e,t){e.showNotes&&this.element.setAttribute(`data-layout`,typeof e.showNotes==`string`?e.showNotes:`inline`)}update(){this.Reveal.getConfig().showNotes&&this.element&&this.Reveal.getCurrentSlide()&&!this.Reveal.isScrollView()&&!this.Reveal.isPrintView()&&(this.element.innerHTML=this.getSlideNotes()||`<span class="notes-placeholder">No notes on this slide.</span>`)}updateVisibility(){this.Reveal.getConfig().showNotes&&this.hasNotes()&&!this.Reveal.isScrollView()&&!this.Reveal.isPrintView()?this.Reveal.getRevealElement().classList.add(`show-notes`):this.Reveal.getRevealElement().classList.remove(`show-notes`)}hasNotes(){return this.Reveal.getSlidesElement().querySelectorAll(`[data-notes], aside.notes`).length>0}isSpeakerNotesWindow(){return!!window.location.search.match(/receiver/gi)}getSlideNotes(e=this.Reveal.getCurrentSlide()){if(e.hasAttribute(`data-notes`))return e.getAttribute(`data-notes`);let t=e.querySelectorAll(`aside.notes`);return t?Array.from(t).map((e=>e.innerHTML)).join(`
`):null}destroy(){this.element.remove()}},Ce=class{constructor(e,t){this.diameter=100,this.diameter2=this.diameter/2,this.thickness=6,this.playing=!1,this.progress=0,this.progressOffset=1,this.container=e,this.progressCheck=t,this.canvas=document.createElement(`canvas`),this.canvas.className=`playback`,this.canvas.width=this.diameter,this.canvas.height=this.diameter,this.canvas.style.width=this.diameter2+`px`,this.canvas.style.height=this.diameter2+`px`,this.context=this.canvas.getContext(`2d`),this.container.appendChild(this.canvas),this.render()}setPlaying(e){let t=this.playing;this.playing=e,!t&&this.playing?this.animate():this.render()}animate(){let e=this.progress;this.progress=this.progressCheck(),e>.8&&this.progress<.2&&(this.progressOffset=this.progress),this.render(),this.playing&&requestAnimationFrame(this.animate.bind(this))}render(){let e=this.playing?this.progress:0,t=this.diameter2-this.thickness,n=this.diameter2,r=this.diameter2;this.progressOffset+=.1*(1-this.progressOffset);let i=-Math.PI/2+2*Math.PI*e,a=-Math.PI/2+this.progressOffset*(2*Math.PI);this.context.save(),this.context.clearRect(0,0,this.diameter,this.diameter),this.context.beginPath(),this.context.arc(n,r,t+4,0,2*Math.PI,!1),this.context.fillStyle=`rgba( 0, 0, 0, 0.4 )`,this.context.fill(),this.context.beginPath(),this.context.arc(n,r,t,0,2*Math.PI,!1),this.context.lineWidth=this.thickness,this.context.strokeStyle=`rgba( 255, 255, 255, 0.2 )`,this.context.stroke(),this.playing&&(this.context.beginPath(),this.context.arc(n,r,t,a,i,!1),this.context.lineWidth=this.thickness,this.context.strokeStyle=`#fff`,this.context.stroke()),this.context.translate(n-14,r-14),this.playing?(this.context.fillStyle=`#fff`,this.context.fillRect(0,0,10,28),this.context.fillRect(18,0,10,28)):(this.context.beginPath(),this.context.translate(4,0),this.context.moveTo(0,0),this.context.lineTo(24,14),this.context.lineTo(0,28),this.context.fillStyle=`#fff`,this.context.fill()),this.context.restore()}on(e,t){this.canvas.addEventListener(e,t,!1)}off(e,t){this.canvas.removeEventListener(e,t,!1)}destroy(){this.playing=!1,this.canvas.parentNode&&this.container.removeChild(this.canvas)}},we={width:960,height:700,margin:.04,minScale:.2,maxScale:2,controls:!0,controlsTutorial:!0,controlsLayout:`bottom-right`,controlsBackArrows:`faded`,progress:!0,slideNumber:!1,showSlideNumber:`all`,hashOneBasedIndex:!1,hash:!1,respondToHashChanges:!0,jumpToSlide:!0,history:!1,keyboard:!0,keyboardCondition:null,disableLayout:!1,overview:!0,center:!0,touch:!0,loop:!1,rtl:!1,navigationMode:`default`,shuffle:!1,fragments:!0,fragmentInURL:!0,embedded:!1,help:!0,pause:!0,showNotes:!1,showHiddenSlides:!1,autoPlayMedia:null,preloadIframes:null,autoAnimate:!0,autoAnimateMatcher:null,autoAnimateEasing:`ease`,autoAnimateDuration:1,autoAnimateUnmatched:!0,autoAnimateStyles:[`opacity`,`color`,`background-color`,`padding`,`font-size`,`line-height`,`letter-spacing`,`border-width`,`border-color`,`border-radius`,`outline`,`outline-offset`],autoSlide:0,autoSlideStoppable:!0,autoSlideMethod:null,defaultTiming:null,mouseWheel:!1,previewLinks:!1,postMessage:!0,postMessageEvents:!1,focusBodyOnPageVisibilityChange:!0,transition:`slide`,transitionSpeed:`default`,backgroundTransition:`fade`,parallaxBackgroundImage:``,parallaxBackgroundSize:``,parallaxBackgroundRepeat:``,parallaxBackgroundPosition:``,parallaxBackgroundHorizontal:null,parallaxBackgroundVertical:null,view:null,scrollLayout:`full`,scrollSnap:`mandatory`,scrollProgress:`auto`,scrollActivationWidth:435,pdfMaxPagesPerSlide:1/0,pdfSeparateFragments:!0,pdfPageHeightOffset:-1,viewDistance:3,mobileViewDistance:2,display:`block`,hideInactiveCursor:!0,hideCursorTime:5e3,sortFragmentsOnSync:!0,dependencies:[],plugins:[]},Te=`5.2.1`;function F(e,t){arguments.length<2&&(t=arguments[0],e=document.querySelector(`.reveal`));let n={},r,i,a,o,s,c={},l=!1,u=!1,d={hasNavigatedHorizontally:!1,hasNavigatedVertically:!1},f=[],p=1,m={layout:``,overview:``},b={},S=`idle`,C=0,w=0,te=-1,E=!1,D=new ne(n),A=new ae(n),j=new oe(n),M=new ce(n),N=new se(n),P=new le(n),F=new ue(n),I=new de(n),L=new fe(n),R=new pe(n),z=new me(n),B=new he(n),V=new ge(n),Ee=new _e(n),H=new ve(n),U=new ye(n),W=new xe(n),De=new be(n),G=new Se(n);function Oe(){!1!==l&&(u=!0,c.showHiddenSlides||g(b.wrapper,`section[data-visibility="hidden"]`).forEach((e=>{let t=e.parentNode;t.childElementCount===1&&/section/i.test(t.nodeName)?t.remove():e.remove()})),function(){b.slides.classList.add(`no-transition`),T?b.wrapper.classList.add(`no-hover`):b.wrapper.classList.remove(`no-hover`),N.render(),A.render(),j.render(),B.render(),V.render(),G.render(),b.pauseOverlay=((e,t,n,r=``)=>{let i=e.querySelectorAll(`.`+n);for(let t=0;t<i.length;t++){let n=i[t];if(n.parentNode===e)return n}let a=document.createElement(t);return a.className=n,a.innerHTML=r,e.appendChild(a),a})(b.wrapper,`div`,`pause-overlay`,c.controls?`<button class="resume-button">Resume presentation</button>`:null),b.statusElement=function(){let e=b.wrapper.querySelector(`.aria-status`);return e||(e=document.createElement(`div`),e.style.position=`absolute`,e.style.height=`1px`,e.style.width=`1px`,e.style.overflow=`hidden`,e.style.clip=`rect( 1px, 1px, 1px, 1px )`,e.classList.add(`aria-status`),e.setAttribute(`aria-live`,`polite`),e.setAttribute(`aria-atomic`,`true`),b.wrapper.appendChild(e)),e}(),b.wrapper.setAttribute(`role`,`application`)}(),c.postMessage&&window.addEventListener(`message`,bt,!1),setInterval((()=>{(!P.isActive()&&b.wrapper.scrollTop!==0||b.wrapper.scrollLeft!==0)&&(b.wrapper.scrollTop=0,b.wrapper.scrollLeft=0)}),1e3),document.addEventListener(`fullscreenchange`,Tt),document.addEventListener(`webkitfullscreenchange`,Tt),Q().forEach((e=>{g(e,`section`).forEach(((e,t)=>{t>0&&(e.classList.remove(`present`),e.classList.remove(`past`),e.classList.add(`future`),e.setAttribute(`aria-hidden`,`true`))}))})),je(),N.update(!0),function(){let e=c.view===`print`,t=c.view===`scroll`||c.view===`reader`;(e||t)&&(e?Ne():De.unbind(),b.viewport.classList.add(`loading-scroll-mode`),e?document.readyState===`complete`?F.activate():window.addEventListener(`load`,(()=>F.activate())):P.activate())}(),z.readURL(),setTimeout((()=>{b.slides.classList.remove(`no-transition`),b.wrapper.classList.add(`ready`),K({type:`ready`,data:{indexh:r,indexv:i,currentSlide:o}})}),1))}function ke(e){b.statusElement.textContent=e}function Ae(e){let t=``;if(e.nodeType===3)t+=e.textContent;else if(e.nodeType===1){let n=e.getAttribute(`aria-hidden`),r=window.getComputedStyle(e).display===`none`;n===`true`||r||Array.from(e.childNodes).forEach((e=>{t+=Ae(e)}))}return t=t.trim(),t===``?``:t+` `}function je(e){let t={...c};if(typeof e==`object`&&h(c,e),!1===n.isReady())return;let r=b.wrapper.querySelectorAll(O).length;b.wrapper.classList.remove(t.transition),b.wrapper.classList.add(c.transition),b.wrapper.setAttribute(`data-transition-speed`,c.transitionSpeed),b.wrapper.setAttribute(`data-background-transition`,c.backgroundTransition),b.viewport.style.setProperty(`--slide-width`,typeof c.width==`string`?c.width:c.width+`px`),b.viewport.style.setProperty(`--slide-height`,typeof c.height==`string`?c.height:c.height+`px`),c.shuffle&&Ze(),_(b.wrapper,`embedded`,c.embedded),_(b.wrapper,`rtl`,c.rtl),_(b.wrapper,`center`,c.center),!1===c.pause&&Y(),M.reset(),s&&=(s.destroy(),null),r>1&&c.autoSlide&&c.autoSlideStoppable&&(s=new Ce(b.wrapper,(()=>Math.min(Math.max((Date.now()-te)/C,0),1))),s.on(`click`,Et),E=!1),c.navigationMode===`default`?b.wrapper.removeAttribute(`data-navigation-mode`):b.wrapper.setAttribute(`data-navigation-mode`,c.navigationMode),G.configure(c,t),W.configure(c,t),Ee.configure(c,t),B.configure(c,t),V.configure(c,t),R.configure(c,t),I.configure(c,t),A.configure(c,t),Xe()}function Me(){window.addEventListener(`resize`,Ct,!1),c.touch&&De.bind(),c.keyboard&&R.bind(),c.progress&&V.bind(),c.respondToHashChanges&&z.bind(),B.bind(),W.bind(),b.slides.addEventListener(`click`,St,!1),b.slides.addEventListener(`transitionend`,xt,!1),b.pauseOverlay.addEventListener(`click`,Y,!1),c.focusBodyOnPageVisibilityChange&&document.addEventListener(`visibilitychange`,wt,!1)}function Ne(){De.unbind(),W.unbind(),R.unbind(),B.unbind(),V.unbind(),z.unbind(),window.removeEventListener(`resize`,Ct,!1),b.slides.removeEventListener(`click`,St,!1),b.slides.removeEventListener(`transitionend`,xt,!1),b.pauseOverlay.removeEventListener(`click`,Y,!1)}function Pe(t,n,r){e.addEventListener(t,n,r)}function Fe(t,n,r){e.removeEventListener(t,n,r)}function Ie(e){typeof e.layout==`string`&&(m.layout=e.layout),typeof e.overview==`string`&&(m.overview=e.overview),m.layout?y(b.slides,m.layout+` `+m.overview):y(b.slides,m.overview)}function K({target:e=b.wrapper,type:t,data:n,bubbles:r=!0}){let i=document.createEvent(`HTMLEvents`,1,2);return i.initEvent(t,r,!0),h(i,n),e.dispatchEvent(i),e===b.wrapper&&Re(t),i}function Le(e){K({type:`slidechanged`,data:{indexh:r,indexv:i,previousSlide:a,currentSlide:o,origin:e}})}function Re(e,t){if(c.postMessageEvents&&window.parent!==window.self){let n={namespace:`reveal`,eventName:e,state:ut()};h(n,t),window.parent.postMessage(JSON.stringify(n),`*`)}}function q(){if(b.wrapper&&!F.isActive()){let e=b.viewport.offsetWidth,t=b.viewport.offsetHeight;if(!c.disableLayout){T&&!c.embedded&&document.documentElement.style.setProperty(`--vh`,.01*window.innerHeight+`px`);let n=P.isActive()?Be(e,t):Be(),r=p;ze(c.width,c.height),b.slides.style.width=n.width+`px`,b.slides.style.height=n.height+`px`,p=Math.min(n.presentationWidth/n.width,n.presentationHeight/n.height),p=Math.max(p,c.minScale),p=Math.min(p,c.maxScale),p===1||P.isActive()?(b.slides.style.zoom=``,b.slides.style.left=``,b.slides.style.top=``,b.slides.style.bottom=``,b.slides.style.right=``,Ie({layout:``})):(b.slides.style.zoom=``,b.slides.style.left=`50%`,b.slides.style.top=`50%`,b.slides.style.bottom=`auto`,b.slides.style.right=`auto`,Ie({layout:`translate(-50%, -50%) scale(`+p+`)`}));let i=Array.from(b.wrapper.querySelectorAll(O));for(let e=0,t=i.length;e<t;e++){let t=i[e];t.style.display!==`none`&&(c.center||t.classList.contains(`center`)?t.classList.contains(`stack`)?t.style.top=0:t.style.top=Math.max((n.height-t.scrollHeight)/2,0)+`px`:t.style.top=``)}r!==p&&K({type:`resize`,data:{oldScale:r,scale:p,size:n}})}(function(){if(b.wrapper&&!c.disableLayout&&!F.isActive()&&typeof c.scrollActivationWidth==`number`&&c.view!==`scroll`){let e=Be();e.presentationWidth>0&&e.presentationWidth<=c.scrollActivationWidth?P.isActive()||(N.create(),P.activate()):P.isActive()&&P.deactivate()}})(),b.viewport.style.setProperty(`--slide-scale`,p),b.viewport.style.setProperty(`--viewport-width`,e+`px`),b.viewport.style.setProperty(`--viewport-height`,t+`px`),P.layout(),V.update(),N.updateParallax(),L.isActive()&&L.update()}}function ze(e,t){g(b.slides,`section > .stretch, section > .r-stretch`).forEach((n=>{let r=((e,t=0)=>{if(e){let n,r=e.style.height;return e.style.height=`0px`,e.parentNode.style.height=`auto`,n=t-e.parentNode.offsetHeight,e.style.height=r+`px`,e.parentNode.style.removeProperty(`height`),n}return t})(n,t);if(/(img|video)/gi.test(n.nodeName)){let t=n.naturalWidth||n.videoWidth,i=n.naturalHeight||n.videoHeight,a=Math.min(e/t,r/i);n.style.width=t*a+`px`,n.style.height=i*a+`px`}else n.style.width=e+`px`,n.style.height=r+`px`}))}function Be(e,t){let n=c.width,r=c.height;c.disableLayout&&(n=b.slides.offsetWidth,r=b.slides.offsetHeight);let i={width:n,height:r,presentationWidth:e||b.wrapper.offsetWidth,presentationHeight:t||b.wrapper.offsetHeight};return i.presentationWidth-=i.presentationWidth*c.margin,i.presentationHeight-=i.presentationHeight*c.margin,typeof i.width==`string`&&/%$/.test(i.width)&&(i.width=parseInt(i.width,10)/100*i.presentationWidth),typeof i.height==`string`&&/%$/.test(i.height)&&(i.height=parseInt(i.height,10)/100*i.presentationHeight),i}function Ve(e,t){typeof e==`object`&&typeof e.setAttribute==`function`&&e.setAttribute(`data-previous-indexv`,t||0)}function He(e){if(typeof e==`object`&&typeof e.setAttribute==`function`&&e.classList.contains(`stack`)){let t=e.hasAttribute(`data-start-indexv`)?`data-start-indexv`:`data-previous-indexv`;return parseInt(e.getAttribute(t)||0,10)}return 0}function J(e=o){return e&&e.parentNode&&!!e.parentNode.nodeName.match(/section/i)}function Ue(){return!(!o||!J(o))&&!o.nextElementSibling}function We(){return r===0&&i===0}function Ge(){return!!o&&!o.nextElementSibling&&(!J(o)||!o.parentNode.nextElementSibling)}function Ke(){if(c.pause){let e=b.wrapper.classList.contains(`paused`);dt(),b.wrapper.classList.add(`paused`),!1===e&&K({type:`paused`})}}function Y(){let e=b.wrapper.classList.contains(`paused`);b.wrapper.classList.remove(`paused`),$(),e&&K({type:`resumed`})}function qe(e){typeof e==`boolean`?e?Ke():Y():Je()?Y():Ke()}function Je(){return b.wrapper.classList.contains(`paused`)}function X(t,n,s,l){if(K({type:`beforeslidechange`,data:{indexh:t===void 0?r:t,indexv:n===void 0?i:n,origin:l}}).defaultPrevented)return;a=o;let u=b.wrapper.querySelectorAll(k);if(P.isActive()){let e=P.getSlideByIndices(t,n);e&&P.scrollToSlide(e);return}if(u.length===0)return;n!==void 0||L.isActive()||(n=He(u[t])),a&&a.parentNode&&a.parentNode.classList.contains(`stack`)&&Ve(a.parentNode,i);let d=f.concat();f.length=0;let p=r||0,m=i||0;r=Qe(k,t===void 0?r:t),i=Qe(re,n===void 0?i:n);let h=r!==p||i!==m;h||(a=null);let _=u[r],v=_.querySelectorAll(`section`);e.classList.toggle(`is-vertical-slide`,v.length>1),o=v[i]||_;let y=!1;h&&a&&o&&!L.isActive()&&(S=`running`,y=Ye(a,o,p,m),y&&b.slides.classList.add(`disable-slide-transitions`)),tt(),q(),L.isActive()&&L.update(),s!==void 0&&I.goto(s),a&&a!==o&&(a.classList.remove(`present`),a.setAttribute(`aria-hidden`,`true`),We()&&setTimeout((()=>{g(b.wrapper,k+`.stack`).forEach((e=>{Ve(e,0)}))}),0));e:for(let e=0,t=f.length;e<t;e++){for(let t=0;t<d.length;t++)if(d[t]===f[e]){d.splice(t,1);continue e}b.viewport.classList.add(f[e]),K({type:f[e]})}for(;d.length;)b.viewport.classList.remove(d.pop());h&&Le(l),!h&&a||(D.stopEmbeddedContent(a),D.startEmbeddedContent(o)),requestAnimationFrame((()=>{ke(Ae(o))})),V.update(),B.update(),G.update(),N.update(),N.updateParallax(),A.update(),I.update(),z.writeURL(),$(),y&&(setTimeout((()=>{b.slides.classList.remove(`disable-slide-transitions`)}),0),c.autoAnimate&&M.run(a,o))}function Ye(e,t,n,a){return e.hasAttribute(`data-auto-animate`)&&t.hasAttribute(`data-auto-animate`)&&e.getAttribute(`data-auto-animate-id`)===t.getAttribute(`data-auto-animate-id`)&&!(r>n||i>a?t:e).hasAttribute(`data-auto-animate-restart`)}function Xe(){Ne(),Me(),q(),C=c.autoSlide,$(),N.create(),z.writeURL(),!0===c.sortFragmentsOnSync&&I.sortAll(),B.update(),V.update(),tt(),G.update(),G.updateVisibility(),U.update(),N.update(!0),A.update(),D.formatEmbeddedContent(),!1===c.autoPlayMedia?D.stopEmbeddedContent(o,{unloadIframes:!1}):D.startEmbeddedContent(o),L.isActive()&&L.layout()}function Ze(e=Q()){e.forEach(((t,n)=>{let r=e[Math.floor(Math.random()*e.length)];r.parentNode===t.parentNode&&t.parentNode.insertBefore(t,r);let i=t.querySelectorAll(`section`);i.length&&Ze(i)}))}function Qe(e,t){let n=g(b.wrapper,e),r=n.length,i=P.isActive()||F.isActive(),a=!1,o=!1;if(r){c.loop&&(t>=r&&(a=!0),(t%=r)<0&&(t=r+t,o=!0)),t=Math.max(Math.min(t,r-1),0);for(let e=0;e<r;e++){let r=n[e],s=c.rtl&&!J(r);r.classList.remove(`past`),r.classList.remove(`present`),r.classList.remove(`future`),r.setAttribute(`hidden`,``),r.setAttribute(`aria-hidden`,`true`),r.querySelector(`section`)&&r.classList.add(`stack`),i?r.classList.add(`present`):e<t?(r.classList.add(s?`future`:`past`),c.fragments&&$e(r)):e>t?(r.classList.add(s?`past`:`future`),c.fragments&&et(r)):e===t&&c.fragments&&(a?et(r):o&&$e(r))}let e=n[t],s=e.classList.contains(`present`);e.classList.add(`present`),e.removeAttribute(`hidden`),e.removeAttribute(`aria-hidden`),s||K({target:e,type:`visible`,bubbles:!1});let l=e.getAttribute(`data-state`);l&&(f=f.concat(l.split(` `)))}else t=0;return t}function $e(e){g(e,`.fragment`).forEach((e=>{e.classList.add(`visible`),e.classList.remove(`current-fragment`)}))}function et(e){g(e,`.fragment.visible`).forEach((e=>{e.classList.remove(`visible`,`current-fragment`)}))}function tt(){let e,t,n=Q(),a=n.length;if(a&&r!==void 0){let o=L.isActive()?10:c.viewDistance;T&&(o=L.isActive()?6:c.mobileViewDistance),F.isActive()&&(o=Number.MAX_VALUE);for(let s=0;s<a;s++){let l=n[s],u=g(l,`section`),d=u.length;if(e=Math.abs((r||0)-s)||0,c.loop&&(e=Math.abs(((r||0)-s)%(a-o))||0),e<o?D.load(l):D.unload(l),d){let n=He(l);for(let a=0;a<d;a++){let c=u[a];t=Math.abs(s===(r||0)?(i||0)-a:a-n),e+t<o?D.load(c):D.unload(c)}}}st()?b.wrapper.classList.add(`has-vertical-slides`):b.wrapper.classList.remove(`has-vertical-slides`),ot()?b.wrapper.classList.add(`has-horizontal-slides`):b.wrapper.classList.remove(`has-horizontal-slides`)}}function Z({includeFragments:e=!1}={}){let t=b.wrapper.querySelectorAll(k),n=b.wrapper.querySelectorAll(re),a={left:r>0,right:r<t.length-1,up:i>0,down:i<n.length-1};if(c.loop&&(t.length>1&&(a.left=!0,a.right=!0),n.length>1&&(a.up=!0,a.down=!0)),t.length>1&&c.navigationMode===`linear`&&(a.right=a.right||a.down,a.left=a.left||a.up),!0===e){let e=I.availableRoutes();a.left=a.left||e.prev,a.up=a.up||e.prev,a.down=a.down||e.next,a.right=a.right||e.next}if(c.rtl){let e=a.left;a.left=a.right,a.right=e}return a}function nt(e=o){let t=Q(),n=0;e:for(let r=0;r<t.length;r++){let i=t[r],a=i.querySelectorAll(`section`);for(let t=0;t<a.length;t++){if(a[t]===e)break e;a[t].dataset.visibility!==`uncounted`&&n++}if(i===e)break;!1===i.classList.contains(`stack`)&&i.dataset.visibility!==`uncounted`&&n++}return n}function rt(e){let t,n=r,a=i;if(e)if(P.isActive())n=parseInt(e.getAttribute(`data-index-h`),10),e.getAttribute(`data-index-v`)&&(a=parseInt(e.getAttribute(`data-index-v`),10));else{let t=J(e),r=t?e.parentNode:e,i=Q();n=Math.max(i.indexOf(r),0),a=void 0,t&&(a=Math.max(g(e.parentNode,`section`).indexOf(e),0))}if(!e&&o&&o.querySelectorAll(`.fragment`).length>0){let e=o.querySelector(`.current-fragment`);t=e&&e.hasAttribute(`data-fragment-index`)?parseInt(e.getAttribute(`data-fragment-index`),10):o.querySelectorAll(`.fragment.visible`).length-1}return{h:n,v:a,f:t}}function it(){return g(b.wrapper,O+`:not(.stack):not([data-visibility="uncounted"])`)}function Q(){return g(b.wrapper,k)}function at(){return g(b.wrapper,`.slides>section>section`)}function ot(){return Q().length>1}function st(){return at().length>1}function ct(){return it().length}function lt(e,t){let n=Q()[e],r=n&&n.querySelectorAll(`section`);return r&&r.length&&typeof t==`number`?r?r[t]:void 0:n}function ut(){let e=rt();return{indexh:e.h,indexv:e.v,indexf:e.f,paused:Je(),overview:L.isActive(),...U.getState()}}function $(){if(dt(),o&&!1!==c.autoSlide){let e=o.querySelector(`.current-fragment[data-autoslide]`),t=e?e.getAttribute(`data-autoslide`):null,n=o.parentNode?o.parentNode.getAttribute(`data-autoslide`):null,r=o.getAttribute(`data-autoslide`);t?C=parseInt(t,10):r?C=parseInt(r,10):n?C=parseInt(n,10):(C=c.autoSlide,o.querySelectorAll(`.fragment`).length===0&&g(o,`video, audio`).forEach((e=>{e.hasAttribute(`data-autoplay`)&&C&&1e3*e.duration/e.playbackRate>C&&(C=1e3*e.duration/e.playbackRate+1e3)}))),!C||E||Je()||L.isActive()||Ge()&&!I.availableRoutes().next&&!0!==c.loop||(w=setTimeout((()=>{typeof c.autoSlideMethod==`function`?c.autoSlideMethod():yt(),$()}),C),te=Date.now()),s&&s.setPlaying(w!==-1)}}function dt(){clearTimeout(w),w=-1}function ft(){C&&!E&&(E=!0,K({type:`autoslidepaused`}),clearTimeout(w),s&&s.setPlaying(!1))}function pt(){C&&E&&(E=!1,K({type:`autoslideresumed`}),$())}function mt({skipFragments:e=!1}={}){if(d.hasNavigatedHorizontally=!0,P.isActive())return P.prev();c.rtl?(L.isActive()||e||!1===I.next())&&Z().left&&X(r+1,c.navigationMode===`grid`?i:void 0):(L.isActive()||e||!1===I.prev())&&Z().left&&X(r-1,c.navigationMode===`grid`?i:void 0)}function ht({skipFragments:e=!1}={}){if(d.hasNavigatedHorizontally=!0,P.isActive())return P.next();c.rtl?(L.isActive()||e||!1===I.prev())&&Z().right&&X(r-1,c.navigationMode===`grid`?i:void 0):(L.isActive()||e||!1===I.next())&&Z().right&&X(r+1,c.navigationMode===`grid`?i:void 0)}function gt({skipFragments:e=!1}={}){if(P.isActive())return P.prev();(L.isActive()||e||!1===I.prev())&&Z().up&&X(r,i-1)}function _t({skipFragments:e=!1}={}){if(d.hasNavigatedVertically=!0,P.isActive())return P.next();(L.isActive()||e||!1===I.next())&&Z().down&&X(r,i+1)}function vt({skipFragments:e=!1}={}){if(P.isActive())return P.prev();if(e||!1===I.prev())if(Z().up)gt({skipFragments:e});else{let t;if(t=c.rtl?g(b.wrapper,k+`.future`).pop():g(b.wrapper,k+`.past`).pop(),t&&t.classList.contains(`stack`)){let e=t.querySelectorAll(`section`).length-1||void 0;X(r-1,e)}else c.rtl?ht({skipFragments:e}):mt({skipFragments:e})}}function yt({skipFragments:e=!1}={}){if(d.hasNavigatedHorizontally=!0,d.hasNavigatedVertically=!0,P.isActive())return P.next();if(e||!1===I.next()){let t=Z();t.down&&t.right&&c.loop&&Ue()&&(t.down=!1),t.down?_t({skipFragments:e}):c.rtl?mt({skipFragments:e}):ht({skipFragments:e})}}function bt(e){let t=e.data;if(typeof t==`string`&&t.charAt(0)===`{`&&t.charAt(t.length-1)===`}`&&(t=JSON.parse(t),t.method&&typeof n[t.method]==`function`))if(!1===ie.test(t.method)){let e=n[t.method].apply(n,t.args);Re(`callback`,{method:t.method,result:e})}else console.warn(`reveal.js: "`+t.method+`" is is blacklisted from the postMessage API`)}function xt(e){S===`running`&&/section/gi.test(e.target.nodeName)&&(S=`idle`,K({type:`slidetransitionend`,data:{indexh:r,indexv:i,previousSlide:a,currentSlide:o}}))}function St(e){let t=x(e.target,`a[href^="#"]`);if(t){let r=t.getAttribute(`href`),i=z.getIndicesFromHash(r);i&&(n.slide(i.h,i.v,i.f),e.preventDefault())}}function Ct(e){q()}function wt(e){!1===document.hidden&&document.activeElement!==document.body&&(typeof document.activeElement.blur==`function`&&document.activeElement.blur(),document.body.focus())}function Tt(e){(document.fullscreenElement||document.webkitFullscreenElement)===b.wrapper&&(e.stopImmediatePropagation(),setTimeout((()=>{n.layout(),n.focus.focus()}),1))}function Et(e){Ge()&&!1===c.loop?(X(0,0),pt()):E?pt():ft()}let Dt={VERSION:Te,initialize:function(r){if(!e)throw`Unable to find presentation root (<div class="reveal">).`;if(l)throw`Reveal.js has already been initialized.`;if(l=!0,b.wrapper=e,b.slides=e.querySelector(`.slides`),!b.slides)throw`Unable to find slides container (<div class="slides">).`;return c={...we,...c,...t,...r,...ee()},/print-pdf/gi.test(window.location.search)&&(c.view=`print`),function(){!0===c.embedded?b.viewport=x(e,`.reveal-viewport`)||e:(b.viewport=document.body,document.documentElement.classList.add(`reveal-full-page`)),b.viewport.classList.add(`reveal-viewport`)}(),window.addEventListener(`load`,q,!1),H.load(c.plugins,c.dependencies).then(Oe),new Promise((e=>n.on(`ready`,e)))},configure:je,destroy:function(){l=!1,!1!==u&&(Ne(),dt(),G.destroy(),W.destroy(),U.destroy(),H.destroy(),Ee.destroy(),B.destroy(),V.destroy(),N.destroy(),A.destroy(),j.destroy(),document.removeEventListener(`fullscreenchange`,Tt),document.removeEventListener(`webkitfullscreenchange`,Tt),document.removeEventListener(`visibilitychange`,wt,!1),window.removeEventListener(`message`,bt,!1),window.removeEventListener(`load`,q,!1),b.pauseOverlay&&b.pauseOverlay.remove(),b.statusElement&&b.statusElement.remove(),document.documentElement.classList.remove(`reveal-full-page`),b.wrapper.classList.remove(`ready`,`center`,`has-horizontal-slides`,`has-vertical-slides`),b.wrapper.removeAttribute(`data-transition-speed`),b.wrapper.removeAttribute(`data-background-transition`),b.viewport.classList.remove(`reveal-viewport`),b.viewport.style.removeProperty(`--slide-width`),b.viewport.style.removeProperty(`--slide-height`),b.slides.style.removeProperty(`width`),b.slides.style.removeProperty(`height`),b.slides.style.removeProperty(`zoom`),b.slides.style.removeProperty(`left`),b.slides.style.removeProperty(`top`),b.slides.style.removeProperty(`bottom`),b.slides.style.removeProperty(`right`),b.slides.style.removeProperty(`transform`),Array.from(b.wrapper.querySelectorAll(O)).forEach((e=>{e.style.removeProperty(`display`),e.style.removeProperty(`top`),e.removeAttribute(`hidden`),e.removeAttribute(`aria-hidden`)})))},sync:Xe,syncSlide:function(e=o){N.sync(e),I.sync(e),D.load(e),N.update(),G.update()},syncFragments:I.sync.bind(I),slide:X,left:mt,right:ht,up:gt,down:_t,prev:vt,next:yt,navigateLeft:mt,navigateRight:ht,navigateUp:gt,navigateDown:_t,navigatePrev:vt,navigateNext:yt,navigateFragment:I.goto.bind(I),prevFragment:I.prev.bind(I),nextFragment:I.next.bind(I),on:Pe,off:Fe,addEventListener:Pe,removeEventListener:Fe,layout:q,shuffle:Ze,availableRoutes:Z,availableFragments:I.availableRoutes.bind(I),toggleHelp:U.toggleHelp.bind(U),toggleOverview:L.toggle.bind(L),toggleScrollView:P.toggle.bind(P),togglePause:qe,toggleAutoSlide:function(e){typeof e==`boolean`?e?pt():ft():E?pt():ft()},toggleJumpToSlide:function(e){typeof e==`boolean`?e?j.show():j.hide():j.isVisible()?j.hide():j.show()},isFirstSlide:We,isLastSlide:Ge,isLastVerticalSlide:Ue,isVerticalSlide:J,isVerticalStack:function(e=o){return e.classList.contains(`.stack`)||e.querySelector(`section`)!==null},isPaused:Je,isAutoSliding:function(){return!(!C||E)},isSpeakerNotes:G.isSpeakerNotesWindow.bind(G),isOverview:L.isActive.bind(L),isFocused:W.isFocused.bind(W),isOverlayOpen:U.isOpen.bind(U),isScrollView:P.isActive.bind(P),isPrintView:F.isActive.bind(F),isReady:()=>u,loadSlide:D.load.bind(D),unloadSlide:D.unload.bind(D),startEmbeddedContent:()=>D.startEmbeddedContent(o),stopEmbeddedContent:()=>D.stopEmbeddedContent(o,{unloadIframes:!1}),previewIframe:U.previewIframe.bind(U),previewImage:U.previewImage.bind(U),previewVideo:U.previewVideo.bind(U),showPreview:U.previewIframe.bind(U),hidePreview:U.close.bind(U),addEventListeners:Me,removeEventListeners:Ne,dispatchEvent:K,getState:ut,setState:function(e){if(typeof e==`object`){X(v(e.indexh),v(e.indexv),v(e.indexf));let t=v(e.paused),n=v(e.overview);typeof t==`boolean`&&t!==Je()&&qe(t),typeof n==`boolean`&&n!==L.isActive()&&L.toggle(n),U.setState(e)}},getProgress:function(){let e=ct(),t=nt();if(o){let e=o.querySelectorAll(`.fragment`);e.length>0&&(t+=o.querySelectorAll(`.fragment.visible`).length/e.length*.9)}return Math.min(t/(e-1),1)},getIndices:rt,getSlidesAttributes:function(){return it().map((e=>{let t={};for(let n=0;n<e.attributes.length;n++){let r=e.attributes[n];t[r.name]=r.value}return t}))},getSlidePastCount:nt,getTotalSlides:ct,getSlide:lt,getPreviousSlide:()=>a,getCurrentSlide:()=>o,getSlideBackground:function(e,t){let n=typeof e==`number`?lt(e,t):e;if(n)return n.slideBackgroundElement},getSlideNotes:G.getSlideNotes.bind(G),getSlides:it,getHorizontalSlides:Q,getVerticalSlides:at,hasHorizontalSlides:ot,hasVerticalSlides:st,hasNavigatedHorizontally:()=>d.hasNavigatedHorizontally,hasNavigatedVertically:()=>d.hasNavigatedVertically,shouldAutoAnimateBetween:Ye,addKeyBinding:R.addKeyBinding.bind(R),removeKeyBinding:R.removeKeyBinding.bind(R),triggerKey:R.triggerKey.bind(R),registerKeyboardShortcut:R.registerKeyboardShortcut.bind(R),getComputedSlideSize:Be,setCurrentScrollPage:function(e,t,n){let s=r||0;r=t,i=n;let l=o!==e;a=o,o=e,o&&a&&c.autoAnimate&&Ye(a,o,s,i)&&M.run(a,o),l&&(a&&(D.stopEmbeddedContent(a),D.stopEmbeddedContent(a.slideBackgroundElement)),D.startEmbeddedContent(o),D.startEmbeddedContent(o.slideBackgroundElement)),requestAnimationFrame((()=>{ke(Ae(o))})),Le()},getScale:()=>p,getConfig:()=>c,getQueryHash:ee,getSlidePath:z.getHash.bind(z),getRevealElement:()=>e,getSlidesElement:()=>b.slides,getViewportElement:()=>b.viewport,getBackgroundsElement:()=>N.element,registerPlugin:H.registerPlugin.bind(H),hasPlugin:H.hasPlugin.bind(H),getPlugin:H.getPlugin.bind(H),getPlugins:H.getRegisteredPlugins.bind(H)};return h(n,{...Dt,announceStatus:ke,getStatusText:Ae,focus:W,scroll:P,progress:V,controls:B,location:z,overview:L,keyboard:R,fragments:I,backgrounds:N,slideContent:D,slideNumber:A,onUserInput:function(e){c.autoSlideStoppable&&ft()},closeOverlay:U.close.bind(U),updateSlidesVisibility:tt,layoutSlideContents:ze,transformSlides:Ie,cueAutoSlide:$,cancelAutoSlide:dt}),Dt}var I=F,L=[];I.initialize=e=>(Object.assign(I,new F(document.querySelector(`.reveal`),e)),L.map((e=>e(I))),I.initialize()),[`configure`,`on`,`off`,`addEventListener`,`removeEventListener`,`registerPlugin`].forEach((e=>{I[e]=(...t)=>{L.push((n=>n[e].call(null,...t)))}})),I.isReady=()=>!1,I.VERSION=Te;var R=`/**
 * reveal.js 5.2.0
 * https://revealjs.com
 * MIT licensed
 *
 * Copyright (C) 2011-2024 Hakim El Hattab, https://hakim.se
 */

.reveal .r-stretch,.reveal .stretch{max-width:none;max-height:none}.reveal pre.r-stretch code,.reveal pre.stretch code{height:100%;max-height:100%;box-sizing:border-box}.reveal .r-fit-text{display:inline-block;white-space:nowrap}.reveal .r-stack{display:grid;grid-template-rows:100%}.reveal .r-stack>*{grid-area:1/1;margin:auto}.reveal .r-hstack,.reveal .r-vstack{display:flex}.reveal .r-hstack img,.reveal .r-hstack video,.reveal .r-vstack img,.reveal .r-vstack video{min-width:0;min-height:0;object-fit:contain}.reveal .r-vstack{flex-direction:column;align-items:center;justify-content:center}.reveal .r-hstack{flex-direction:row;align-items:center;justify-content:center}.reveal .items-stretch{align-items:stretch}.reveal .items-start{align-items:flex-start}.reveal .items-center{align-items:center}.reveal .items-end{align-items:flex-end}.reveal .justify-between{justify-content:space-between}.reveal .justify-around{justify-content:space-around}.reveal .justify-start{justify-content:flex-start}.reveal .justify-center{justify-content:center}.reveal .justify-end{justify-content:flex-end}html.reveal-full-page{width:100%;height:100%;height:100vh;height:calc(var(--vh,1vh) * 100);height:100dvh;overflow:hidden}.reveal-viewport{height:100%;overflow:hidden;position:relative;line-height:1;margin:0;background-color:#fff;color:#000;--r-controls-spacing:12px;--r-overlay-header-height:40px;--r-overlay-margin:0px;--r-overlay-padding:6px;--r-overlay-gap:5px}@media screen and (max-width:1024px),(max-height:768px){.reveal-viewport{--r-overlay-header-height:26px}}.reveal-viewport:fullscreen{top:0!important;left:0!important;width:100%!important;height:100%!important;transform:none!important}.reveal .fragment{transition:all .2s ease}.reveal .fragment:not(.custom){opacity:0;visibility:hidden;will-change:opacity}.reveal .fragment.visible{opacity:1;visibility:inherit}.reveal .fragment.disabled{transition:none}.reveal .fragment.grow{opacity:1;visibility:inherit}.reveal .fragment.grow.visible{transform:scale(1.3)}.reveal .fragment.shrink{opacity:1;visibility:inherit}.reveal .fragment.shrink.visible{transform:scale(.7)}.reveal .fragment.zoom-in{transform:scale(.1)}.reveal .fragment.zoom-in.visible{transform:none}.reveal .fragment.fade-out{opacity:1;visibility:inherit}.reveal .fragment.fade-out.visible{opacity:0;visibility:hidden}.reveal .fragment.semi-fade-out{opacity:1;visibility:inherit}.reveal .fragment.semi-fade-out.visible{opacity:.5;visibility:inherit}.reveal .fragment.strike{opacity:1;visibility:inherit}.reveal .fragment.strike.visible{text-decoration:line-through}.reveal .fragment.fade-up{transform:translate(0,40px)}.reveal .fragment.fade-up.visible{transform:translate(0,0)}.reveal .fragment.fade-down{transform:translate(0,-40px)}.reveal .fragment.fade-down.visible{transform:translate(0,0)}.reveal .fragment.fade-right{transform:translate(-40px,0)}.reveal .fragment.fade-right.visible{transform:translate(0,0)}.reveal .fragment.fade-left{transform:translate(40px,0)}.reveal .fragment.fade-left.visible{transform:translate(0,0)}.reveal .fragment.current-visible,.reveal .fragment.fade-in-then-out{opacity:0;visibility:hidden}.reveal .fragment.current-visible.current-fragment,.reveal .fragment.fade-in-then-out.current-fragment{opacity:1;visibility:inherit}.reveal .fragment.fade-in-then-semi-out{opacity:0;visibility:hidden}.reveal .fragment.fade-in-then-semi-out.visible{opacity:.5;visibility:inherit}.reveal .fragment.fade-in-then-semi-out.current-fragment{opacity:1;visibility:inherit}.reveal .fragment.highlight-blue,.reveal .fragment.highlight-current-blue,.reveal .fragment.highlight-current-green,.reveal .fragment.highlight-current-red,.reveal .fragment.highlight-green,.reveal .fragment.highlight-red{opacity:1;visibility:inherit}.reveal .fragment.highlight-red.visible{color:#ff2c2d}.reveal .fragment.highlight-green.visible{color:#17ff2e}.reveal .fragment.highlight-blue.visible{color:#1b91ff}.reveal .fragment.highlight-current-red.current-fragment{color:#ff2c2d}.reveal .fragment.highlight-current-green.current-fragment{color:#17ff2e}.reveal .fragment.highlight-current-blue.current-fragment{color:#1b91ff}.reveal:after{content:"";font-style:italic}.reveal iframe{z-index:1}.reveal a{position:relative}@keyframes bounce-right{0%,10%,25%,40%,50%{transform:translateX(0)}20%{transform:translateX(10px)}30%{transform:translateX(-5px)}}@keyframes bounce-left{0%,10%,25%,40%,50%{transform:translateX(0)}20%{transform:translateX(-10px)}30%{transform:translateX(5px)}}@keyframes bounce-down{0%,10%,25%,40%,50%{transform:translateY(0)}20%{transform:translateY(10px)}30%{transform:translateY(-5px)}}.reveal .controls{display:none;position:absolute;top:auto;bottom:var(--r-controls-spacing);right:var(--r-controls-spacing);left:auto;z-index:11;color:#000;pointer-events:none;font-size:10px}.reveal .controls button{position:absolute;padding:0;background-color:transparent;border:0;outline:0;cursor:pointer;color:currentColor;transform:scale(.9999);transition:color .2s ease,opacity .2s ease,transform .2s ease;z-index:2;pointer-events:auto;font-size:inherit;visibility:hidden;opacity:0;-webkit-appearance:none;-webkit-tap-highlight-color:transparent}.reveal .controls .controls-arrow:after,.reveal .controls .controls-arrow:before{content:"";position:absolute;top:0;left:0;width:2.6em;height:.5em;border-radius:.25em;background-color:currentColor;transition:all .15s ease,background-color .8s ease;transform-origin:.2em 50%;will-change:transform}.reveal .controls .controls-arrow{position:relative;width:3.6em;height:3.6em}.reveal .controls .controls-arrow:before{transform:translateX(.5em) translateY(1.55em) rotate(45deg)}.reveal .controls .controls-arrow:after{transform:translateX(.5em) translateY(1.55em) rotate(-45deg)}.reveal .controls .controls-arrow:hover:before{transform:translateX(.5em) translateY(1.55em) rotate(40deg)}.reveal .controls .controls-arrow:hover:after{transform:translateX(.5em) translateY(1.55em) rotate(-40deg)}.reveal .controls .controls-arrow:active:before{transform:translateX(.5em) translateY(1.55em) rotate(36deg)}.reveal .controls .controls-arrow:active:after{transform:translateX(.5em) translateY(1.55em) rotate(-36deg)}.reveal .controls .navigate-left{right:6.4em;bottom:3.2em;transform:translateX(-10px)}.reveal .controls .navigate-left.highlight{animation:bounce-left 2s 50 both ease-out}.reveal .controls .navigate-right{right:0;bottom:3.2em;transform:translateX(10px)}.reveal .controls .navigate-right .controls-arrow{transform:rotate(180deg)}.reveal .controls .navigate-right.highlight{animation:bounce-right 2s 50 both ease-out}.reveal .controls .navigate-up{right:3.2em;bottom:6.4em;transform:translateY(-10px)}.reveal .controls .navigate-up .controls-arrow{transform:rotate(90deg)}.reveal .controls .navigate-down{right:3.2em;bottom:-1.4em;padding-bottom:1.4em;transform:translateY(10px)}.reveal .controls .navigate-down .controls-arrow{transform:rotate(-90deg)}.reveal .controls .navigate-down.highlight{animation:bounce-down 2s 50 both ease-out}.reveal .controls[data-controls-back-arrows=faded] .navigate-up.enabled{opacity:.3}.reveal .controls[data-controls-back-arrows=faded] .navigate-up.enabled:hover{opacity:1}.reveal .controls[data-controls-back-arrows=hidden] .navigate-up.enabled{opacity:0;visibility:hidden}.reveal .controls .enabled{visibility:visible;opacity:.9;cursor:pointer;transform:none}.reveal .controls .enabled.fragmented{opacity:.5}.reveal .controls .enabled.fragmented:hover,.reveal .controls .enabled:hover{opacity:1}.reveal:not(.rtl) .controls[data-controls-back-arrows=faded] .navigate-left.enabled{opacity:.3}.reveal:not(.rtl) .controls[data-controls-back-arrows=faded] .navigate-left.enabled:hover{opacity:1}.reveal:not(.rtl) .controls[data-controls-back-arrows=hidden] .navigate-left.enabled{opacity:0;visibility:hidden}.reveal.rtl .controls[data-controls-back-arrows=faded] .navigate-right.enabled{opacity:.3}.reveal.rtl .controls[data-controls-back-arrows=faded] .navigate-right.enabled:hover{opacity:1}.reveal.rtl .controls[data-controls-back-arrows=hidden] .navigate-right.enabled{opacity:0;visibility:hidden}.reveal[data-navigation-mode=linear].has-horizontal-slides .navigate-down,.reveal[data-navigation-mode=linear].has-horizontal-slides .navigate-up{display:none}.reveal:not(.has-vertical-slides) .controls .navigate-left,.reveal[data-navigation-mode=linear].has-horizontal-slides .navigate-left{bottom:1.4em;right:5.5em}.reveal:not(.has-vertical-slides) .controls .navigate-right,.reveal[data-navigation-mode=linear].has-horizontal-slides .navigate-right{bottom:1.4em;right:.5em}.reveal:not(.has-horizontal-slides) .controls .navigate-up{right:1.4em;bottom:5em}.reveal:not(.has-horizontal-slides) .controls .navigate-down{right:1.4em;bottom:.5em}.reveal.has-dark-background .controls{color:#fff}.reveal.has-light-background .controls{color:#000}.reveal.no-hover .controls .controls-arrow:active:before,.reveal.no-hover .controls .controls-arrow:hover:before{transform:translateX(.5em) translateY(1.55em) rotate(45deg)}.reveal.no-hover .controls .controls-arrow:active:after,.reveal.no-hover .controls .controls-arrow:hover:after{transform:translateX(.5em) translateY(1.55em) rotate(-45deg)}@media screen and (min-width:500px){.reveal-viewport{--r-controls-spacing:0.8em}.reveal .controls[data-controls-layout=edges]{top:0;right:0;bottom:0;left:0}.reveal .controls[data-controls-layout=edges] .navigate-down,.reveal .controls[data-controls-layout=edges] .navigate-left,.reveal .controls[data-controls-layout=edges] .navigate-right,.reveal .controls[data-controls-layout=edges] .navigate-up{bottom:auto;right:auto}.reveal .controls[data-controls-layout=edges] .navigate-left{top:50%;left:var(--r-controls-spacing);margin-top:-1.8em}.reveal .controls[data-controls-layout=edges] .navigate-right{top:50%;right:var(--r-controls-spacing);margin-top:-1.8em}.reveal .controls[data-controls-layout=edges] .navigate-up{top:var(--r-controls-spacing);left:50%;margin-left:-1.8em}.reveal .controls[data-controls-layout=edges] .navigate-down{bottom:calc(var(--r-controls-spacing) - 1.4em + .3em);left:50%;margin-left:-1.8em}}.reveal .progress{position:absolute;display:none;height:3px;width:100%;bottom:0;left:0;z-index:10;background-color:rgba(0,0,0,.2);color:#fff}.reveal .progress:after{content:"";display:block;position:absolute;height:10px;width:100%;top:-10px}.reveal .progress span{display:block;height:100%;width:100%;background-color:currentColor;transition:transform .8s cubic-bezier(.26,.86,.44,.985);transform-origin:0 0;transform:scaleX(0)}.reveal .slide-number{position:absolute;display:block;right:8px;bottom:8px;z-index:31;font-family:Helvetica,sans-serif;font-size:12px;line-height:1;color:#fff;background-color:rgba(0,0,0,.4);padding:5px}.reveal .slide-number a{color:currentColor}.reveal .slide-number-delimiter{margin:0 3px}.reveal{position:relative;width:100%;height:100%;overflow:hidden;touch-action:pinch-zoom}.reveal.embedded{touch-action:pan-y}.reveal.embedded.is-vertical-slide{touch-action:none}.reveal .slides{position:absolute;width:100%;height:100%;top:0;right:0;bottom:0;left:0;margin:auto;pointer-events:none;overflow:visible;z-index:1;text-align:center;perspective:600px;perspective-origin:50% 40%}.reveal .slides>section{perspective:600px}.reveal .slides>section,.reveal .slides>section>section{display:none;position:absolute;width:100%;pointer-events:auto;z-index:10;transform-style:flat;transition:transform-origin .8s cubic-bezier(.26,.86,.44,.985),transform .8s cubic-bezier(.26,.86,.44,.985),visibility .8s cubic-bezier(.26,.86,.44,.985),opacity .8s cubic-bezier(.26,.86,.44,.985)}.reveal[data-transition-speed=fast] .slides section{transition-duration:.4s}.reveal[data-transition-speed=slow] .slides section{transition-duration:1.2s}.reveal .slides section[data-transition-speed=fast]{transition-duration:.4s}.reveal .slides section[data-transition-speed=slow]{transition-duration:1.2s}.reveal .slides>section.stack{padding-top:0;padding-bottom:0;pointer-events:none;height:100%}.reveal .slides>section.present,.reveal .slides>section>section.present{display:block;z-index:11;opacity:1}.reveal .slides>section:empty,.reveal .slides>section>section:empty,.reveal .slides>section>section[data-background-interactive],.reveal .slides>section[data-background-interactive]{pointer-events:none}.reveal.center,.reveal.center .slides,.reveal.center .slides section{min-height:0!important}.reveal .slides>section:not(.present),.reveal .slides>section>section:not(.present){pointer-events:none}.reveal.overview .slides>section,.reveal.overview .slides>section>section{pointer-events:auto}.reveal .slides>section.future,.reveal .slides>section.future>section,.reveal .slides>section.past,.reveal .slides>section.past>section,.reveal .slides>section>section.future,.reveal .slides>section>section.past{opacity:0}.reveal .slides>section[data-transition=slide].past,.reveal .slides>section[data-transition~=slide-out].past,.reveal.slide .slides>section:not([data-transition]).past{transform:translate(-150%,0)}.reveal .slides>section[data-transition=slide].future,.reveal .slides>section[data-transition~=slide-in].future,.reveal.slide .slides>section:not([data-transition]).future{transform:translate(150%,0)}.reveal .slides>section>section[data-transition=slide].past,.reveal .slides>section>section[data-transition~=slide-out].past,.reveal.slide .slides>section>section:not([data-transition]).past{transform:translate(0,-150%)}.reveal .slides>section>section[data-transition=slide].future,.reveal .slides>section>section[data-transition~=slide-in].future,.reveal.slide .slides>section>section:not([data-transition]).future{transform:translate(0,150%)}.reveal .slides>section[data-transition=linear].past,.reveal .slides>section[data-transition~=linear-out].past,.reveal.linear .slides>section:not([data-transition]).past{transform:translate(-150%,0)}.reveal .slides>section[data-transition=linear].future,.reveal .slides>section[data-transition~=linear-in].future,.reveal.linear .slides>section:not([data-transition]).future{transform:translate(150%,0)}.reveal .slides>section>section[data-transition=linear].past,.reveal .slides>section>section[data-transition~=linear-out].past,.reveal.linear .slides>section>section:not([data-transition]).past{transform:translate(0,-150%)}.reveal .slides>section>section[data-transition=linear].future,.reveal .slides>section>section[data-transition~=linear-in].future,.reveal.linear .slides>section>section:not([data-transition]).future{transform:translate(0,150%)}.reveal .slides section[data-transition=default].stack,.reveal.default .slides section.stack{transform-style:preserve-3d}.reveal .slides>section[data-transition=default].past,.reveal .slides>section[data-transition~=default-out].past,.reveal.default .slides>section:not([data-transition]).past{transform:translate3d(-100%,0,0) rotateY(-90deg) translate3d(-100%,0,0)}.reveal .slides>section[data-transition=default].future,.reveal .slides>section[data-transition~=default-in].future,.reveal.default .slides>section:not([data-transition]).future{transform:translate3d(100%,0,0) rotateY(90deg) translate3d(100%,0,0)}.reveal .slides>section>section[data-transition=default].past,.reveal .slides>section>section[data-transition~=default-out].past,.reveal.default .slides>section>section:not([data-transition]).past{transform:translate3d(0,-300px,0) rotateX(70deg) translate3d(0,-300px,0)}.reveal .slides>section>section[data-transition=default].future,.reveal .slides>section>section[data-transition~=default-in].future,.reveal.default .slides>section>section:not([data-transition]).future{transform:translate3d(0,300px,0) rotateX(-70deg) translate3d(0,300px,0)}.reveal .slides section[data-transition=convex].stack,.reveal.convex .slides section.stack{transform-style:preserve-3d}.reveal .slides>section[data-transition=convex].past,.reveal .slides>section[data-transition~=convex-out].past,.reveal.convex .slides>section:not([data-transition]).past{transform:translate3d(-100%,0,0) rotateY(-90deg) translate3d(-100%,0,0)}.reveal .slides>section[data-transition=convex].future,.reveal .slides>section[data-transition~=convex-in].future,.reveal.convex .slides>section:not([data-transition]).future{transform:translate3d(100%,0,0) rotateY(90deg) translate3d(100%,0,0)}.reveal .slides>section>section[data-transition=convex].past,.reveal .slides>section>section[data-transition~=convex-out].past,.reveal.convex .slides>section>section:not([data-transition]).past{transform:translate3d(0,-300px,0) rotateX(70deg) translate3d(0,-300px,0)}.reveal .slides>section>section[data-transition=convex].future,.reveal .slides>section>section[data-transition~=convex-in].future,.reveal.convex .slides>section>section:not([data-transition]).future{transform:translate3d(0,300px,0) rotateX(-70deg) translate3d(0,300px,0)}.reveal .slides section[data-transition=concave].stack,.reveal.concave .slides section.stack{transform-style:preserve-3d}.reveal .slides>section[data-transition=concave].past,.reveal .slides>section[data-transition~=concave-out].past,.reveal.concave .slides>section:not([data-transition]).past{transform:translate3d(-100%,0,0) rotateY(90deg) translate3d(-100%,0,0)}.reveal .slides>section[data-transition=concave].future,.reveal .slides>section[data-transition~=concave-in].future,.reveal.concave .slides>section:not([data-transition]).future{transform:translate3d(100%,0,0) rotateY(-90deg) translate3d(100%,0,0)}.reveal .slides>section>section[data-transition=concave].past,.reveal .slides>section>section[data-transition~=concave-out].past,.reveal.concave .slides>section>section:not([data-transition]).past{transform:translate3d(0,-80%,0) rotateX(-70deg) translate3d(0,-80%,0)}.reveal .slides>section>section[data-transition=concave].future,.reveal .slides>section>section[data-transition~=concave-in].future,.reveal.concave .slides>section>section:not([data-transition]).future{transform:translate3d(0,80%,0) rotateX(70deg) translate3d(0,80%,0)}.reveal .slides section[data-transition=zoom],.reveal.zoom .slides section:not([data-transition]){transition-timing-function:ease}.reveal .slides>section[data-transition=zoom].past,.reveal .slides>section[data-transition~=zoom-out].past,.reveal.zoom .slides>section:not([data-transition]).past{visibility:hidden;transform:scale(16)}.reveal .slides>section[data-transition=zoom].future,.reveal .slides>section[data-transition~=zoom-in].future,.reveal.zoom .slides>section:not([data-transition]).future{visibility:hidden;transform:scale(.2)}.reveal .slides>section>section[data-transition=zoom].past,.reveal .slides>section>section[data-transition~=zoom-out].past,.reveal.zoom .slides>section>section:not([data-transition]).past{transform:scale(16)}.reveal .slides>section>section[data-transition=zoom].future,.reveal .slides>section>section[data-transition~=zoom-in].future,.reveal.zoom .slides>section>section:not([data-transition]).future{transform:scale(.2)}.reveal.cube .slides{perspective:1300px}.reveal.cube .slides section{padding:30px;min-height:700px;backface-visibility:hidden;box-sizing:border-box;transform-style:preserve-3d}.reveal.center.cube .slides section{min-height:0}.reveal.cube .slides section:not(.stack):before{content:"";position:absolute;display:block;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.1);border-radius:4px;transform:translateZ(-20px)}.reveal.cube .slides section:not(.stack):after{content:"";position:absolute;display:block;width:90%;height:30px;left:5%;bottom:0;background:0 0;z-index:1;border-radius:4px;box-shadow:0 95px 25px rgba(0,0,0,.2);transform:translateZ(-90px) rotateX(65deg)}.reveal.cube .slides>section.stack{padding:0;background:0 0}.reveal.cube .slides>section.past{transform-origin:100% 0;transform:translate3d(-100%,0,0) rotateY(-90deg)}.reveal.cube .slides>section.future{transform-origin:0 0;transform:translate3d(100%,0,0) rotateY(90deg)}.reveal.cube .slides>section>section.past{transform-origin:0 100%;transform:translate3d(0,-100%,0) rotateX(90deg)}.reveal.cube .slides>section>section.future{transform-origin:0 0;transform:translate3d(0,100%,0) rotateX(-90deg)}.reveal.page .slides{perspective-origin:0 50%;perspective:3000px}.reveal.page .slides section{padding:30px;min-height:700px;box-sizing:border-box;transform-style:preserve-3d}.reveal.page .slides section.past{z-index:12}.reveal.page .slides section:not(.stack):before{content:"";position:absolute;display:block;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.1);transform:translateZ(-20px)}.reveal.page .slides section:not(.stack):after{content:"";position:absolute;display:block;width:90%;height:30px;left:5%;bottom:0;background:0 0;z-index:1;border-radius:4px;box-shadow:0 95px 25px rgba(0,0,0,.2);transform:translateZ(-90px) rotateX(65deg)}.reveal.page .slides>section.stack{padding:0;background:0 0}.reveal.page .slides>section.past{transform-origin:0 0;transform:translate3d(-40%,0,0) rotateY(-80deg)}.reveal.page .slides>section.future{transform-origin:100% 0;transform:translate3d(0,0,0)}.reveal.page .slides>section>section.past{transform-origin:0 0;transform:translate3d(0,-40%,0) rotateX(80deg)}.reveal.page .slides>section>section.future{transform-origin:0 100%;transform:translate3d(0,0,0)}.reveal .slides section[data-transition=fade],.reveal.fade .slides section:not([data-transition]),.reveal.fade .slides>section>section:not([data-transition]){transform:none;transition:opacity .5s}.reveal.fade.overview .slides section,.reveal.fade.overview .slides>section>section{transition:none}.reveal .slides section[data-transition=none],.reveal.none .slides section:not([data-transition]){transform:none;transition:none}.reveal .pause-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;visibility:hidden;opacity:0;z-index:100;transition:all 1s ease}.reveal .pause-overlay .resume-button{position:absolute;bottom:20px;right:20px;color:#ccc;border-radius:2px;padding:6px 14px;border:2px solid #ccc;font-size:16px;background:0 0;cursor:pointer}.reveal .pause-overlay .resume-button:hover{color:#fff;border-color:#fff}.reveal.paused .pause-overlay{visibility:visible;opacity:1}.reveal .no-transition,.reveal .no-transition *,.reveal .slides.disable-slide-transitions section{transition:none!important}.reveal .slides.disable-slide-transitions section{transform:none!important}.reveal .backgrounds{position:absolute;width:100%;height:100%;top:0;left:0;perspective:600px}.reveal .slide-background{display:none;position:absolute;width:100%;height:100%;opacity:0;visibility:hidden;overflow:hidden;background-color:rgba(0,0,0,0);transition:all .8s cubic-bezier(.26,.86,.44,.985)}.reveal .slide-background-content{position:absolute;width:100%;height:100%;background-position:50% 50%;background-repeat:no-repeat;background-size:cover}.reveal .slide-background.stack{display:block}.reveal .slide-background.present{opacity:1;visibility:visible;z-index:2}.print-pdf .reveal .slide-background{opacity:1!important;visibility:visible!important}.reveal .slide-background video{position:absolute;width:100%;height:100%;max-width:none;max-height:none;top:0;left:0;object-fit:cover}.reveal .slide-background[data-background-size=contain] video{object-fit:contain}.reveal>.backgrounds .slide-background[data-background-transition=none],.reveal[data-background-transition=none]>.backgrounds .slide-background:not([data-background-transition]){transition:none}.reveal>.backgrounds .slide-background[data-background-transition=slide],.reveal[data-background-transition=slide]>.backgrounds .slide-background:not([data-background-transition]){opacity:1}.reveal>.backgrounds .slide-background.past[data-background-transition=slide],.reveal[data-background-transition=slide]>.backgrounds .slide-background.past:not([data-background-transition]){transform:translate(-100%,0)}.reveal>.backgrounds .slide-background.future[data-background-transition=slide],.reveal[data-background-transition=slide]>.backgrounds .slide-background.future:not([data-background-transition]){transform:translate(100%,0)}.reveal>.backgrounds .slide-background>.slide-background.past[data-background-transition=slide],.reveal[data-background-transition=slide]>.backgrounds .slide-background>.slide-background.past:not([data-background-transition]){transform:translate(0,-100%)}.reveal>.backgrounds .slide-background>.slide-background.future[data-background-transition=slide],.reveal[data-background-transition=slide]>.backgrounds .slide-background>.slide-background.future:not([data-background-transition]){transform:translate(0,100%)}.reveal>.backgrounds .slide-background.past[data-background-transition=convex],.reveal[data-background-transition=convex]>.backgrounds .slide-background.past:not([data-background-transition]){opacity:0;transform:translate3d(-100%,0,0) rotateY(-90deg) translate3d(-100%,0,0)}.reveal>.backgrounds .slide-background.future[data-background-transition=convex],.reveal[data-background-transition=convex]>.backgrounds .slide-background.future:not([data-background-transition]){opacity:0;transform:translate3d(100%,0,0) rotateY(90deg) translate3d(100%,0,0)}.reveal>.backgrounds .slide-background>.slide-background.past[data-background-transition=convex],.reveal[data-background-transition=convex]>.backgrounds .slide-background>.slide-background.past:not([data-background-transition]){opacity:0;transform:translate3d(0,-100%,0) rotateX(90deg) translate3d(0,-100%,0)}.reveal>.backgrounds .slide-background>.slide-background.future[data-background-transition=convex],.reveal[data-background-transition=convex]>.backgrounds .slide-background>.slide-background.future:not([data-background-transition]){opacity:0;transform:translate3d(0,100%,0) rotateX(-90deg) translate3d(0,100%,0)}.reveal>.backgrounds .slide-background.past[data-background-transition=concave],.reveal[data-background-transition=concave]>.backgrounds .slide-background.past:not([data-background-transition]){opacity:0;transform:translate3d(-100%,0,0) rotateY(90deg) translate3d(-100%,0,0)}.reveal>.backgrounds .slide-background.future[data-background-transition=concave],.reveal[data-background-transition=concave]>.backgrounds .slide-background.future:not([data-background-transition]){opacity:0;transform:translate3d(100%,0,0) rotateY(-90deg) translate3d(100%,0,0)}.reveal>.backgrounds .slide-background>.slide-background.past[data-background-transition=concave],.reveal[data-background-transition=concave]>.backgrounds .slide-background>.slide-background.past:not([data-background-transition]){opacity:0;transform:translate3d(0,-100%,0) rotateX(-90deg) translate3d(0,-100%,0)}.reveal>.backgrounds .slide-background>.slide-background.future[data-background-transition=concave],.reveal[data-background-transition=concave]>.backgrounds .slide-background>.slide-background.future:not([data-background-transition]){opacity:0;transform:translate3d(0,100%,0) rotateX(90deg) translate3d(0,100%,0)}.reveal>.backgrounds .slide-background[data-background-transition=zoom],.reveal[data-background-transition=zoom]>.backgrounds .slide-background:not([data-background-transition]){transition-timing-function:ease}.reveal>.backgrounds .slide-background.past[data-background-transition=zoom],.reveal[data-background-transition=zoom]>.backgrounds .slide-background.past:not([data-background-transition]){opacity:0;visibility:hidden;transform:scale(16)}.reveal>.backgrounds .slide-background.future[data-background-transition=zoom],.reveal[data-background-transition=zoom]>.backgrounds .slide-background.future:not([data-background-transition]){opacity:0;visibility:hidden;transform:scale(.2)}.reveal>.backgrounds .slide-background>.slide-background.past[data-background-transition=zoom],.reveal[data-background-transition=zoom]>.backgrounds .slide-background>.slide-background.past:not([data-background-transition]){opacity:0;visibility:hidden;transform:scale(16)}.reveal>.backgrounds .slide-background>.slide-background.future[data-background-transition=zoom],.reveal[data-background-transition=zoom]>.backgrounds .slide-background>.slide-background.future:not([data-background-transition]){opacity:0;visibility:hidden;transform:scale(.2)}.reveal[data-transition-speed=fast]>.backgrounds .slide-background{transition-duration:.4s}.reveal[data-transition-speed=slow]>.backgrounds .slide-background{transition-duration:1.2s}.reveal [data-auto-animate-target^=unmatched]{will-change:opacity}.reveal section[data-auto-animate]:not(.stack):not([data-auto-animate=running]) [data-auto-animate-target^=unmatched]{opacity:0}.reveal.overview{perspective-origin:50% 50%;perspective:700px}.reveal.overview .slides section{height:100%;top:0!important;opacity:1!important;overflow:hidden;visibility:visible!important;cursor:pointer;box-sizing:border-box}.reveal.overview .slides section.present,.reveal.overview .slides section:hover{outline:10px solid rgba(150,150,150,.4);outline-offset:10px}.reveal.overview .slides section .fragment{opacity:1;transition:none}.reveal.overview .slides section:after,.reveal.overview .slides section:before{display:none!important}.reveal.overview .slides>section.stack{padding:0;top:0!important;background:0 0;outline:0;overflow:visible}.reveal.overview .backgrounds{perspective:inherit}.reveal.overview .backgrounds .slide-background{opacity:1;visibility:visible;outline:10px solid rgba(150,150,150,.1);outline-offset:10px}.reveal.overview .backgrounds .slide-background.stack{overflow:visible}.reveal.overview .slides section,.reveal.overview-deactivating .slides section{transition:none}.reveal.overview .backgrounds .slide-background,.reveal.overview-deactivating .backgrounds .slide-background{transition:none}.reveal.rtl .slides,.reveal.rtl .slides h1,.reveal.rtl .slides h2,.reveal.rtl .slides h3,.reveal.rtl .slides h4,.reveal.rtl .slides h5,.reveal.rtl .slides h6{direction:rtl;font-family:sans-serif}.reveal.rtl code,.reveal.rtl pre{direction:ltr}.reveal.rtl ol,.reveal.rtl ul{text-align:right}.reveal.rtl .progress span{transform-origin:100% 0}.reveal.has-parallax-background .backgrounds{transition:all .8s ease}.reveal.has-parallax-background[data-transition-speed=fast] .backgrounds{transition-duration:.4s}.reveal.has-parallax-background[data-transition-speed=slow] .backgrounds{transition-duration:1.2s}@keyframes fade-in{from{opacity:0}to{opacity:1}}@keyframes scale-up{from{transform:scale(.95)}to{transform:scale(1)}}.reveal [data-preview-image],.reveal [data-preview-link]:not(a):not([data-preview-link=false]),.reveal [data-preview-video]{cursor:zoom-in}.r-overlay{position:absolute;top:var(--r-overlay-margin);right:var(--r-overlay-margin);bottom:var(--r-overlay-margin);left:var(--r-overlay-margin);border-radius:min(var(--r-overlay-margin),6px);z-index:99;background:rgba(0,0,0,.95);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);transition:all .3s ease;color:#fff;animation:fade-in .3s ease;font-family:ui-sans-serif,system-ui,-apple-system,Helvetica,sans-serif}.r-overlay-viewport{position:absolute;top:var(--r-overlay-padding);right:var(--r-overlay-padding);bottom:var(--r-overlay-padding);left:var(--r-overlay-padding);gap:var(--r-overlay-gap);display:flex;flex-direction:column}.r-overlay-header{display:flex;z-index:2;box-sizing:border-box;align-items:center;justify-content:flex-end;height:var(--r-overlay-header-height);gap:6px}.r-overlay-header .r-overlay-button{all:unset;display:flex;align-items:center;justify-content:center;min-width:var(--r-overlay-header-height);min-height:var(--r-overlay-header-height);padding:0 calc(var(--r-overlay-header-height)/ 4);opacity:1;border-radius:6px;font-size:18px;gap:8px;cursor:pointer;box-sizing:border-box}.r-overlay-header .r-overlay-button:hover{opacity:1;background-color:rgba(255,255,255,.15)}.r-overlay-header .icon{display:inline-block;width:20px;height:20px;background-position:50% 50%;background-size:100%;background-repeat:no-repeat}.r-overlay-close .icon{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTIuODU0IDIuODU0YS41LjUgMCAwIDAtLjcwOC0uNzA4TDcuNSA2Ljc5MyAyLjg1NCAyLjE0NmEuNS41IDAgMSAwLS43MDguNzA4TDYuNzkzIDcuNWwtNC42NDcgNC42NDZhLjUuNSAwIDAgMCAuNzA4LjcwOEw3LjUgOC4yMDdsNC42NDYgNC42NDdhLjUuNSAwIDAgMCAuNzA4LS43MDhMOC4yMDcgNy41bDQuNjQ3LTQuNjQ2WiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+)}.r-overlay-external .icon{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMyAyYTEgMSAwIDAgMC0xIDF2OWExIDEgMCAwIDAgMSAxaDlhMSAxIDAgMCAwIDEtMVY4LjVhLjUuNSAwIDAgMC0xIDBWMTJIM1YzaDMuNWEuNS41IDAgMCAwIDAtMUgzWm05Ljg1NC4xNDZhLjUuNSAwIDAgMSAuMTQ2LjM1MVY1LjVhLjUuNSAwIDAgMS0xIDBWMy43MDdMNi44NTQgOC44NTRhLjUuNSAwIDEgMS0uNzA4LS43MDhMMTEuMjkzIDNIOS41YS41LjUgMCAwIDEgMC0xaDNhLjQ5OS40OTkgMCAwIDEgLjM1NC4xNDZaIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=)}.r-overlay-content{position:relative;display:grid;place-items:center;border-radius:6px;overflow:hidden;flex-grow:1;background-color:rgba(20,20,20,.8);animation:scale-up .5s cubic-bezier(.26,.86,.44,.985)}.r-overlay-spinner{position:absolute;display:block;top:50%;left:50%;width:32px;height:32px;margin:-16px 0 0 -16px;z-index:10;background-image:url(data:image/gif;base64,R0lGODlhIAAgAPMAAJmZmf%2F%2F%2F6%2Bvr8nJybW1tcDAwOjo6Nvb26ioqKOjo7Ozs%2FLy8vz8%2FAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh%2BQQJCgAAACwAAAAAIAAgAAAE5xDISWlhperN52JLhSSdRgwVo1ICQZRUsiwHpTJT4iowNS8vyW2icCF6k8HMMBkCEDskxTBDAZwuAkkqIfxIQyhBQBFvAQSDITM5VDW6XNE4KagNh6Bgwe60smQUB3d4Rz1ZBApnFASDd0hihh12BkE9kjAJVlycXIg7CQIFA6SlnJ87paqbSKiKoqusnbMdmDC2tXQlkUhziYtyWTxIfy6BE8WJt5YJvpJivxNaGmLHT0VnOgSYf0dZXS7APdpB309RnHOG5gDqXGLDaC457D1zZ%2FV%2FnmOM82XiHRLYKhKP1oZmADdEAAAh%2BQQJCgAAACwAAAAAIAAgAAAE6hDISWlZpOrNp1lGNRSdRpDUolIGw5RUYhhHukqFu8DsrEyqnWThGvAmhVlteBvojpTDDBUEIFwMFBRAmBkSgOrBFZogCASwBDEY%2FCZSg7GSE0gSCjQBMVG023xWBhklAnoEdhQEfyNqMIcKjhRsjEdnezB%2BA4k8gTwJhFuiW4dokXiloUepBAp5qaKpp6%2BHo7aWW54wl7obvEe0kRuoplCGepwSx2jJvqHEmGt6whJpGpfJCHmOoNHKaHx61WiSR92E4lbFoq%2BB6QDtuetcaBPnW6%2BO7wDHpIiK9SaVK5GgV543tzjgGcghAgAh%2BQQJCgAAACwAAAAAIAAgAAAE7hDISSkxpOrN5zFHNWRdhSiVoVLHspRUMoyUakyEe8PTPCATW9A14E0UvuAKMNAZKYUZCiBMuBakSQKG8G2FzUWox2AUtAQFcBKlVQoLgQReZhQlCIJesQXI5B0CBnUMOxMCenoCfTCEWBsJColTMANldx15BGs8B5wlCZ9Po6OJkwmRpnqkqnuSrayqfKmqpLajoiW5HJq7FL1Gr2mMMcKUMIiJgIemy7xZtJsTmsM4xHiKv5KMCXqfyUCJEonXPN2rAOIAmsfB3uPoAK%2B%2BG%2Bw48edZPK%2BM6hLJpQg484enXIdQFSS1u6UhksENEQAAIfkECQoAAAAsAAAAACAAIAAABOcQyEmpGKLqzWcZRVUQnZYg1aBSh2GUVEIQ2aQOE%2BG%2BcD4ntpWkZQj1JIiZIogDFFyHI0UxQwFugMSOFIPJftfVAEoZLBbcLEFhlQiqGp1Vd140AUklUN3eCA51C1EWMzMCezCBBmkxVIVHBWd3HHl9JQOIJSdSnJ0TDKChCwUJjoWMPaGqDKannasMo6WnM562R5YluZRwur0wpgqZE7NKUm%2BFNRPIhjBJxKZteWuIBMN4zRMIVIhffcgojwCF117i4nlLnY5ztRLsnOk%2BaV%2BoJY7V7m76PdkS4trKcdg0Zc0tTcKkRAAAIfkECQoAAAAsAAAAACAAIAAABO4QyEkpKqjqzScpRaVkXZWQEximw1BSCUEIlDohrft6cpKCk5xid5MNJTaAIkekKGQkWyKHkvhKsR7ARmitkAYDYRIbUQRQjWBwJRzChi9CRlBcY1UN4g0%2FVNB0AlcvcAYHRyZPdEQFYV8ccwR5HWxEJ02YmRMLnJ1xCYp0Y5idpQuhopmmC2KgojKasUQDk5BNAwwMOh2RtRq5uQuPZKGIJQIGwAwGf6I0JXMpC8C7kXWDBINFMxS4DKMAWVWAGYsAdNqW5uaRxkSKJOZKaU3tPOBZ4DuK2LATgJhkPJMgTwKCdFjyPHEnKxFCDhEAACH5BAkKAAAALAAAAAAgACAAAATzEMhJaVKp6s2nIkolIJ2WkBShpkVRWqqQrhLSEu9MZJKK9y1ZrqYK9WiClmvoUaF8gIQSNeF1Er4MNFn4SRSDARWroAIETg1iVwuHjYB1kYc1mwruwXKC9gmsJXliGxc%2BXiUCby9ydh1sOSdMkpMTBpaXBzsfhoc5l58Gm5yToAaZhaOUqjkDgCWNHAULCwOLaTmzswadEqggQwgHuQsHIoZCHQMMQgQGubVEcxOPFAcMDAYUA85eWARmfSRQCdcMe0zeP1AAygwLlJtPNAAL19DARdPzBOWSm1brJBi45soRAWQAAkrQIykShQ9wVhHCwCQCACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiRMDjI0Fd30%2FiI2UA5GSS5UDj2l6NoqgOgN4gksEBgYFf0FDqKgHnyZ9OX8HrgYHdHpcHQULXAS2qKpENRg7eAMLC7kTBaixUYFkKAzWAAnLC7FLVxLWDBLKCwaKTULgEwbLA4hJtOkSBNqITT3xEgfLpBtzE%2FjiuL04RGEBgwWhShRgQExHBAAh%2BQQJCgAAACwAAAAAIAAgAAAE7xDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfZiCqGk5dTESJeaOAlClzsJsqwiJwiqnFrb2nS9kmIcgEsjQydLiIlHehhpejaIjzh9eomSjZR%2BipslWIRLAgMDOR2DOqKogTB9pCUJBagDBXR6XB0EBkIIsaRsGGMMAxoDBgYHTKJiUYEGDAzHC9EACcUGkIgFzgwZ0QsSBcXHiQvOwgDdEwfFs0sDzt4S6BK4xYjkDOzn0unFeBzOBijIm1Dgmg5YFQwsCMjp1oJ8LyIAACH5BAkKAAAALAAAAAAgACAAAATwEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GGl6NoiPOH16iZKNlH6KmyWFOggHhEEvAwwMA0N9GBsEC6amhnVcEwavDAazGwIDaH1ipaYLBUTCGgQDA8NdHz0FpqgTBwsLqAbWAAnIA4FWKdMLGdYGEgraigbT0OITBcg5QwPT4xLrROZL6AuQAPUS7bxLpoWidY0JtxLHKhwwMJBTHgPKdEQAACH5BAkKAAAALAAAAAAgACAAAATrEMhJaVKp6s2nIkqFZF2VIBWhUsJaTokqUCoBq%2BE71SRQeyqUToLA7VxF0JDyIQh%2FMVVPMt1ECZlfcjZJ9mIKoaTl1MRIl5o4CUKXOwmyrCInCKqcWtvadL2SYhyASyNDJ0uIiUd6GAULDJCRiXo1CpGXDJOUjY%2BYip9DhToJA4RBLwMLCwVDfRgbBAaqqoZ1XBMHswsHtxtFaH1iqaoGNgAIxRpbFAgfPQSqpbgGBqUD1wBXeCYp1AYZ19JJOYgH1KwA4UBvQwXUBxPqVD9L3sbp2BNk2xvvFPJd%2BMFCN6HAAIKgNggY0KtEBAAh%2BQQJCgAAACwAAAAAIAAgAAAE6BDISWlSqerNpyJKhWRdlSAVoVLCWk6JKlAqAavhO9UkUHsqlE6CwO1cRdCQ8iEIfzFVTzLdRAmZX3I2SfYIDMaAFdTESJeaEDAIMxYFqrOUaNW4E4ObYcCXaiBVEgULe0NJaxxtYksjh2NLkZISgDgJhHthkpU4mW6blRiYmZOlh4JWkDqILwUGBnE6TYEbCgevr0N1gH4At7gHiRpFaLNrrq8HNgAJA70AWxQIH1%2BvsYMDAzZQPC9VCNkDWUhGkuE5PxJNwiUK4UfLzOlD4WvzAHaoG9nxPi5d%2BjYUqfAhhykOFwJWiAAAIfkECQoAAAAsAAAAACAAIAAABPAQyElpUqnqzaciSoVkXVUMFaFSwlpOCcMYlErAavhOMnNLNo8KsZsMZItJEIDIFSkLGQoQTNhIsFehRww2CQLKF0tYGKYSg%2BygsZIuNqJksKgbfgIGepNo2cIUB3V1B3IvNiBYNQaDSTtfhhx0CwVPI0UJe0%2Bbm4g5VgcGoqOcnjmjqDSdnhgEoamcsZuXO1aWQy8KAwOAuTYYGwi7w5h%2BKr0SJ8MFihpNbx%2B4Erq7BYBuzsdiH1jCAzoSfl0rVirNbRXlBBlLX%2BBP0XJLAPGzTkAuAOqb0WT5AH7OcdCm5B8TgRwSRKIHQtaLCwg1RAAAOwAAAAAAAAAAAA%3D%3D);visibility:hidden;opacity:0}.r-overlay-preview .r-overlay-content iframe{width:100%;height:100%;max-width:100%;max-height:100%;border:0;opacity:0;visibility:hidden;transition:all .3s ease}.r-overlay-preview[data-state=loaded] iframe{opacity:1;visibility:visible}.r-overlay-preview .r-overlay-content img,.r-overlay-preview .r-overlay-content video{position:absolute;max-width:100%;max-height:100%;width:100%;height:100%;margin:0;object-fit:scale-down}.r-overlay-preview[data-preview-fit=none] img,.r-overlay-preview[data-preview-fit=none] video{object-fit:none}.r-overlay-preview[data-preview-fit=scale-down] img,.r-overlay-preview[data-preview-fit=scale-down] video{object-fit:scale-down}.r-overlay-preview[data-preview-fit=contain] img,.r-overlay-preview[data-preview-fit=contain] video{object-fit:contain}.r-overlay-preview[data-preview-fit=cover] img,.r-overlay-preview[data-preview-fit=cover] video{object-fit:cover}.r-overlay-preview[data-state=loaded] .r-overlay-content-inner{position:absolute;z-index:-1;left:0;top:45%;width:100%;text-align:center;letter-spacing:normal}.r-overlay-preview .r-overlay-error{font-size:18px;color:orange}.r-overlay-preview .x-frame-error{opacity:0;transition:opacity .3s ease .3s}.r-overlay-preview[data-state=loaded] .x-frame-error{opacity:1}.r-overlay-preview[data-state=loading] .r-overlay-spinner{opacity:.6;visibility:visible}.r-overlay-help .r-overlay-content{overflow:auto}.r-overlay-help-content{max-width:560px;padding:20px 0;margin:auto;text-align:center;letter-spacing:normal}.r-overlay-help-content .title{font-size:20px;margin-top:0}.r-overlay-help .r-overlay-help-content table{border:1px solid #fff;border-collapse:collapse;font-size:16px;text-align:left}.r-overlay-help .r-overlay-help-content table td,.r-overlay-help .r-overlay-help-content table th{width:240px;padding:14px;border:1px solid #fff;vertical-align:middle}.r-overlay-help .r-overlay-help-content table th{padding-top:20px;padding-bottom:20px}.reveal .playback{position:absolute;left:15px;bottom:20px;z-index:30;cursor:pointer;transition:all .4s ease;-webkit-tap-highlight-color:transparent}.reveal.overview .playback{opacity:0;visibility:hidden}.reveal .hljs{min-height:100%}.reveal .hljs table{margin:initial}.reveal .hljs-ln-code,.reveal .hljs-ln-numbers{padding:0;border:0}.reveal .hljs-ln-numbers{opacity:.6;padding-right:.75em;text-align:right;vertical-align:top}.reveal .hljs.has-highlights tr:not(.highlight-line){opacity:.4}.reveal .hljs.has-highlights.fragment{transition:all .2s ease}.reveal .hljs:not(:first-child).fragment{position:absolute;top:0;left:0;width:100%;box-sizing:border-box}.reveal pre[data-auto-animate-target]{overflow:hidden}.reveal pre[data-auto-animate-target] code{height:100%}.reveal .roll{display:inline-block;line-height:1.2;overflow:hidden;vertical-align:top;perspective:400px;perspective-origin:50% 50%}.reveal .roll:hover{background:0 0;text-shadow:none}.reveal .roll span{display:block;position:relative;padding:0 2px;pointer-events:none;transition:all .4s ease;transform-origin:50% 0;transform-style:preserve-3d;backface-visibility:hidden}.reveal .roll:hover span{background:rgba(0,0,0,.5);transform:translate3d(0,0,-45px) rotateX(90deg)}.reveal .roll span:after{content:attr(data-title);display:block;position:absolute;left:0;top:0;padding:0 2px;backface-visibility:hidden;transform-origin:50% 0;transform:translate3d(0,110%,0) rotateX(-90deg)}.reveal aside.notes{display:none}.reveal .speaker-notes{display:none;position:absolute;width:33.3333333333%;height:100%;top:0;left:100%;padding:14px 18px 14px 18px;z-index:1;font-size:18px;line-height:1.4;border:1px solid rgba(0,0,0,.05);color:#222;background-color:#f5f5f5;overflow:auto;box-sizing:border-box;text-align:left;font-family:Helvetica,sans-serif;-webkit-overflow-scrolling:touch}.reveal .speaker-notes .notes-placeholder{color:#ccc;font-style:italic}.reveal .speaker-notes:focus{outline:0}.reveal .speaker-notes:before{content:"Speaker notes";display:block;margin-bottom:10px;opacity:.5}.reveal.show-notes{max-width:75%;overflow:visible}.reveal.show-notes .speaker-notes{display:block}@media screen and (min-width:1600px){.reveal .speaker-notes{font-size:20px}}@media screen and (max-width:1024px){.reveal.show-notes{border-left:0;max-width:none;max-height:70%;max-height:70vh;overflow:visible}.reveal.show-notes .speaker-notes{top:100%;left:0;width:100%;height:30vh;border:0}}@media screen and (max-width:600px){.reveal.show-notes{max-height:60%;max-height:60vh}.reveal.show-notes .speaker-notes{top:100%;height:40vh}.reveal .speaker-notes{font-size:14px}}.reveal .jump-to-slide{position:absolute;top:15px;left:15px;z-index:30;font-size:32px;-webkit-tap-highlight-color:transparent}.reveal .jump-to-slide-input{background:0 0;padding:8px;font-size:inherit;color:currentColor;border:0}.reveal .jump-to-slide-input::placeholder{color:currentColor;opacity:.5}.reveal.has-dark-background .jump-to-slide-input{color:#fff}.reveal.has-light-background .jump-to-slide-input{color:#222}.reveal .jump-to-slide-input:focus{outline:0}.zoomed .reveal *,.zoomed .reveal :after,.zoomed .reveal :before{backface-visibility:visible!important}.zoomed .reveal .controls,.zoomed .reveal .progress{opacity:0}.zoomed .reveal .roll span{background:0 0}.zoomed .reveal .roll span:after{visibility:hidden}.reveal-viewport.loading-scroll-mode{visibility:hidden}.reveal-viewport.reveal-scroll{margin:0 auto;overflow:auto;overflow-x:hidden;overflow-y:auto;z-index:1;--r-scrollbar-width:7px;--r-scrollbar-trigger-size:5px;--r-controls-spacing:8px}@media screen and (max-width:500px){.reveal-viewport.reveal-scroll{--r-scrollbar-width:3px;--r-scrollbar-trigger-size:3px}}.reveal-viewport.reveal-scroll .backgrounds,.reveal-viewport.reveal-scroll .controls,.reveal-viewport.reveal-scroll .playback,.reveal-viewport.reveal-scroll .progress,.reveal-viewport.reveal-scroll .slide-number,.reveal-viewport.reveal-scroll .speaker-notes{display:none!important}.reveal-viewport.reveal-scroll .pause-overlay,.reveal-viewport.reveal-scroll .r-overlay{position:fixed}.reveal-viewport.reveal-scroll .reveal{overflow:visible;touch-action:manipulation}.reveal-viewport.reveal-scroll .slides{position:static;pointer-events:initial;left:auto;top:auto;width:100%!important;margin:0;padding:0;overflow:visible;display:block;perspective:none;perspective-origin:50% 50%}.reveal-viewport.reveal-scroll .scroll-page{position:relative;width:100%;height:calc(var(--page-height) + var(--page-scroll-padding));z-index:1;overflow:visible}.reveal-viewport.reveal-scroll .scroll-page-sticky{position:sticky;height:var(--page-height);top:0}.reveal-viewport.reveal-scroll .scroll-page-content{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden}.reveal-viewport.reveal-scroll .scroll-page section{visibility:visible!important;display:block!important;position:absolute!important;width:var(--slide-width)!important;height:var(--slide-height)!important;top:50%!important;left:50%!important;opacity:1!important;transform:scale(var(--slide-scale)) translate(-50%,-50%)!important;transform-style:flat!important;transform-origin:0 0!important}.reveal-viewport.reveal-scroll .slide-background{display:block!important;position:absolute;top:0;left:0;width:100%;height:100%;z-index:auto!important;visibility:visible;opacity:1;touch-action:manipulation}.reveal-viewport.reveal-scroll[data-scrollbar=auto]::-webkit-scrollbar,.reveal-viewport.reveal-scroll[data-scrollbar=true]::-webkit-scrollbar{display:none}.reveal-viewport.reveal-scroll[data-scrollbar=auto],.reveal-viewport.reveal-scroll[data-scrollbar=true]{scrollbar-width:none}.reveal-viewport.has-dark-background,.reveal.has-dark-background{--r-overlay-element-bg-color:240,240,240;--r-overlay-element-fg-color:0,0,0}.reveal-viewport.has-light-background,.reveal.has-light-background{--r-overlay-element-bg-color:0,0,0;--r-overlay-element-fg-color:240,240,240}.reveal-viewport.reveal-scroll .scrollbar{position:sticky;top:50%;z-index:20;opacity:0;transition:all .3s ease}.reveal-viewport.reveal-scroll .scrollbar.visible,.reveal-viewport.reveal-scroll .scrollbar:hover{opacity:1}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-inner{position:absolute;width:var(--r-scrollbar-width);height:calc(var(--viewport-height) - var(--r-controls-spacing) * 2);right:var(--r-controls-spacing);top:0;transform:translateY(-50%);border-radius:var(--r-scrollbar-width);z-index:10}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-playhead{position:absolute;width:var(--r-scrollbar-width);height:var(--r-scrollbar-width);top:0;left:0;border-radius:var(--r-scrollbar-width);background-color:rgba(var(--r-overlay-element-bg-color),1);z-index:11;transition:background-color .2s ease}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide{position:absolute;width:100%;background-color:rgba(var(--r-overlay-element-bg-color),.2);box-shadow:0 0 0 1px rgba(var(--r-overlay-element-fg-color),.1);border-radius:var(--r-scrollbar-width);transition:background-color .2s ease}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide:after{content:"";position:absolute;width:200%;height:100%;top:0;left:-50%;background:rgba(0,0,0,0);z-index:-1}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide.active,.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide:hover{background-color:rgba(var(--r-overlay-element-bg-color),.4)}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-trigger{position:absolute;width:100%;transition:background-color .2s ease}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide.active.has-triggers{background-color:rgba(var(--r-overlay-element-bg-color),.4);z-index:10}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide.active .scrollbar-trigger:after{content:"";position:absolute;width:var(--r-scrollbar-trigger-size);height:var(--r-scrollbar-trigger-size);border-radius:20px;top:50%;left:50%;transform:translate(-50%,-50%);background-color:rgba(var(--r-overlay-element-bg-color),1);transition:transform .2s ease,opacity .2s ease;opacity:.4}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide.active .scrollbar-trigger.active:after,.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide.active .scrollbar-trigger.active~.scrollbar-trigger:after{opacity:1}.reveal-viewport.reveal-scroll .scrollbar .scrollbar-slide.active .scrollbar-trigger~.scrollbar-trigger.active:after{transform:translate(calc(var(--r-scrollbar-width) * -2),0);background-color:rgba(var(--r-overlay-element-bg-color),1)}html.reveal-print *{-webkit-print-color-adjust:exact}html.reveal-print{width:100%;height:100%;overflow:visible}html.reveal-print body{margin:0 auto!important;border:0;padding:0;float:none!important;overflow:visible}html.reveal-print .nestedarrow,html.reveal-print .reveal .controls,html.reveal-print .reveal .playback,html.reveal-print .reveal .progress,html.reveal-print .reveal.overview,html.reveal-print .state-background{display:none!important}html.reveal-print .reveal pre code{overflow:hidden!important}html.reveal-print .reveal{width:auto!important;height:auto!important;overflow:hidden!important}html.reveal-print .reveal .slides{position:static;width:100%!important;height:auto!important;zoom:1!important;pointer-events:initial;left:auto;top:auto;margin:0!important;padding:0!important;overflow:visible;display:block;perspective:none;perspective-origin:50% 50%}html.reveal-print .reveal .slides .pdf-page{position:relative;overflow:hidden;z-index:1;page-break-after:always}html.reveal-print .reveal .slides .pdf-page:last-of-type{page-break-after:avoid}html.reveal-print .reveal .slides section{visibility:visible!important;display:block!important;position:absolute!important;margin:0!important;padding:0!important;box-sizing:border-box!important;min-height:1px;opacity:1!important;transform-style:flat!important;transform:none!important}html.reveal-print .reveal section.stack{position:relative!important;margin:0!important;padding:0!important;page-break-after:avoid!important;height:auto!important;min-height:auto!important}html.reveal-print .reveal img{box-shadow:none}html.reveal-print .reveal .backgrounds{display:none}html.reveal-print .reveal .slide-background{display:block!important;position:absolute;top:0;left:0;width:100%;height:100%;z-index:auto!important}html.reveal-print .reveal.show-notes{max-width:none;max-height:none}html.reveal-print .reveal .speaker-notes-pdf{display:block;width:100%;height:auto;max-height:none;top:auto;right:auto;bottom:auto;left:auto;z-index:100}html.reveal-print .reveal .speaker-notes-pdf[data-layout=separate-page]{position:relative;color:inherit;background-color:transparent;padding:20px;page-break-after:always;border:0}html.reveal-print .reveal .slide-number-pdf{display:block;position:absolute;font-size:14px;visibility:visible}html.reveal-print .aria-status{display:none}@media print{html:not(.print-pdf){overflow:visible;width:auto;height:auto}html:not(.print-pdf) body{margin:0;padding:0;overflow:visible}html:not(.print-pdf) .reveal{background:#fff;font-size:20pt}html:not(.print-pdf) .reveal .backgrounds,html:not(.print-pdf) .reveal .controls,html:not(.print-pdf) .reveal .progress,html:not(.print-pdf) .reveal .slide-number,html:not(.print-pdf) .reveal .state-background{display:none!important}html:not(.print-pdf) .reveal li,html:not(.print-pdf) .reveal p,html:not(.print-pdf) .reveal td{font-size:20pt!important;color:#000}html:not(.print-pdf) .reveal h1,html:not(.print-pdf) .reveal h2,html:not(.print-pdf) .reveal h3,html:not(.print-pdf) .reveal h4,html:not(.print-pdf) .reveal h5,html:not(.print-pdf) .reveal h6{color:#000!important;height:auto;line-height:normal;text-align:left;letter-spacing:normal}html:not(.print-pdf) .reveal h1{font-size:28pt!important}html:not(.print-pdf) .reveal h2{font-size:24pt!important}html:not(.print-pdf) .reveal h3{font-size:22pt!important}html:not(.print-pdf) .reveal h4{font-size:22pt!important;font-variant:small-caps}html:not(.print-pdf) .reveal h5{font-size:21pt!important}html:not(.print-pdf) .reveal h6{font-size:20pt!important;font-style:italic}html:not(.print-pdf) .reveal a:link,html:not(.print-pdf) .reveal a:visited{color:#000!important;font-weight:700;text-decoration:underline}html:not(.print-pdf) .reveal div,html:not(.print-pdf) .reveal ol,html:not(.print-pdf) .reveal p,html:not(.print-pdf) .reveal ul{visibility:visible;position:static;width:auto;height:auto;display:block;overflow:visible;margin:0;text-align:left!important}html:not(.print-pdf) .reveal pre,html:not(.print-pdf) .reveal table{margin-left:0;margin-right:0}html:not(.print-pdf) .reveal pre code{padding:20px}html:not(.print-pdf) .reveal blockquote{margin:20px 0}html:not(.print-pdf) .reveal .slides{position:static!important;width:auto!important;height:auto!important;left:0!important;top:0!important;margin-left:0!important;margin-top:0!important;padding:0!important;zoom:1!important;transform:none!important;overflow:visible!important;display:block!important;text-align:left!important;perspective:none;perspective-origin:50% 50%}html:not(.print-pdf) .reveal .slides section{visibility:visible!important;position:static!important;width:auto!important;height:auto!important;display:block!important;overflow:visible!important;left:0!important;top:0!important;margin-left:0!important;margin-top:0!important;padding:60px 20px!important;z-index:auto!important;opacity:1!important;page-break-after:always!important;transform-style:flat!important;transform:none!important;transition:none!important}html:not(.print-pdf) .reveal .slides section.stack{padding:0!important}html:not(.print-pdf) .reveal .slides section:last-of-type{page-break-after:avoid!important}html:not(.print-pdf) .reveal .slides section .fragment{opacity:1!important;visibility:visible!important;transform:none!important}html:not(.print-pdf) .reveal .r-fit-text{white-space:normal!important}html:not(.print-pdf) .reveal section img{display:block;margin:15px 0;background:#fff;border:1px solid #666;box-shadow:none}html:not(.print-pdf) .reveal section small{font-size:.8em}html:not(.print-pdf) .reveal .hljs{max-height:100%;white-space:pre-wrap;word-wrap:break-word;word-break:break-word;font-size:15pt}html:not(.print-pdf) .reveal .hljs .hljs-ln-numbers{white-space:nowrap}html:not(.print-pdf) .reveal .hljs td{font-size:inherit!important;color:inherit!important}}`,z=Object.assign({"../node_modules/reveal.js/dist/theme/beige.css":e,"../node_modules/reveal.js/dist/theme/black-contrast.css":t,"../node_modules/reveal.js/dist/theme/black.css":n,"../node_modules/reveal.js/dist/theme/blood.css":r,"../node_modules/reveal.js/dist/theme/dracula.css":i,"../node_modules/reveal.js/dist/theme/league.css":a,"../node_modules/reveal.js/dist/theme/moon.css":o,"../node_modules/reveal.js/dist/theme/night.css":s,"../node_modules/reveal.js/dist/theme/serif.css":c,"../node_modules/reveal.js/dist/theme/simple.css":l,"../node_modules/reveal.js/dist/theme/sky.css":u,"../node_modules/reveal.js/dist/theme/solarized.css":d,"../node_modules/reveal.js/dist/theme/white-contrast.css":f,"../node_modules/reveal.js/dist/theme/white.css":p,"../node_modules/reveal.js/dist/theme/white_contrast_compact_verbatim_headers.css":m}),B={};for(let[e,t]of Object.entries(z)){let n=e.split(`/`).pop().replace(/\.css$/,``);B[n]=t}function V(){let e=B[document.querySelector(`.reveal`)?.dataset.theme??`black`]??B.black,t=document.createElement(`style`);t.textContent=R+e,document.head.appendChild(t)}function Ee(){let e=document.querySelector(`.reveal`);if(!e)return;let t=document.createElement(`div`);t.className=`slide-title-bar`,e.appendChild(t);let n=()=>{let e=document.querySelector(`.reveal .slides section.present`)?.querySelector(`:scope > .rheo-slide-title`);t.innerHTML=e?.innerHTML??``,t.style.display=e?``:`none`};I.on(`ready`,n),I.on(`slidechanged`,n)}function H(){let e=document.querySelector(`.reveal`);V(),Ee();let t=e?.dataset.transition;I.initialize({hash:!0,...t?{transition:t}:{}})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,H):H()})();
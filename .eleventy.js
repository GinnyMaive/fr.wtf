const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

/**
 * Markdown-it helper function to force external links to open in a new tab.
 *
 * You still need to add target=_blank to non-markdown files (like njk templates), though
 * those links do automatically get decorated with the new window icon via css.
 */
const openExternalLinksInNewTab = (tokens, idx) => {
  const hrefAttr = tokens[idx].attrGet('href');

  // Check if the link is external (starts with http:// or https://)
  if (hrefAttr && (hrefAttr.startsWith('http://') || hrefAttr.startsWith('https://'))) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
  }
};

module.exports = function(eleventyConfig) {
    const isProduction = process.env.ELEVENTY_ENV === 'production';
    const TIME_ZONE = "America/Los_Angeles";
    eleventyConfig.addDateParsing(function(dateValue) {
	let localDate;
	if(dateValue instanceof Date) { // and YAML
	    localDate = DateTime.fromJSDate(dateValue, { zone: "utc" }).setZone(TIME_ZONE, { keepLocalTime: true });
	}
	if (localDate?.isValid === false) {
	    return false;
	}
	return localDate;
    });

    eleventyConfig.addFilter("limit", function (arr, limit) {
	return arr.slice(0, limit);
    });
    
    const markdownIt = require('markdown-it');
    const markdownItAnchor = require('markdown-it-anchor');
    const markdownItAttrs = require('markdown-it-attrs');
    const markdownItFootnote = require("markdown-it-footnote");
    const markdownItForInline = require("markdown-it-for-inline");
    const dirOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
    const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

    eleventyConfig.setQuietMode(true);
    eleventyConfig.addPlugin(dirOutputPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);

    const { DateTime } = require("luxon");
    
    eleventyConfig.setLibrary("md", markdownIt({ html: true })
			      .use(markdownItAnchor)
			      .use(markdownItAttrs)
			      .use(markdownItFootnote)
			      .use(markdownItForInline, 'external_new_win', 'link_open', openExternalLinksInNewTab)
			     );
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/.well-known");
    eleventyConfig.addPassthroughCopy({
	"src/assets/favicon/favicon-96x96.png": "favicon.ico"});
    eleventyConfig.addFilter("cute_date", (dateObj) => {
	return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
    });

    eleventyConfig.addFilter("cute_date_only", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
    });

    eleventyConfig.addPlugin(feedPlugin, {
	type: "rss",
        outputPath: "/blog/feed.xml",
        collection: {
            name: "post",
            limit: 0,
        },
        metadata: {
            language: "en",
            title: "Ginny Mae is rambling again...",
            subtitle: "the puns will get better",
            base: "https://gintoxicat.ing/",
            author: {
                name: "Ginny Mae (gintoxicating)",
                email: "",
            }
        }
    });

    eleventyConfig.addPlugin(EleventyRenderPlugin);
    
    return {
	passthroughFileCopy: true,
	dir: {
	    input: "src",
	    includes: "_includes",
	    data: "_data",
	    output: isProduction ? "_prod" : "_site"
	}
    };
};

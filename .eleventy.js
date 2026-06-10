const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {
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

    const { DateTime } = require("luxon");
    
    eleventyConfig.setLibrary("md", markdownIt()
			      .use(markdownItAnchor)
			      .use(markdownItAttrs)
			      .use(markdownItFootnote)
			     );
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/favicon.ico");

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
            title: "Ginny Maive's Got Something To Say...ive",
            subtitle: "the puns will get better",
            base: "https://mae.lol/",
            author: {
                name: "Ginny Maive",
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
	    output: "_site"
	}
    };
};

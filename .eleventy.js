const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
    const markdownIt = require('markdown-it');
    const markdownItAnchor = require('markdown-it-anchor');
    const markdownItAttrs = require('markdown-it-attrs');
    
    eleventyConfig.setLibrary("md", markdownIt()
			      .use(markdownItAnchor)
			      .use(markdownItAttrs)
			     );
    eleventyConfig.addPassthroughCopy("/home/maive/www/fr.wtf/11ty/src/images");
    eleventyConfig.addPassthroughCopy("/home/maive/www/fr.wtf/11ty/src/favicon.ico");

    eleventyConfig.addPlugin(feedPlugin, {
	type: "atom", // or "rss", "json"
	outputPath: "/blog/feed.xml",
	collection: {
	    name: "posts", // iterate over `collections.posts`
	    limit: 0,     // 0 means no limit
	},
	metadata: {
	    language: "en",
	    title: "Ginny Mae? fr? wtf?",
	    subtitle: "The incoherent words of a way-too-online tgirl",
	    base: "https://fr.wtf/",
	    author: {
		name: "Ginny Mae",
		email: "", // Optional
	    }
	}
    });

    return {
	passthroughFileCopy: true,
	dir: {
	    input: "/home/maive/www/fr.wtf/11ty/src",
	    includes: "_includes",
	    data: "_data",
	    output: "/home/maive/www/fr.wtf/www"
	}
    };
};

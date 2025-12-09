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

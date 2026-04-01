module.exports = function (eleventyConfig) {
  // Pass through public/ assets to root of _site/
  eleventyConfig.addPassthroughCopy({ "public/media": "media" });
  eleventyConfig.addPassthroughCopy({ "public/favicon.svg": "favicon.svg" });

  // Pass through project media
  eleventyConfig.addPassthroughCopy("src/projects/**/*.{jpg,jpeg,png,gif,webp,svg,mp4,pdf}");

  // Projects collection sorted by order field
  eleventyConfig.addCollection("projects", (api) => {
    return api
      .getFilteredByGlob("src/projects/*/index.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99));
  });

  // Filter: only featured projects
  eleventyConfig.addFilter("featured", (arr) =>
    arr.filter((p) => p.data.featured)
  );

  // Filter: detect video thumbnails by extension
  eleventyConfig.addFilter("isVideo", (path) =>
    typeof path === "string" && path.toLowerCase().endsWith(".mp4")
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

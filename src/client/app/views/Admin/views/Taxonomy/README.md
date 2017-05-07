# Taxonomy

The taxonomy system is inspired from Drupal's taxonomy system.

> Taxonomy, a powerful core module, gives your sites use of the organizational keyword.

> —Drupal: [About taxonomies][1]; [Organizing content with taxonomies][1].

[1]: https://www.drupal.org/docs/7/organizing-content-with-taxonomies/about-taxonomies
[2]: https://www.drupal.org/docs/7/organizing-content-with-taxonomies/organizing-content-with-taxonomies

In short, the schema consists of two main fields: **`taxonomy`** and **`term`**. Stuff like "category" and "tag" would be the **`taxonomy`** (akin to "vocabulary"). And stuff like "music", "art" would be **``term``** ***for*** the "category" taxonomy, and stuff like "recent", "popular" might be **``term``** for the "tag" taxonomy.

Sub-terms and/or hierarchy is handled by the **``hierarchy``** field which is an array of all its ancestors' taxonomy records in the order of [top-most ancestor, ...-to->..., most-immediate parent].

## Taxonomies

There are a few taxonomies that are essential (listed below) and the code to add/edit them is hard-coded (both front-end and back-end).

## **Subject** taxonomy

The **``subject``** taxonomy is modeled after [Wikipedia Vital Articles].

[Wikipedia Vital Articles]: https://en.wikipedia.org/wiki/Wikipedia:Vital_articles.

It looks like this:

```text
1. People
  1.1 Artists
    1.1.1 Leonardo da Vinci
    1.1.2 Michelangelo
    ...
  1.2 Writers
    ...
  1.3 Composers and musicians
    ...
2. History
  2.1 General
    ...
  2.2 Prehistory to post-classical history
    ...
...
```

It can theoretically go to any level of depth.

The scraper to get the above data from wikipedia should get and format the data according to the schema, i.e. with proper hierarchy. Use the "load wiki" button to do so.

## **Tags**/**Categories** taxonomy

Please feel free to create any such taxonomies in the "/add" page.


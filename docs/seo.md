---
id: seo
title: Search engine optimization
sidebar_label: Search engine optimization
---

Search engine optimization (SEO) is a beast of its own and would require its own book. In this chapter I will introduce you to some tips and good to haves in your application if it is facing the public and search engines may crawl it. If it is an internal project then perhaps this section could be totally skipped.

Elderoost's SEO goals were to have good ranking for minimum amount of effort. In other words, I wanted to rank on the front page but anywhere within that page. To ensure best possible results available, I used the best bang for buck implementation of SEO in our project. I've included a checklist at the end of the section that can help you with SEO of your project.

## Minimum SEO

For each page, I recommend the following tags to be present in the `<head>` section of your application layout at the minimum.

```handlebars title="views/layout.hbs"
...

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{{title}}</title>
  <meta name="description" content="Changing the conversation when it comes to senior care." />
  {{#if canonical}}<link href="{{canonical}}" rel="canonical">{{/if}}
  <meta property="og:title" content="{{title}}" />
  <meta property="og:url" content="https://elderoostalpha.herokuapp.com" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Elderoost" />
  <meta property="og:description" content="Changing the conversation when it comes to elderly care." />
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@Elderoost">
  <meta name="twitter:creator" content="@alexkluew">
  <meta name="twitter:description" content="Changing the conversation when it comes to elderly care.">
  <meta name="twitter:title" content="{{title}}">
  <meta itemprop="name" content="{{title}}">
  <meta itemprop="description" content="Changing the conversation when it comes to senior care.">
</head>
...
```

What it comes down to is having a page title, page description, and the author for starters. I also recommend placing a canonical link the header tag. Then these three values are set in [twitter social cards](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started) or [open graph protocol](https://ogp.me). I would look up both of the formats to get familiar about what each tag expects as its value. The basic overview was outlined above.

How to figure out what text to put in my title and description attributes? If you are not dealing with a brand new field, I would look up competitive businesses and see how they structure their search engine and social media presence. Look at both static pages and dynamic results. For example, look up length of strings and type of words that are to be placed in those strings for similar html meta tags. Search what kind of descriptions and keywords that are popular or most relevant to your project. One good thing about SEO, is that it is structured similarly on optimized websites. Look at top businesses in your project’s field and see what they have in common in their meta tags. There bound to be some similarities as similar projects would aim for similar descriptions and titles in order to provide similar results on a search engine.

If you are in a brand new field, then I would look at your most favourite brand’s websites and see how they structure their data. Then I would rely on a search engine’s guidelines. See what kind of text or keyword data places where in the search results.

I usually spend some time per project on [Google’s Keyword Planner](https://adwords.google.com/aw/keywordplanner/home) or some similar keyword tool. I would look into what words would be relevant to my project and reference against my competition. Or in a case of a brand new field, I would test different keyword combinations for different pages and keep metrics.

## Schema.org

In this section we will be going over the ways that we can improve our project’s search engine physical appearance and results after we go live. Elderoost project comes with complete example of what an optimized application should aim to have. Every relevant page has the specific meta tags and descriptions set that are dynamic, and pertinent to the page’s context.

When working on SEO, my goal was to provide as much descriptive content about a specific context as possible. To get any real advantage of SEO, I needed to analyze my data. I needed to see if there was any ways to structure my data into known SEO entities. So, lets take an individual residence for example. For each section of our website we want to maximize amount of meta data that we can provide to a robot crawling our website for search engine results. In other words, you want to analyze your web pages and figure out which entities exist in which sections of the website. Then you should structure your meta data and test the implementation so that meta data is correct. I will first walk you through the way that you structure elements on a webpage using a specification below.

I analyzed my data and separated residence data by city and by province. When I did that, I noticed that this type of representation kind of looks like a breadcrumbs structure. That is exactly how I group this data in code. What you see below is that I call city an `ItemListElement` at position 2 and province as `ItemListElement` at position 1. These properties are part of the http://schema.org specification which teaches us just how to describe our data. The breadcrumbs in the user interface is implemented to look like this : `Ontario > Toronto`. I hope after reading this, you can appreciate why it looks like that in the UI.

```handlebars title="views/residences/show.hbs"
...
<small class="padding-bottom" itemscope itemtype="http://schema.org/BreadcrumbList">
<span itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
<a itemprop="item" href="/residences/by-province/{{residence.address_state_slug}}" class="main__infobox__link">
<span itemprop="name">{{residence.address_state }}</span>
<meta itemprop="position" content="1" /></a></span>
<span  itemprop="itemListElement" itemscope itemtype="http://schema.org/ListItem">
<a itemprop="item" href="/residences/by-city/{{residence.address_city_slug}}" class="main__infobox__link">
<span itemprop="name">{{residence.address_city}}</span>
<meta itemprop="position" content="2" /></a></span>
</small>
...
```

In the code, like you see above, I would pay attention to itemscope, itemtype, and itemprop properties attached to various html elements.

Similarly, lets take a look at how I described a single residence entry using metadata :

```handlebars title=".views/residences/show.hbs"
<section class="main main-text-wrapper" itemscope itemtype="http://schema.org/Residence">
...
    <meta itemprop="sameAs" content="/residences/{{residence.slug}}" />
...
      <span itemprop="name">{{residence.name}}</span>
...
      <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
        <i class="fa fa-map-marker fa__mod" aria-hidden="true"></i>&nbsp;<span itemprop="streetAddress">
          {{residence.address_num}}&nbsp;{{residence.address_street}}
        </span>&nbsp;<br><span itemprop="addressLocality">{{residence.address_city}}</span>&nbsp;<span
          itemprop="addressRegion">{{residence.address_state}}</span>&nbsp;<span
          itemprop="postalCode">{{residence.postal_code}}</span><br>Canada
      </div>
      <span itemprop="hasMap"
        content="http://maps.google.com/maps?daddr={{residence.latitude}},{{residence.longitude}}"><a
          href="http://maps.google.com/maps?daddr={{residence.latitude}},{{residence.longitude}}"
          class="main__wrapper__link" rel="nofollow" target="_blank">Get directions<i class="fa fa-external-link"
            aria-hidden="true"></i></a></span>
      <div itemprop="geo" itemscope itemtype="http://schema.org/GeoCoordinates">
        <meta itemprop="latitude" content="{{residence.latitude}}" />
        <meta itemprop="longitude" content="{{residence.longitude}}" />
      </div>
...
	{{#each reviews as |review|}}
        <article class="individual-listing-review padding-top" itemprop="review" itemscope
          itemtype="http://schema.org/Review">
          <div class="review-rating">
            <div itemprop="reviewRating" itemscope itemtype="http://schema.org/Rating">
              <meta itemprop="worstRating" content="1">
              <meta itemprop="ratingValue" content="{{rating_value}}">
              <meta itemprop="bestRating" content="5">
              {{rating_value}}
            </div>
          </div>
          <div class="review-name" itemprop="name">
            <strong style="color: #111111">{{name}}</strong>
            <small style="color: #555555; font-style: italic;">by <span itemprop="author" itemscope
                itemtype="http://schema.org/Person"><span itemprop="author">{{author}}</span></span></small>
          </div>
          <div class="review-body" itemprop="description" style="color: #4a4a4a">
            {{description}}
          </div>
        </article>
        {{/each}}
...
```

There is quite a bit of meta data there to describe a single residence but it is mostly the same data which is displayed on each page. How convenient?! Basically, in the meta data above, I described a senior residence name, the address, geolocation coordinates, map link to google’s map. I also described all of the possible reviews and their meta data. Each review has a rating between 1 and 5, an author, and a text description. All of this information is displayed for the user to understand and for the robots to reference about our data.

Once completed the code, you can test your metadata by a service such us one provided by google and looks like this

![Structured data testing tool from Google](../static/img/breadcrumb-residence-structure-screen-google.png)

:::note Download `views/residences/show.hbs` template

Download complementary completed `views/residences/show.hbs` template [here](https://bit.ly/residences-show).
:::

## Sitemap

Do not forget to also send a sitemap representation of the application to the search engines. This way all of the SEO work will be actually found once their bots visit your submitted URLs in the sitemap format. In our procedure we will be using the sitemap module. It creates the proper sitemap for us which we will then gzip on our own. The only manual task for now is the generation of the residences URL text file as input to the sitemap.

Since this is a manual task, there is a route which you have to uncomment in the `residences.js` router handler file.

```js title="routes/residences.js"
// ...
router.get('/api/string', async (req, res, next) => {
  const residences = await Residence.findAll(); //<1>
  if (residences) {
    var str = ''; //<2>
    for (var residence of residences) {
      str = str + `https://domain.com/residences/${residence.slug}\n`;
    }
    res.send(str); //<3>
  }
});
// ...
```

- <1> Find all Residence data
- <2> This data we will convert to a single string which we will use as input to the sitemap module
- <3> Send the data which we then copy and paste into `./config/sitemap-list-of-urls.txt`

When we obtain all of our link data, we can proceed to generate the sitemap. I added the command to my `package.json` like so

```json title="package.json"
// ...
"sitemap": "npx sitemap < ./config/sitemap-list-of-urls.txt > ./config/sitemap.xml", //<1>
"sitemap:gzip": "gzip -c ./config/sitemap.xml > ./public/sitemap.xml.gz" //<2>
// ...
```

- <1> Generate the sitemap `xml` file from the input
- <2> Gzip the file and paste into the appropriate place in `public` folder

All you have to do now is figure out how to submit the sitemap url to the search engines. Each engine has their own way.

## Social share images

Before working on this section in the project, we had decent SEO because we worked on it in the previous section. With our current code, when someone shares our link on social media only textual data will be available to describe our URL due to our current tags. So, when someone shares the link to the project on twitter, for example, then the following card will pop up based on our provided meta-data :

![Card preview screen version 1](../static/img/card-preview-screen-v1.png)

While that is better than sharing a simple link, and clearly dynamic, I could take this a bit further by adding an image to the card. This way, when someone will share our link in the future our card will look like this :

![Card preview screen version 2](../static/img/card-preview-screen-v2.png)

I wanted to do exactly as the image above shows. I wanted to add this dynamic image to my social media cards which show up whenever someone shares this project’s url. Moreover, I wanted this image to be generated on the fly by the server. To test my implementation, I used twitter's [card preview feature](https://cards-dev.twitter.com/validator).

In my express.js app I wanted to see if I could generate images of a web page. So, I went with the idea of taking web page screenshot and, then, using this screenshot as my social media card. This is done by setting the two image properties in my meta tags (just as I show you below) :

The two SEO image tags that I needed to be dynamic were : `og:image` and `twitter:image`. I adjusted the express.js project by going into my handlebars.js layout template and adding an if statement.

The if statement simply looks for the presence of `page_image` variable as one of the attributes passed on to the template. If the variable exists, then simply populate its content wherever we need it. Or, in other words :

```handlebars title="layout.hbs"
{{#if page_image}}
<meta name="og:image" content="{{page_image}}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{{page_image}}">
{{else}}
<meta name="twitter:card" content="summary">
{{/if}}
```

From above, `page_image` variable holds just a simple string that show the location to my dynamic image generation function. The string is a combination of simply taking a residence `slug` and adding `/image` to it.

So, if I was rendering the following page `https://elderoostalpha.herokuapp.com/residences/elim-village-british-columbia-reviews` then the image url will be `https://elderoostalpha.herokuapp.com/residences/elim-village-british-columbia-reviews/image`

This string is just passed on as data to the template.

For example, the following code..

```js
res.render(`templateName`, {
  page_image: `https://elderoostalpha.herokuapp.com/residences/carolina-retirement-suites-ontario-reviews/image`,
});
```

would translate to the if statement above evaluating to true, in the handlebars.js template, and the attached html code of the block was :

```handlebars title="layout.hbs after evaluating the content"
<meta name="og:image" content="https://elderoostalpha.herokuapp.com/residences/carolina-retirement-suites-ontario-reviews/image">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://elderoostalpha.herokuapp.com/residences/carolina-retirement-suites-ontario-reviews/image">
```

Perfect, now our routes are dynamic just like I wanted. Now, I needed to implement the actual `router.get('/image')` function. We go to our terminal and type in the following to install puppeteer and add it to our project :

### Puppeteer

```bash title="Install puppeteer"
npm install --save puppeteer
```

Then we just code the end point that we want above. Mine looked like this :

```js title=".routes/residences.js"
// ...
const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
// ...
// equivalent to :
// https://elderoostalpha.herokuapp.com/residences/:slug/image
router.get('/:slug/image', async (req, res, next) => {
  const { slug } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://elderoostalpha.herokuapp.com/residences/${slug}`);
  const screenshot = await page.screenshot({
    type: 'png',
    encoding: 'binary',
  }); //<1>
  await browser.close();
  res.header('Content-Type', 'image/png'); //<3>
  res.send(screenshot); //<2>
});
// ...
module.exports = router;
```

- <1> We conveniently just save screenshot as binary output
- <2> Then our response sends that binary data and it displays as an image
- <3> when we set the `content-type` of the response to `image/png`.

Success! We added a new `get /residences/:slug/image` route that sends a dynamic screenshot image of the webpage and we mainly did this for improving our SEO value proposition.

Just as the section introduction shows, the newly created dynamic image adds a bit more value to the existing social cards. Your cards now show to the user exactly what the page looks like before they think of clicking on the social card to view it. If they click on the card and go to the actual page, then they view a familiar UI that was presented to them in the social card. This concluded our current SEO optimization. By the end of this section, my layout template had the [following tags](seo#minimum-seo).

And there we have it. Our residence entry has a card with a beautiful generated image on it when someone shares our project on social.

![Card preview screen version 2](../static/img/card-preview-screen-v2.png)

:::note [NOTE]
Now, having gone through all of the trouble of creating this, I am going to tell you not to use it like this in production. You see, there is some delay between starting up the puppeteer and returning a screenshot of a web-page. This delay is unfortunately much longer than the time it takes a social media card to load to a user. Thus, if you are running this code on your own server you may notice some cards require a refresh before they appear.
:::

An alternative solution would be to use this script, create all of the dynamic images, and save them somewhere where you would serve them instead of dynamically generating on the fly. A typical place to serve your assets is something like an Amazon’s S3 bucket. This way, you would change your code to serve the generated image rather than a dynamic one. You could also save these images on your server for each entry. For example, save it into your public folder under a specific name and add an attribute to your residences model to tell it the file that it needs to request from your public folder.

You can get creative and have a robot that updates all of these images and generates new ones, suppose once a day, or something like that. This depends on how often your layout changes and whether or not new images are providing much value to the social sharing.

Another solution would be to use a service that specializes in generating screenshots from urls. However, both, the AWS S3 bucket and an external API would have to be extra costs that you need to incorporate to your project.

## SEO Checklist

Here is a checklist that will help you stay on track with SEO on your website or application

- [ ] Switch To HTTPS
- [ ] Set Up Google Search Console
- [ ] Set Up Google Analytics
- [ ] Set Up Bing Webmaster Tools
- [ ] Create XML `Sitemap`
- [ ] Create and add a `robots.txt` file to your site
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Submit `sitemap.xml` to Bing Webmaster Tools
- [ ] Fix Crawl Errors
- [ ] Fix Broken Links
- [ ] Fix Any Missing or Duplicate `Meta` Tags
- [ ] Keep Your URLs Short, Descriptive
- [ ] Add Schema.org Description (where relevant)
- [ ] Use a Keyword Research Tool
- [ ] Optimize the Readability of Your Content
- [ ] Add Your Keyword to Your `Title` Tag
- [ ] Add Your Keyword to Your `Meta` Description
- [ ] Add Your Keyword to Your `H1` Tag
- [ ] Include Your Keyword in the `Body` of the Page
- [ ] Find long-tail keyword variations and use in the `Body` of the Page
- [ ] Label Your Images with Descriptive `ALT` Tags
- [ ] Use Internal Links
- [ ] Link to Authoritative Sites
- [ ] Reverse-Engineer Your Competitors’ Links and `Meta` Tags, Keywords
- [ ] Make Sure Your Site Doesn’t Have Duplicate Content
- [ ] Claim Your Brand Name on as Many Social Networks as Possible
- [ ] Make Your Site Mobile Friendly
- [ ] Speed Up Your Site
- [ ] Using WordPress Software? Install Yoast SEO Plugin
- [ ] Add Social Sharing Images
- [ ] Add Tags and Categories

---
id: introduction
title: Introduction
sidebar_label: Introduction
---

## Background

Project [“Elderoost”](http://elderoostalpha.herokuapp.com) is a full-stack senior residence application in which users can search, review, and add residence information. It was created with intention of providing useful information about a specific retirement home for future residents. Moreover, there was an aim that the application would provide a safe space for residents of these senior residences to review their living environments. Some of the general requirements that I created for this project :

- Node.js
- PostgreSQL database
- SEO optimized
- Responsive design
- Fast loading times
- JavaScript codebase
- Minimum dependencies
- Interactive maps
- Legible font
- Handlebars templates
- Fast search
- User accounts
- Administrative Dashboard
- Comments
- Reviews
- News Articles
- Email notifications

Prior to beginning the project, I created several requirements. First and foremost, I wanted it to be written in JavaScript using Node.js. Next, I wanted to use the PostgreSQL database as my data storage of choice. One of the reasons for selecting PostgreSQL is that it has a wonderful PostGIS extension which makes interacting with geolocation data much easier than other solutions.

The end goal of the application would be to index well in the search engines. This is done primarily through search engine optimization (SEO) work, responsive design, and fast loading times on mobile and on desktop. To stick to these requirements, I made sure to use the minimum amount of dependencies that I needed in order to run the project.

Moreover, I wanted the actual search to be visual and done via interactions with some sort of a map. The reason for this was simple, when searching for a new residence I wanted the user to search by area first and other information second. Map interface when it comes to searching by geographical area comes natural.

I wanted to provide to the user a secondary way of searching that was not reliant on a map. Thus, Elderoost should retrieve residence entities through textual search means and not visual alone. Next, I wanted to ensure that there were secure user accounts. This decision was two fold : (1) I wanted to keep the data and not offload it to a 3rd party social login solution, and (2) I wanted to obtain email addresses of users such that I could notify them of product updates. Thus, I also had a requirement that there would be automated notifications to the users via email.

Finally, the project should maintain some sort of an administrative dashboard to manage all of the data. Therefore, there needed to be some kind of roles implementation for authorization part of the application. A regular user shouldn’t be able to access this dashboard.

I hope that you can see similarities of this project that could be transferred to your daily JavaScript workings. Features, such as secure user accounts, are useful and are required in many modern applications.

## Users

Prior to going through the code, I wanted to go through the three different users in the application and their individual use cases. This provided me some guidance during the building phase of the project.

<figure>
  <img
    src={require('../static/img/users-usecases.png').default}
    alt="User use cases design"
  />
  <figcaption>User use cases design.</figcaption>
</figure>

Elderoost has three types of users : (1) a guest user, (2) registered user, and (3) an admin user. I wanted the guest to use the application but be directed towards creating an account and opening an array of features once they did that. However, I understood that not everyone wants to create an account so I wanted to leave some core features available for the guest. I wanted them to be able to browse the content and to search through the content. Beyond these two tasks, the guest user should be directed to creating an account feature.

Once a user registered, they are opened up to the “default feature” list that I show in the graphic above. Besides the typical user management, the user has the ability to add more data to our project. This decision to force user accounts was made to minimize the amount of spam and increase value when compared to a guest user account.

An admin user would then have access to all of the features of the guest user and a regular user, with the added benefit of an added administrative dashboard. In the dashboard, I wanted the user to have control over the residences and news articles. However, it did not make sense to allow admin users to create reviews or submit them on someone else’s behalf. Also, the control of the users would be done solely by interacting with the database. I did not want to build an interface for this entity.

## Architecture

One of the requirements for project Elderoost was to maintain the dependency list to a minimum.

<figure>
  <img
    src={require('../static/img/overall-architecture-screen.png').default}
    alt="Project Elderoost application architecture overview"
  />
  <figcaption>Project Elderoost application architecture overview</figcaption>
</figure>

Let’s take a look at the overall application architecture. I can do that through the analysis of the packages that are required to run everything. Node.js shines in the composition of different modules that bring the overall application to life. This, also, means that you have to be careful in the packages that you pick and ensure that you don’t pick an old and outdated package.

In the image above, I grouped some of the modules by their function in the application. Let’s take a look at the modules and see where each one fits in

| Module            | Purpose                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| express           | Application server responsible for our app's functionality                                             |
| path              | Core node.js module that allows us to specify locations within our project                             |
| cookie-parser     | Parse cookies                                                                                          |
| generate-password | Used to generate secure password reset token                                                           |
| client-sessions   | Module used for creation of `session` object to maintain user data and maintenance of encrypted cookie |
| bcrypt            | Used to encrypt password into a hash                                                                   |
| hbs               | Handlebars templating engine that allows us to create views using hbs templating language              |
| morgan            | Logging helper                                                                                         |
| helmet            | Improves security of the application                                                                   |
| sendgrid/mail     | Send transactional emails to our users                                                                 |
| sequelize         | Module responsible for interactions with our database of choice                                        |
| pg                | PostgreSQL connector                                                                                   |
| pg-hstore         | PostgreSQL connector                                                                                   |
| csurf             | Module responsible for CSRF protection and adding csrf token to our request object                     |
| sitemap           | Module responsible for generating a proper sitemap which is then submitted to the search engines       |

## Folder Structure

If we take a look at how node.js application works along with the express framework, we can see a close resemblance to the [model-view-controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (MVC) model. Thus, the basic idea about the project’s file structure is around the MVC architecture. It feels natural to structure the project this way.

<!-- ![Node.js app simplified](../static/img/folder-structure-screen.png) -->

<center>
  <img
    src={require('../static/img/folder-structure-screen.png').default}
    alt="Node.js app simplified"
    width="250px"
  />
</center>

When a client opens up a web browser and types in the app’s URL, our express web-server catches the request and passes on to its router object. Here in the process express framework does a check if the URL is good and we can proceed, or it is a bad URL and an error is spit back out to the user. The diagram on the left assumes a correct user-flow.

The router then looks at the appropriate route handler to pass on the request. In our case, our route handlers are conveniently located in the `/routes` folder of the project.

From the router handler, our app can interact with our models that are located in our database and then pass this data on to the handlebars view. However, the handler doesn’t necessarily interact with our models and it can just send a response with a specific handlebars view.

And finally, the response is sent to the client.

Within our project, then JavaScript code that is pertinent to interacting with models is placed in the `/models` folder; code that is the core business logic, is placed in the `/routes` folder; and our views are placed in the `/views` folder.

The finished folder structure looks like this :

```bash
.
├── app.js <1>
├── config <2>
│   ├── db.js
│   ├── db.seed.js
│   ├── sitemap-list-of-urls.txt
│   └── sitemap.xml
├── models <3>
│   ├── news_article.js
│   ├── residence.js
│   ├── review.js
│   └── user.js
├── package.json
├── public <4>
│   ├── images
│   ├── javascripts
│   │   ├── fuse
│   │   │   └── fuse.min.js
│   │   ├── images
│   │   │   ├── search.png
│   │   │   └── search_input.png
│   │   ├── leaflet
│   │   │   └── leaflet.min.js
│   │   ├── leaflet-fusesearch
│   │   │   ├── leaflet.fusesearch.css
│   │   │   └── leaflet.fusesearch.js
│   │   └── leaflet-markercluster
│   │   └── leaflet.markercluster.js
│   ├── sitemap.xml.gz
│   └── stylesheets
│   └── style.css
├── routes <5>
│   ├── dashboard.js
│   ├── index.js
│   ├── residences.js
│   └── users.js
└── views <6>
│   ├── dashboard
│   ├── residences
│   ├── static
│   ├── users
│   ├── error.hbs
│   ├── index.hbs
│   └── layout.hbs

```

- <1> `app.js` starts the entire application
- <2> folder in which all of the configurations go. In this case, I only have the database configuration file, the database seed file, and 2 files which are related to the generation of sitemap
- <3> folder in which all of the models reside
- <4> folder contains assets that I want my app to use during production. I further separated by creating an `images`, `javascript`, and `stylesheets` folders in order to create separate places to place similar format files.
- <5> folder contains the router handler logic for specific sections of the app
- <6> folder contains the user interface screens for the application

## Templates

Project Elderoost uses [handlebars](https://handlebarsjs.com/) (hbs) templating language for displaying its HTML content. Handlebars is super easy to learn and get a hang off. It is one of the choices among several for the express viewing engine. I wont focus on the specifics and leave that up to you for some play. However, I believe that by going through the book and looking at the sample code you will be able to get the gist of the language without needing to look elsewhere.

The way that the templates work is that there is a generic `layout.hbs` file which handles the overall template for your application. This is where you would insert your `html`, `css`, or `javascript` import script statements. The actual, default, location for views that will be displayed using this `layout.hbs` is located in the `views` folder.

The templates themselves are written in the handlebars templating language which is basically a superset of HTML. Each template file ends in `.hbs` file extension. For example, `views/index.hbs` is the main screen for the project.

The main take away for the hbs templating language is that it uses curly braces `{{ somevariable }}` to evaluate javascript in its code. For example, suppose the following function is supposed to render a residence template and I set a variable that will be accessible in a template. To do this, simply pass on your variable as an object to the `res.render` function, like so :

```js title="route.js"
async function (req,res,next) {
  const id = req.id;
  const residence = await Residence.findOne({where: {id: `id`}}); <1>
  const data = { residence: residence };

  res.render('residence', data);
}
```

- <1> I assume that the residence object in the code above has address property that tells you where the residence is located.

Then, in your `residence.hbs` template file, you would simply catch the javascript object and unwrap its value to be used however you want. For example, suppose we just want to catch the variable and print the residence’s address property. I would do it like so :

```handlebars title="residence.hbs"
<p> Residence is located at {{residence.address}} </p>
```

And the code above would generate HTML output with the value that is set on our residence object’s address property. Simple!

The other two useful demonstrations of the templating language would be : (1) conditionals and (2) loops. [Conditionals](https://handlebarsjs.com/guide/builtin-helpers.html) only execute the code if the variable in the expression is available to the template and are executed like so :

```handlebars title="residence.hbs"
{{#if residence}}
<p> Residence is located at {{residence.address}} </p>
{{/endif}}
```

When working with loops, when you have a collection of data, the syntax is a bit different and looks like so :

```handlebars title="residence.hbs"
{{#each residences as |residence|}}
<p> Residence is located at {{address}} </p>
{{/each}}
```

The difference lies in the fact that you don’t need to prepend _residence_ object to the evaluating expression. Simply pass in the appropriate property that you want displayed.

The last thing that I want to cover is the two types of templates that typically exist in a project. Dynamic There are two types of templates in the project : (1) static content that rarely changes, and (2) dynamic content that gets generated per request.

### views/layout.hbs

In addition to the [header](seo.md#minimum-seo) code that I insert into my layout, I also add the following main navigation section that looks different depending on the type of the user and whether or not the user is logged in. It looks something like this:

```handlebars title="views/layout.hbs navigation bar code"
<body>
  <header class="header">
    <nav class="navbar">
      <div class="navbar__branding">
        <span class="navbar__branding__title"><a href="/?ref=navbar" class="navbar__branding__title__action">ELDEROOST</a></span>
      </div>
      <ul class="navbar__actions">
        <li class="navbar__actions__list"><a href="/residences?ref=nav" class="navbar__actions__list__item">Explore</a>
        </li>
        <li class="navbar__actions__list"><a href="/about?ref=nav" class="navbar__actions__list__item">About</a>
        </li>
        <li class="navbar__actions__list"><a href="/search?ref=nav" class="navbar__actions__list__item">Search</a>
        </li>
        {{#if user}} <1>
        {{#if user.is_admin}} <2>
        <li class="navbar__actions__list"><a href="/dashboard?ref=nav" class="navbar__actions__list__item">Dashboard</a>
        </li>
        {{/if}}
        <li class="navbar__actions__list"><a href="/users/profile?ref=nav" class="navbar__actions__list__item">Profile</a>
        </li>
        <li class="navbar__actions__list"><a href="/users/logout?ref=nav" class="navbar__actions__list__item">Logout</a>
        </li>
        {{else}} <3>
        <li><a href="/users/signin?ref=nav" class="button reversed-is-primary navbar__actions__list__item-remove-underline" rel="nofollow" aria-label="Login to Elderoost" title="Login to Elderoost">Login</a>
        </li>
        {{/if}}
      </ul>
    </nav>
  </header>
  {{{body}}} <4>
```

- <1> If a user is logged in they get option to view their profile and to logout
- <2> If a user is admin, they also get link to Dashboard
- <3> Otherwise, a guest user only sees Login link (in addition to Explore, About, and Search)
- <4> The content of each template will be inserted into here by the templating engine

What follows after the header, navigation, and body is simply the footer content for the template :

```handlebars title="views/layout.hbs footer template code left section"
  <footer class="footer">
    <div class="footer__interactions">
      <ul class="footer__actions">
        {{#if user}} <1>
        <li><a href="/users/logout?ref=footer" class="footer__actions__action" aria-label="Logout from Elderoost" title="Logout from Elderoost">Logout</a>
        </li>
        {{else}} <2>
        <li><a href="/users/signin?ref=footer" class="footer__actions__action" aria-label="Login to Elderoost" title="Login to Elderoost">Login</a>
        </li>
        {{/if}}
        <li><a href="/about?ref=footer" class="footer__actions__action" aria-label="What is Elderoost?" title="What is Elderoost?">What is Elderoost?</a>
        </li>
        <li><a href="/privacy?ref=footer" class="footer__actions__action" aria-label="Privacy Policy" title="Privacy Policy">Privacy Policy</a>
        </li>
        <li><a href="/tos?ref=footer" class="footer__actions__action" aria-label="Terms of Use" title="Terms of Use">Terms of Use</a>
        </li>
      </ul>
    </div>
```

- <1> If user is logged in, show logout function
- <2> Else, if a guest user then show login function

```handlebars title=".views/layout.hbs footer template code center social icons"
    <div class="footer__interactions-secondary">
      <div><span class="navbar__branding__title">ELDEROOST</span><small>© 2017-2020</small></div>
      <div>
        <ul class="footer__interactions-secondary__social">
          <li class="footer__interactions-secondary__social__list"><a href="https://twitter.com/Elderoost" class="footer__interactions-secondary__social__list__action" target="_blank" aria-label="Follow us on Twitter" title="Follow us on Twitter"><i class="fa fa-twitter-square" aria-hidden="true"></i></a>
          </li> <1>
          <li class="footer__interactions-secondary__social__list"><a href="https://instagram.com/Elderoost" class="footer__interactions-secondary__social__list__action" target="_blank" aria-label="Follow us on Instagram" title="Follow us on Instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a>
          </li> <2>
          <li><a href="https://www.facebook.com/Elderoost" class="footer__interactions-secondary__social__list__action" target="_blank" aria-label="Follow us on Facebook" title="Follow us on Facebook"><i class="fa fa-facebook-square" aria-hidden="true"></i></a>
          </li> <3>
        </ul>
      </div>
```

- <1> Twitter
- <2> Instagram
- <3> Facebook

```handlebars title="views/layout.hbs footer template code right studio link"
      <div>
        <small>Another <a href="https://getaclue.me" class="footer__interactions-secondary__social__list__action" title="Go to Alex Kluew"><strong>getaclue</strong></a> Production</small>
      </div>
    </div>
  </footer>
</body>
```

:::note Download completed `views/layout.hbs` code
Looking for `views/layout.hbs` completed code? Download complementary `views/layout.hbs` code [here](https://bit.ly/2VlBOvZ).
:::

### views/index.hbs

For this file we first begin by loading the dependencies to constructing our leaflet map. In our project it is a combination of provided library code and external calls. Feel free to modify this code as you wish just ensure the library versions are the same. I noticed at one point that some libraries do not jive well if some libraries are running on the latest everything. I recommend using the libraries provided with this book. The code looks like :

```handlebars title="views/index.hbs beginning code piece"
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin="" />
<script src="/javascripts/leaflet/leaflet.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css" crossorigin="" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
  crossorigin="" />
<script src="/javascripts/leaflet-markercluster/leaflet.markercluster.js" crossorigin=""></script>
<script src="/javascripts/fuse/fuse.min.js"></script>
<link rel="stylesheet" href="/javascripts/leaflet-fusesearch/leaflet.fusesearch.css" />
<script src="/javascripts/leaflet-fusesearch/leaflet.fusesearch.js" crossorigin=""></script>
```

I would copy paste the code at this point as we will look at these modules in greater detail at different points of this book. What follows next is a conditional code block that displayes latest residence updates, if there are any to display. When is a case that there is nothing to display? If you are using a custom query or if it is a brand new project =) Otherwise, it is just a precaution and the code looks like this :

```handlebars title="views/index.hbs code continuation"
<section class="main main-text-wrapper" style="padding-bottom:0">
  <div class="main__wrapper-purple padding-left padding-right">
    <h1 class="main__wrapper-purple__text">
      Explore senior care residences near you
    </h1>
  </div>
  {{#if residences}}
  <div class="main__wrapper main__negative-top-margin" style="max-width:964px;border:1px solid #344e86;">
    <div class="padding-left padding-right">
      <h3 style="display:flex;align-items:center;"><i class="fas fa-address-card fa__mod"
          aria-hidden="true"></i>&nbsp;Recently updated residences</h3>
      <ul class="main__wrapper__list">
        {{#each residences as |residence|}}
        <li class="main__wrapper__list__item"><a class="main__wrapper__link"
            href="/residences/{{slug}}?ref=recently_updated">{{name}}</a><br><em>{{address_city}},
            {{address_state}}</em>
        </li>
        {{/each}}
      </ul>
    </div>
  </div>
  {{/if}}
```

After that code, we begin the custom map construction of the area and the side button controls that take you quickly to a specific province

```handlebars title="views/index.hbs map construction beginning"
<div class="main__wrapper-main-map" style="border-radius:5px;max-width:964px;border:1px solid #344e86;">
  <div class="padding-left padding-right">
    <p class="main__text-small"><i class="fa fa-info-circle" aria-hidden="true"></i> Drag around the map to find
      elderly care residences in your region.</p>
  </div>
  <div class="main__wrapper-main-map-with-filter">
    <div class="main__wrapper-main-map-with-filter__wrapper">
      <small><strong>Filter by Province</strong></small>
      <ul class="main__wrapper__list-filter">
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button"type="button" name="jump-to-BC">BC</button></li> <1>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-AB">AB</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-SK">SK</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-MB">MB</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-ON">ON</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-QC">QC</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-NB">NB</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-PEI">PEI</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-NS">NS</button></li>
        <li class="main__wrapper__list__item-filter"><button class="main__wrapper__list__item-filter__button" type="button" name="jump-to-NL">NL</button></li>
      </ul>
    </div>
```

- <1> Province short code button to jump on the map on press

Then we procede to construct the map itself

```handlebars title="views/index.hbs map construction"
<div id="map" class="map main__wrapper-main-map-with-filter" style="width:100%;">
  <script type="text/javascript">
  !function(e){L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",{attribution:`&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, &copy; <a
      href="https://carto.com/attribution" > CARTO</a> `}).addTo(e),document.addEventListener("DOMContentLoaded",function(){try{let a=fetch('/residences/api').then(result=>result.json()).then(data=>{ //<1>
        const t=L.geoJSON(data,{pointToLayer:function(e,t){return L.marker(t)},onEachFeature:function(e,t){e.layer=t;t.bindPopup("<div><h3>"+e.properties.name+"</h3><span>"+`<i class="fa fa-map-marker fa__mod" aria-hidden="true"></i>&nbsp;`+e.properties.address+'</span><br><a href="/residences/'+e.properties.slug+'?ref=home_map_popup">View details</a></div>') //<2>
      }});var n=L.markerClusterGroup({chunkedLoading:!0,showCoverageOnHover:!1});n.addLayer(t);e.addLayer(n);const i={_map:e,position:"topleft",title:"Search",panelTitle:"",placeholder:"Search",caseSensitive:!1,threshold:.5,maxResultLength:null,showResultFct:null,showInvisibleFeatures:!0};var o=L.control.fuseSearch(i);o.indexFeatures(data,["name","address"]);//<3>
      e.addControl(o)});
```

- <1> `API` end point for our [geoJSON data](maps.md#geojson) we request during map construction
- <2> Popup on each marker that gives you a link to the specific residence based on their slug
- <3> Index fuse search plugin using `name` and `address` properties of each residence

```handlebars title="views/index.hbs map construction"
document.getElementsByName("jump-to-QC")[0].addEventListener("click",function(){e.setView([45.593,-73.504],7)}),document.getElementsByName("jump-to-ON")[0].addEventListener("click",function(){e.setView([43.606,-79.843],7)}),document.getElementsByName("jump-to-NB")[0].addEventListener("click",function(){e.setView([46.61,-65.945],7)}),document.getElementsByName("jump-to-NS")[0].addEventListener("click",function(){e.setView([45.056,-63.397],7)}),document.getElementsByName("jump-to-PEI")[0].addEventListener("click",function(){e.setView([46.288,-63.419],7)}),document.getElementsByName("jump-to-NL")[0].addEventListener("click",function(){e.setView([47.475,-52.85],6)}),document.getElementsByName("jump-to-MB")[0].addEventListener("click",function(){e.setView([51.382,-98.811],7)}),document.getElementsByName("jump-to-SK")[0].addEventListener("click",function(){e.setView([51.669,-106.622],7)}),document.getElementsByName("jump-to-AB")[0].addEventListener("click",function(){e.setView([53.55,-113.994],6)}),document.getElementsByName("jump-to-BC")[0].addEventListener("click",function(){e.setView([53.403,-126.387],5)//<1>
})}catch(t){let n=L.marker([43.6426,-79.3871]).addTo(e);e.setView([43.6426,-79.3871],13),n.bindPopup(`Oops, looks like we had a problem loading the map =(<br><strong>But,do not worry!</strong><br>You can still <a href="/search?ref=home_map_popup_failed" class="main__wrapper__link">Search</a> or <a href="/search?ref=home_map_popup_failed" class="main__wrapper__link">Switch to list view</a>.`).openPopup() console.error(`error :`,t)}})}(L.map("map",{scrollWheelZoom:!1}).setView([45.416191,-75.691727],5))</script>
</div>
```

- <1> In the code above we bind on click events that activate the buttons for each province click. `e` is the identifier for our map; `setView` is the function that changes where the map will be changed its view to based on input of `[53.55,-113.994],6` or an array and a number. Whenever a user clicks on the province short code, the map changes the location based on the coordinates provided above. Thus, this code show you how to interact with a map using external html elements like a button.

We finish off the template with a link to our residences in a list manner, in a table view; like so :

```handlebars title="views/index.hbs finishing code with a link to table list view"
    </div>
    <div style="display:flex; align-items:center; padding:1em;">
      <h3 style="padding-right:1em;">Not a fan of maps? <i class="fa fa-arrow-circle-right" aria-hidden="true"
          style="padding-left:0.5em"></i></h3>
      <a href="/residences?ref=main_page" style="flex-grow:1" class="button
      is-primary button__wrapper__a-remove-underline">View directory</a>
    </div>

  </div>
  <div class="main__wrapper-main-map padding-left padding-right"
    style="flex-direction: row; justify-content: space-around; align-items: center; margin-bottom:0;">
    <h2>Are we missing a residence?</h2>
    <a href="/residences/suggest-new?ref=main-page" class="button button__wrapper__a-remove-underline"
      aria-label="Add a missing residence" title="Add a Residence">Suggest a missing residence</a>
  </div>
</section>
```

:::note Download completed `views/index.hbs` code
Looking for completed `views/index.hbs` code? Download complementary `views/index.hbs` code [here](https://bit.ly/2zbtd6h).
:::

## Cascading style sheet

Project Elderoost was designed with [WCAG 2.0 AAA](https://webaim.org/resources/contrastchecker/) color palette in mind. If you have suggestions or improvements, feel free to reach out and contact me.

:::note Download custom css
Feel free to download the custom _css_ file and use this custom style sheet located [here](https://bit.ly/34SaDw4) in your project.
:::

![gist.github.com link to custom Elderoost css](../static/img/style-sheet-screen.png)

I used Block, Element, Modifier (BEM) css style convention for my naming of css variables. You can read more about BEM [here](https://css-tricks.com/bem-101/). For some backgrounds I used [hero patterns](http://www.heropatterns.com/).

## Forms

I am going to assume for the duration of the project that you are aware about one of the most common security flaws for a website : cross site request forgery (csrf)<sup>[see [https://en.wikipedia.org/wiki/Cross-site_request_forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery) or [https://owasp.org/www-community/attacks/csrf](https://owasp.org/www-community/attacks/csrf)]</sup> In order to mitigate this attack, we are going to use the `csurf` node.js module. We first add it in our `routes/users.js` file like so

```js title="routes/users.js"
const csrf = require('csurf'); // <1>
const csrfProtection = csrf({ cookie: true }); // <2>
```

- <1> import the csurf module
- <2> set the token mechanism to be initialized and to be ready to be passed along via cookies

Then, we simply focus on how to use it. We need to use the `csrfProtection` function in our routers as needed.

- case one:
  for `get` router handlers, by adding `csrfProtection` function handler gives the request object `csrfToken()` function that passes on a csrf token to be used by a form.

- case two:
  for `post` router handlers, `csrfProtection` function ensures that the csrf token matches from the form data. If the token does not match, then the router handler throws an error and everything stops.

```js title="Case one: get router in routes/users.js"
router.get('/signin', csrfProtection, (req, res, next) => { <1>
  res.render('users/sign-in', {
    title: `Login - Elderoost`,
    csrfToken: req.csrfToken(), <2>
  });
});
```

- <1> Attach `csrfProtection` to the `/signin` `get` route
- <2> Pass `csrfToken` variable to the `views/users/sign-in.hbs` template to be used as a hidden input in a form

```js title="Case two : post router in routes/users.js"
router.post('/signin', csrfProtection, async (req, res, next) => { <1>
  const { email, password } = req.body;
```

- <1> By attaching `csrfProtection` route handler, this router handler now expects a csrf token to be passed along with other information

Moving forward I will assume that you will understand where the csrf token is coming from in various sections of the application.

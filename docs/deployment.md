---
id: deployment
title: Deployment
sidebar_label: Deployment
---

Now that you are happy with your project and how it behaves on your local environment, you are probably looking for a way to share your project with the public. In this chapter, I will be going over the various tools and procedures that are available to you. However, I will focus on deploying our project to the [heroku](https://heroku.com) platform.

:::note development
synonymous with application being worked on state; usually not used by the public and worked on locally
:::

:::note production
synonymous with application being in the state that is being served to public and used by customers
:::

The deployment also depends on each project and the access to funds available. There are free solutions available that are perfect for small projects. However, once you start working with real projects, cost will have to play a factor in deciding how to deploy your application to production stage. Moreover, the cost and skills required to run the infastructure should also play a role.

## ngrok.com

You know how you cannot just easily share your `http://localhost:3000` project link with someone? You need to play with your system settings or your router setup. It can be a hassle and time consuming; and this is where ngrok shines.

![Ngrok acts like a middleman between your local code and whoever you share the link with](../static/img/localhost-ngrok-client.png)

Ngrok is a wonderful step before production deployment. What ngrok allows you to do is to create a sharerable link that proxies to your local environment. All you have to do is register for the tool and pick the plan that you want to use. I recommend the free tier for testing purposes.

Then you download their command line interface tool, as described on their website, and just run it. Once you are ready to share a working application, start the server on `localhost` and remember the `port`. When everything is running, run ngrok tool over the port that the application is running. That is all. Ngrok will do all of its magic for you and give you a link to share with your users or clients.

## Heroku

Deploying your project to heroku is one of the fastest and easiest solutions available out there. Heroku empowers you and enables you to focus on just your project. Why is that a big deal? Before running our node.js project, a server needs to be provisioned and setup. This takes time and resources. Only after the server and the environment is setup, then you can create some deployment procedure.

Whereas, in heroku all you have to do is deploy and the platform focuses on the server part. This is obviously a trade off. Heroku has done a lot of work in the background to make this as easy as possible for end users and timely. For this, they charge a fee and this is how they make their money.

While your project is small, and while you scale, heroku is a viable resource and a timesaver. But, I should mention that sooner or later you will need to look at server skills or hiring someone. Why? Cost. As your project scales on heroku, you will need more resources to make everything run smoothly. At one point you will notice that some things could be done cheaper, if the knowledge is there. So it is a trade off.

Heroku not only shines at its ease and time saving, but also in integrating with many add-ons and platforms. They make adding beautiful logging service, a database, or a mailer (among many other things) with a click of a button and some ready-to-paste code. They really made their platform wonderful and hard to switch away from.

:::note Git
Heroku and their tools require that git is installed on your system before fully working. If this is a problem then heroku may not be a suitable solution. However, I recommend that you spend some time learning git and, ultimately, github. Don't be afraid to just give it a shot. You only need basic knowledge in order for everything to run.
:::

So in order to deploy our project on heroku, you need to set everything up locally. You can read about the setup process on heroku's website located here : https://devcenter.heroku.com/articles/getting-started-with-nodejs Just substitude our project for the example code provided in the tutorial and everything should work. After running through the setup, our project was uploaded to heroku, heroku processed it, and finally it ran `node app.js`; which started our application.

The next time you want do adjust your code and see it reflected you will only have to add your project to a latest git commit and type `git push heroku master`. Everything else will just work.

![Coding with git and heroku overview](../static/img/git-heroku-process.png)

However, nowhere in the chapter so far have we properly finished configuring our production setup. We got our code to be deployed to heroku. Heroku ran our code. But, where is our PostgreSQL database for example? Our application cannot work without a database.

This is where heroku shines. Open your browser, head over to heroku, login, and find your project. Once you click on your project, heroku will bring you to your project's dashboard. In the dashboard, look for an addons section and click `Configure Add-ons`

![Configure add-ons feature on heroku project's dashboard](../static/img/heroku-dashboard.png)

Then, from the addons you will need to find the following two addons :

- Heroku Postgres
- Papertrail

These two add-ons are the minimum that I recommend for a project. Postgres is, hopefully, self-explanatory in that it adds postgreSQL to your project. Moreover, heroku sets up an environmental variable called `DATABASE_URL` with the value to connect to this newly provisioned database.

If you recall during our [database setup](sequelize.js.md#configuration), we had an if statement that looked like this :

```js title="config/db.js"
if (process.env.NODE_ENV === 'production') {
  database = `${process.env.DATABASE_URL}`;
}
```

Hopefully you can now understand why I specifically put this code in there.

Meanwhile, I recommend to install the optional `Papertrail` plugin. It is a wonderful plugin to look at your errors while you develop. You can see everything that your main node.js process sees using this tool. For more robust logging tool, I would recommend something like `Rollbar`.

Finally, as I mentioned in the introduction to heroku, the platform has a very generous free tier. Then you can pay additional fees as you scale and the need for resources grows.

## Server

The most popular way to deploy applications is by the use of your own server. The biggest downside, if you consider it a down side of course, is that you have to do everything yourself or outsource that to someone. On the whole, there is a steep learning curve to server configuration and setup. However, the process is replicated once you learn it. If the knowledge is not necessary I still think this section is beneficial to read as I give a general overview.

:::note TIP
Don't forget about back-up services and redundancies. Once you begin growing, considering having at least three copies of a resource. Good rule of thumbs to have.
:::

For deploying of your server there are several solutions :

- Colocation
- In the cloud

### Colocation

Colocation -- you rent physical space and put your physical server in a building that is usually called a data center. This space may be local or you may have to travel to it. Depending on your resources available. However, you would want your server to have good resources such that you can serve your customers as fast as possible.

Sometimes these data centers have specific hardware that they sell, other times you may be required to build and bring the computer yourself.

### Cloud

In the cloud, or in other words, renting your server resources from someone who is selling their hardware. This is usually, once again, done by the data providers like Linode and major software companies like Amazon Web Services, Google Cloud, Microsoft Azure. The only difference is the type of data center that it is. Otherwise, some data centers allow for both renting of physical hardware and of virtually allocated hardware.

This is the most common solution. People rent virtually allocated machines and then set them up as they need them.

:::note NOTE
Remember, the more control you have about your infastructure the more risk you take for the running of the application(s). Think about redundancies and back-ups.
:::

### Running Server

Once you get everything running on a server, you will move into the maintenance phase of this current project. There will be a need to know when the application crashes or if the server goes down for some reason. It is probably a good idea for your server to use some 3rd party health check tool. You will want to be on top of your crashes so that your users experience the minimum amount of down time.

I would argue that you should have a health check for each of the major components of your application. In our case, that is the express server and the postgresql database. In production, I would want to know the health state for both of these components. This means additional code that needs to be built.

Then you should think about back-ups and the frequency of these back-ups. In our case, the only data that we have that is important is located inside the PostgreSQL database. Fortunately for us, PostgreSQL has a tool that allows for an export and import of data. So, I would run and export a copy of our data at least once a day. Usually, I use a time stamp for the filenames just for future readibility.

Don't forget to have at least several copies of your daily backups. I recommend at least three copies of the data located in three different places: (1) hard drive, (2) external hard drive, and (3) cloud.

In addition you would want to use some kind of third party service for your error notifications. When picking on a provider, I would look at the different notification mechanisms that they have in place. Some of them even notify you when an error occurs via sms.

#### Healthcheck of Server

:::note NOTE
Healthcheck is a feature in your application that allows you to monitor the state of your application while you are away by some 3rd party service (or a service of your own placed in a different location).
:::

We would like to have a route on our project that has only one function : to respond to requests with a message that says I am online and everything is working. Usually it goes something like this :

```js title="app.js"
// ...
app.use(`/status`, (req, res, next) => {
  res.status(200).send({ status: `OK` }); //<1>
});
// ...
```

- <1> The actual response varies according to the 3rd party service that you use

The 3rd party service calls on this route on a regular basis. The function of the 3rd party service is to notify you in an event that the server does not respond with a proper message. Then the service would send you some kind of notification to say that your service did not respond in an expected manner.

#### Healthcheck of Databases

Similarly to the server, you would like to know that your database (PostgreSQL in our instance) is working properly. Luckily, we can do that with the `authenticate` function that is provided to us with sequelize module. Our database healthcheck would look something like this

```js title="app.js"
// ...
app.use(`/status/database`, (req, res, next) => {
  sequelize
    .authenticate()
    .then(() => {
      res.status(200).send({ status: `OK` }); //<1>
    })
    .catch((err) => {
      res.status(500).send({ status: `NOT OK` });
    });
});
// ...
```

- <1> The actual response varies according to the 3rd party service that you use

### Server setup checklist

Basic checklist to get our node.js application running on a server.

- [ ] Buy server
- [ ] Pick Ubuntu distro
- [ ] Setup ssh
- [ ] Setup ssh login over ssh-key and not via password
- [ ] Create an `admin` user
- [ ] Remove remote `root` access
- [ ] Setup Node.js environment as per https://nodejs.org/en/
- [ ] Setup PostgreSQL
- [ ] Create cron job to backup database daily
- [ ] Create local cron job to download these backups
- [ ] Setup Nginx
- [ ] Setup HTTPS / SSL
- [ ] Setup `systemd` to run Node.js project
- [ ] Setup Cloudflare
- [ ] Setup Health Status Route
- [ ] Find a way to sync local project and server (git works or rsync)

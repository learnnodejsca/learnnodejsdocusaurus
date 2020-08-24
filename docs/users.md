---
id: users
title: Users
sidebar_label: Users
---

:::note [NOTE]
Secure user workflows are required in modern projects. In this chapter we are going to explore user logins, registration, security, and forgot password user flow designs, and implementation logic.
:::

Before working on the actual code implementation of this section I had some requirements that I wanted to satisfy.

![User use cases design](../static/img/user-usecases.png)

First, I wanted at least 4 screens : login, create an account, forgot password, and profile page screens. Second, I wanted the passwords to be stored securely and not in plain text. Third, and finally, I wanted the reset my password user flow to send emails.

## Secure user sign-in

I consulted OWASP for the following four wiki pages that gave me the necessary background refresher that I needed on passwords. The sources were :

- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- and https://owasp.org/www-project-top-ten/

![Login user flow design](../static/img/login-activity-screen.png)

To get the login page, I wrote a simple router that passes on the page title and the csrf token to the template.

```js title=".routes/users.js"
router.get('/signin', csrfProtection, (req, res, next) => {
  //<1>
  res.render('users/sign-in', {
    //<2>
    title: `Login - Elderoost`, //<3>
    csrfToken: req.csrfToken(), //<4>
  });
});
```

- <1> Add csrf protection that adds `csrfToken()` function to `req` object
- <2> Render `views/users/sign-in.hbs` template
- <3> Set title for the template
- <4> Pass csrf token to be used in signin form

Next, I needed to create the template so that a user could sign in. I know that in the template I wanted a user login using an email address and a password to sign in. Additionally, I wanted the UI to have a link to create a user account page and to the reset password page. I went ahead and created the form and the UI in the following block :

```handlebars title=".views/users/sign-in.hbs"
<form action="/users/signin" method="POST"> <1>
  <input type="hidden" name="_csrf" value="{{csrfToken}}"> <2>
  <div class="field">
    <label class="label" for="email">Email</label>
    <div class="input-wrapper">
      <input id="email" name="email" type="email" class="input" required spellcheck="false" autocomplete="off">
    </div>
  </div>
  <div class="field">
    <label class="label" for="password">Password</label>
    <div class="input-wrapper">
      <input id="password" name="password" type="password" class="input" required spellcheck="false"
        autocomplete="off">
      <p class="help">Forgot your password? <a href="/users/forgot" class="main__wrapper__link">Reset password</a></p> <3>
    </div>
  </div>
  <button class="button is-primary full-width" type="submit">Login <i class="fa fa-sign-in-alt"
      aria-hidden="true"></i></button>
</form>
```

- <1> Our form handler url
- <2> This is the csrf token that we passed from the code block previously
- <3> Link to our forgot password page

Great! Our user can now visit our `/users/signin` route and see a functional login form that is csrf protected.

![Login Screen](../static/img/login-screen.png)

So, naturally, we need to now move on to the code that is responsible for processing this form. The following code works on the form and signs in a user into our application if the email and password match. Back I went into our `./routes/users.js` router and added a new route.

I made sure that this next router is waiting for a `POST` on my `/users/signin` route. Before working on the code we need to install a few dependent libraries :

- bcrypt for comparing passwords in the database to the passed string
- and secure client-session library that will allow us to maintain a user sessions.

```shell title="Lets open up the terminal and install them"
npm install --save bcrypt
npm install --save client-sessions
```

Now that our two dependencies are installed, lets work on the code to make it look like this :

```js title=".routes/users.js"
// ...
const bcrypt = require('bcrypt');
const saltRounds = 12;
// ...
router.post('/signin', csrfProtection, async (req, res, next) => {
  //<1>
  const { email, password } = req.body;
  if (email && password) {
    //<2>
    const user = await User.findOne({ where: { email: `${email}` } });
    if (user) {
      //<3>
      const compared = await bcrypt.compare(password, user.password);
      if (compared) {
        //<4>
        const _user = {
          //<5>
          username: user.username,
          email: user.email,
          is_admin: user.is_admin,
        };
        req.session.user = _user; //<6>
        res.redirect('/users/profile');
      } else {
        res.redirect('/users/signin');
      }
    } else {
      res.redirect('/users/signin');
    }
  } else {
    res.redirect('/users/signin');
  }
});
// ...
```

- <1> Run csrf protection to ensure our tokens match
- <2> Check if the user entered an email and a password
- <3> Check if a user with such an email exists in our database
- <4> Check if password equals what we have in our database using bcrypt
- <5> Create a `User` object using user's data
- <6> Set the session data so the user can be remembered as logged in

First thing, like all of the other forms in the app, is the csrf protection that will be checked via the `csrfProtection` function. If it passes, then my code will be executed. In my code, I am expecting the `email` and `password` variables to be passed in the request. If either of these items is missing, then I send the user back to the main login page.

From there, I asked sequelize to run a query in our postgresql database and find a user by their email. If the user exists, then great and we are ready to move on to the password comparison. Otherwise, redirect the user back to the main login page. If the user exists, we call `bcrypt.compare(password,hash)` function which returns a true or a false. If the password matches the email, then we create a new user object, `_user`, with their `username`, `email`, and `is_admin` variables set. I then attach this object to our session object, `req.session.user`, so that when the user returns after leaving, we could recognize them again in the future. After confirming the password and setting a new user session, I redirect the user to their profile page.

## Secure user sessions

The session cookie object is added on startup of the project using the `client-sessions` library.

```js title="app.js"
// ...
const sessions = require('client-sessions'); //<1>
const SECRET = process.env.TOP * SECRET; //<2>
// ...
app.use(
  sessions({
    cookieName: 'session', //<3>
    secret: SECRET, //<4>
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
  })
);
// ...
```

- <1> Import the library
- <2> Set a secret token to encrypt our session cookie data with
- <3> Set the cookie's name; this string is also how you access this cookie in `req` object. For example, if cookieName is `myName` then the session cookie data would be accessed via `req.myName`.
- <4> Encrypt the cookie using the secret token.

The code above allows you to access `req.session` object in your router handler. This means that whatever text you put in `cookieName: 'objectName'` is what will be available as `req.objectName` so pay attention to this area during setup.

The following function is responsible for checking if a user is present on every call. This is done by using the client-sessions library check during the request and allows me to quickly set `req.user` object during this function.

```js title=".app.js"
// ...
const sessionRequestHandler = async (req, res, next) => {
  if (req.session && req.session.user && req.session.user.email) {
    const user = await User.findOne({
      where: { email: req.session.user.email },
    });
    if (user) {
      const \_user = {
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      };
      req.user = \_user;
      req.session.user = \_user;
      res.locals.user = req.session.user;
    }
  }
  next();
};
app.use(sessionRequestHandler);
// ...
```

The code is inserted above before any other router handlers. The `sessionRequestHandler` checks on every request if a client is a known user or a guest visitor. If they are a returning user, then we adjust the session data and set the user variable to be accessible by our templates by setting the `req.locals.user` variable.

This is the basics of authentication : finding the correct user based on some criteria, such as password and email in our case; then setting the session data for each request; and followed by checking the session data on returning requests to see if a user is who they say they are. This way you can implement authorization later on in the chapter. Authorization basically ensures that the user has access or permissions to do whatever they are requesting to do. In our app, this is done by an admin flag to differentiate between two types of users.

![Login user flow design](../static/img/sessionRequestHandler.png)

`sessionRequestHandler` function as outlined in code previously. `hasSession?` is simply a simplification for the following expression evaluation : `req.session && req.session.user && req.session.user.email`

Our app has two users : (a) registered user and (b) admin user. A registered user obtains permissions such as view more content on the screens of residences : add an article sections, a review section, and a comments section. Whereas, an admin user gains powerful dashboard that controls the contents of the app.

## Secure create user account

![Create account user flow design](../static/img/create-accnt-activity-screen.png)

Similar coding process as the section on login user flow. First create a `get` route that would obtain the required handlebarsjs template and then pass into it the title and csrf token to the page. I passed the csrf token through because the page had a submission form on it.

```js title=".routes/users.js"
// ...
router.get('/signup', csrfProtection, (req, res, next) => {
  //<1>
  res.render('users/sign-up', {
    //<2>
    title: `Create an account on Elderoost`, //<3>
    csrfToken: req.csrfToken(), //<4>
  });
});
// ...
```

- <1> Add csrf protection that adds `csrfToken()` function to `req` object
- <2> Render `views/users/sign-up.hbs` template
- <3> Set title for the template
- <4> Pass csrf token to be used in sign-up form

Next, I followed through with creating the sign-up template in handle bars. I wanted to user to sign up using an email address, username, and a password. The username will be able to be changed but email will not be unless the user emails us, the admins and we do that manually. Please notice that at the bottom of the form below I added a line about _privacy policy_ and _terms of service_. You need something like this in your own app if you are serving customers from the EU or ones that comply with the GDPR.

```handlebars title="views/users/sign-up.hbs"
<section class="main main-text-wrapper">
  <div class="main__wrapper-purple padding-left padding-right">
    <h1 class="main__wrapper-purple__text">Create your free account
    </h1>
  </div>
  <div class="main__wrapper main__negative-top-margin">
    <div class="padding-left padding-right padding-top padding-bottom">
      <form action="/users/signup" method="POST"> <1>
        <input type="hidden" name="_csrf" value="{{csrfToken}}"> <2>
        <div class="field">
          <label class="label" for="username">Username</label>
          <div class="input-wrapper">
            <input id="username" name="username" type="text" class="input" required spellcheck="false" autocomplete="off">
          </div>
        </div>
        <div class="field">
          <label class="label" for="email">Email</label>
          <div class="input-wrapper">
            <input id="email" name="email" type="email" class="input" required spellcheck="false" autocomplete="off">
          </div>
        </div>
        <div class="field">
          <label class="label" for="password">Password</label>
          <div class="input-wrapper">
            <input id="password" name="password" type="password" class="input" required spellcheck="false"
              autocomplete="off">
          </div>
        </div>
        <button class="button is-primary full-width" type="submit">Create account <i class="fa fa-sign-in-alt"
            aria-hidden="true"></i></button>
      </form>
      <p>By registering, you agree to the <a href="/privacy?ref=signup" class="main__wrapper__link">privacy policy</a> <3>
        and <a href="/tos?ref=signup" class="main__wrapper__link">terms of service</a>.</p>
    </div>
  </div>
</section>
```

- <1> Route handler that will process this form
- <2> Csrf protection token set as hidden field attribute
- <3> Link to privacy policy and terms of service (optional but recommended for GDPR compliance)

After writing the code, we can take a look at the produced UI :

![Create account screen](../static/img/create-account-screen.png)

Now, that we can display the create account screen and enter data, we need to work on the route handler that will process this form and create an account if successful. Basically, all of our users are required to have an email address. Thus, we will assume that the user that is creating an account does not have an entry for their email address in our database. Based on model of our data, located in `models/user.js` our users also must have a unique username. If the email and username are not in our database then our creation of a user will not fail. Otherwise, the form will throw an error and redirect back to sign-up screen.

The following step is processing the data from the create account form submission. We simply create a new `post` route handler for the `POST` requests to `/users/signup` api point. Then we process the business logic as outlined before, and after a successful sign up we set the user session cookie and redirect them to their profile page.

```js title=".routes/users.js"
// ...
router.post('/signup', csrfProtection, async (req, res, next) => {
  //<1>
  const { username, email, password } = req.body;
  if (username && email && password) {
    //<2>
    const user = await User.findOne({ where: { email: `${email}` } });
    if (!user) {
      //<3>
      const hash = await bcrypt.hash(password, saltRounds); //<4>
      const \_user = await User.create({
        //<5>
        username: username,
        email: email,
        password: hash,
      });
      if (\_user) {
        const __user = {
          username: \_user.username,
          email: \_user.email,
          is_admin: \_user.is_admin,
        };
        req.session.user = __user; //<6>
        res.redirect('/users/profile');
      } else {
        res.redirect('/users/signup');
      }
    } else {
      res.redirect('/users/signup');
    }
  } else {
    res.redirect('/users/signup');
  }
});
// ...
```

- <1> Prior to working on the logic run csrf proctection
- <2> Ensure user entered values for username, email, and password
- <3> Ensure we don't have a user with such email
- <4> Create a password hash using `bcrypt`
- <5> Create new user
- <6> Set `session` object to our user object

:::note [NOTE]
Please refer to <<install-bcrypt,sign in>> code for bcrypt and sessions explanation.
:::

## Secure user password resets

I built my token reset mechanism around a central requirement of my application where a user cannot change their email by default. This ensures that the user’s email is the source of truth for a user in my app. So, creating a password reset tool also depends on this requirement. I will be sending a reset token to the user via their registered email address. The user will have to enter this token on a screen in order to gain access to the password reset screen. In total, this action for resetting a password will require three screens :

- screen for the user to enter an email for gain a reset token by email
- screen with instructions what to do after step 1. In our case simply we will state that the user will need to check their email for a reset instructions. In the email we will have a link to our app with the reset token set for the user.
- screen for the user to set a new password. The only way to access this screen will be by using the newly generated reset token that the user received via our automatic email.

So, lets begin working on the first screen by creating a new route that will be the home for this screen. In our case, the password reset screen lives at the `/users/forgot` route :

```js title=".routes/users.js"
router.get('/forgot', csrfProtection, (req, res, next) => {
  //<1>
  res.render('users/forgot', {
    //<2>
    title: `Reset password - Elderoost`, //<3>
    csrfToken: req.csrfToken(), //<4>
  });
});
```

- <1> Add csrf protection that adds `csrfToken()` function to `req` object
- <2> Render `views/users/forgot.hbs` template
- <3> Set title for the template
- <4> Pass csrf token to be used in forgot form

and the password reset form for the first objective looks like so :

```handlebars title=".views/users/forgot.hbs"
<section class="main main-text-wrapper">
  <div class="main__wrapper-purple padding-left padding-right">
    <h1 class="main__wrapper-purple__text">Reset password</h1>
  </div>
  <div class="main__wrapper main__negative-top-margin">
    <div class="padding-left padding-right padding-top padding-bottom">
      <form action="/users/forgot" method="POST"> <1>
        <input type="hidden" name="_csrf" value="{{csrfToken}}"> <2>
        <div class="field">
          <label class="label" for="email">Email</label>
          <div class="input-wrapper">
            <input id="email" name="email" type="email" class="input" required spellcheck="false" autocomplete="off">
            <p class="help">If the email exists, we will reset your password and send an email with instructions for
              creating a new password.</p>
          </div>
        </div>
        <button class="button is-primary full-width" type="submit">Reset password</button>
      </form>
    </div>
  </div>
</section>
```

- <1> Route that will handle this form submission
- <2> Csrf token that we passed to the template

![Password reset screen](../static/img/reset-password-screen.png)

The next step would be working on the logic for processing the form. Please notice that as a simple security precaution I do not want to notify the user that is doing reset if the reset was successful. I do not want bad actors to know if a specific email exists in my database or not. They could potentially do that if you send a message like `"This email does not exist"` for a failed password reset and no message for a successful reset. I suggest that a better message is like one I wrote in my form, `"If the email exists, we will reset your password and send an email with instructions for creating a new password."`

We will be using SendGrid service to send our emails in this section. I want the email to simply contain plain text message of the reset password token in the body of the email. Using SendGrid is very simple plus they allow up to 100 free emails to be sent daily. As a starter project or a small project, I think this will be enough for our transactional needs. Please register for an account and acquire their API key.

To do that, go login to your account :

![SendGrid login screen](../static/img/sendgrid-login-screen.png)

Then, find the settings menu and go to the API key section right after logging in. In the API keys section, you will be able to create a new API key. When you will be prompted for access, I would go ahead and give it full access for now. Go ahead, and do that like so :

![SendGrid API key screen](../static/img/sendgrid-api-screen.png)

Please take a moment and get acquainted with SendGrid and its offerings. Now that you have your SendGrid API key, we can go back to implementing our password reset logic. Let’s set up the SendGrid library so that we can send an email later. First we install the library :

```shell title="Install SendGrid library"
npm install --save @sendgrid/mail
```

Then, we go ahead and import the library in the same `./routes/users.js` router handler that we have been working on for this Chapter. For the sake of simplicity, I included the API key as a variable in the code. Please _do not_ do that in production and rather set it to an environmental variable like the commented out code suggests.

```js title=".routes/users.js"
// ...
const sgMail = require('@sendgrid/mail');
const sgAPI = `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`;
sgMail.setApiKey(sgAPI);
// sgMail.setApiKey(process.env.SENDGRID_API_KEY); <1>
// ...
```

- <1> In production environment, please use environmental variables and not inline the key in code

Now we are ready to send out emails and, thus, let’s go back to working on processing the reset password form.

On the post request we are expecting only one input which we require and that is an email. If the email does not exist, we do nothing and send the user to the next page. If the email exists, I did not want to simply reset the users password. I wanted to create a token that the user would receive via email. The user would need to enter this token in another screen where they will be able to set a new password. The only way to get this token is via our automatic email that is sent by SendGrid. I format our simple email and send it out on successful reset. The token gets generated by a third party library called generate-password and I used length of 64 characters for our token. Hopefully this justification combined with the code below shines some light onto why the `Users` model had `reset_password_token` parameter.

![Reset password and send email user flow design](../static/img/reset-password-activity-screen.png)

So go ahead and install this password generator

```shell title="Install password-generator library"
npm install --save generate-password
```

After that, we can begin working on our logic. So go ahead, install the password generator in your code and start coding the business logic for the `POST` request to `/users/forgot` route :

```js title="routes/users.js"
// ...
const passGenerator = require('generate-password');
// ...
router.post('/forgot', csrfProtection, async (req, res, next) => {
  //<1>
  const { email } = req.body;
  if (email) {
    try {
      const user = await User.findOne({ where: { email: `${email}` } });
      if (user) {
        const \_pd = passGenerator.generate({ length: 64, numbers: true }); //<2>
        user.reset_password_token = \_pd;
        await user.save(); //<3>
        // send email async
        const msg = {
          to: `${user.email}`,
          from: `alex.kluew@gmail.com`,
          subject: 'Elderoost : Password Reset',
          text: `To reset your password, please go to https://elderoostalpha.herokuapp.com/users/forgot/t/${_pd}`, //<4>
          html: `<strong>To reset your password, please go to <a href="https://elderoostalpha.herokuapp.com/users/forgot/t/${_pd}">https://elderoostalpha.herokuapp.com/users/forgot/t/${_pd}</a></strong>`,
        };
        await sgMail.send(msg); //<5>
        res.render('users/forgot-after');
      }
    } catch (e) {
      console.error(`ERRROR in POST /users/forgot : ${e}`);
    }
  }
});
// ...
```

- <1> Csrf protection
- <2> After we found the user, generate a new reset password token
- <3> Set the `reset_password_token` and save the user
- <4> Set the password token in the url for the user to visit
- <5> Send the email with `msg` content to `user.email`

Now we go ahead and create the after template that is going to be redirected to on a successful reset in `views/users/forgot-after.hbs`:

```handlebars title="views/users/forgot-after.hbs"
<section class="main main-text-wrapper">
  <div class="main__wrapper-purple padding-left padding-right">
    <h1 class="main__wrapper-purple__text"><i class="fa fa-redo" aria-hidden="true"></i> Reset password</h1>
  </div>
  <div class="main__wrapper main__negative-top-margin">
    <div class="padding-left padding-right padding-top padding-bottom">
      <p style="text-align:center;">If the email exists, we will reset your password and send an email with instructions
        for creating a new
        password.</p> <1>
      <p style="text-align:center;font-weight:100;">Go back <a href="/?ref=forgot" class="main__wrapper__link">home</a>.
      </p>
    </div>
  </div>
</section>
```

- <1> Friendly message to the user that the password was reset if the email exists (it wasn't as we set a reset token and not actually reset the password).

Okay, so now the user can visit a page, submit an email to receive a reset token in, view instructions page after submission, and receive a password reset token in email.

![Reset password email with reset password link](../static/img/email-reset-password-screen.png)

If you were wondering, this is what the email looks like that was sent by our app. Notice that SendGrid changes your URL in the email and adds its own data. However, when a user clicks on the link then they get redirected exactly where the code tells them to go.

Next, we need to proceed in creating the router handler for the token password reset, `/users/forgot/t/:token`.

![User activity flow design for accessing set new password screen](../static/img/email-reset-token-activity-screen.png)

I did this by creating a route that takes the token itself as one of the parameters to access the reset password page. Thus, a random user cannot access our password reset page. The page is only accessible via an email. So, if a user enters the correct token then they will access the password reset page for that token. Lets build this out by creating first a get route, followed by creating the reset password template.

```js title="routes/users.js"
router.get('/forgot/t/:token', csrfProtection, async (req, res, next) => {
  //<1>
  const { token } = req.params;
  if (token && token.length === 64) {
    try {
      const user = await User.findOne({
        where: { reset_password_token: `${token}` }, //<2>
      });

      if (user) {
        res.render('users/forgot-token', {
          //<3>
          title: `Set new password - Elderoost`,
          token: token, //<4>
          csrfToken: req.csrfToken(),
        });
      }
    } catch (e) {
      console.error(`ERROR in /forgot/t/:token : ${e}`);
    }
  }
});
```

- <1> Add csrf protection as we will be displaying the reset password form
- <2> The only way to access this page is with a token and the only way to get this token is from the `User`'s email inbox. I look for the user with this token.
- <3> Once the user is found with the reset token, we redirect the user to the `views/users/forgot-token.hbs` template
- <4> I pass the token to be used by our reset password form

As you can notice, I pass the token to the next template that I will be displaying, `forgot-token.hbs`, which is the password reset form. In the form, I will use this token in a way that you will see below. Then, I will ask ask the user to confirm the email for which the password will be reset along with the new password. This way, before resetting any password and doing damage to a user’s experience, I need to receive the email and the password reset token from the user. So, the code form for the password reset form will look something like this

```handlebars title="views/users/forgot-token.hbs"
<section class="main main-text-wrapper">
  <div class="main__wrapper-purple padding-left padding-right">
    <h1 class="main__wrapper-purple__text"><i class="fa fa-search" aria-hidden="true"></i> Reset password</h1>
  </div>
  <div class="main__wrapper main__negative-top-margin">
    <div class="padding-left padding-right padding-top padding-bottom">
      <form action="/users/forgot/t/{{token}}" method="POST"> <1>
        <input type="hidden" name="_csrf" value="{{csrfToken}}"> <2>
        <div class="field">
          <label class="label" for="email">Email</label> <3>
          <div class="input-wrapper">
            <input id="email" name="email" type="email" class="input" required spellcheck="false" autocomplete="off">
          </div>
        </div>
        <div class="field">
          <label class="label" for="password">New Password</label>
          <div class="input-wrapper">
            <input id="password" name="password" type="password" class="input" required spellcheck="false"
              autocomplete="off">
            <p class="help">Enter your new password.</p>
          </div>
        </div>
        <button class="button is-primary full-width" type="submit">Set new password</button>
      </form>
    </div>
  </div>
</section>
```

- <1> There will be a route handler waiting for a `POST` request for the URL that contains the reset password token
- <2> Add csrf protection for our reset password form
- <3> Ask for the user's email once again to confirm during the next step

That code looks like this

![New password screen](../static/img/new-password-screen.png)

Now, lets move on to building the `POST` router handler that will be responsible for processing this form, resetting to a new password, and sending an email to the user stating that their password was recently reset.

![Set new password activity flow design](../static/img/set-password-activity-screen.png)

```js title="routes/users.js"
router.post('/forgot/t/:token', csrfProtection, async (req, res, next) => {
  const { token } = req.params;
  const { email, password } = req.body;
  if (token && token.length === 64) {
    if (email && password) {
      try {
        const user = await User.findOne({
          where: {
            email: email,
            reset_password_token: token,
          },
        });
        if (user) {
          const hash = await bcrypt.hash(password, saltRounds);
          user.password = hash;
          user.reset_password_token = '';
          await user.save();
          // send email async
          const msg = {
            to: `${user.email}`,
            from: `alex.kluew@gmail.com`,
            subject: 'Elderoost : Password was reset.',
            text: `Hello, your password was recently reset. If you did recently reset your password, then please disregard this message. Otherwise, please contact us at alex.kluew@gmail.com about this email.`,
            html: `Hello, your password was recently reset. If you did recently reset your password, then please disregard this message. Otherwise, please contact us at alex.kluew@gmail.com about this email.`,
          };
          await sgMail.send(msg);
          res.redirect(`/users/signin?ref=password-reset`);
        }
      } catch (e) {
        console.error(`ERROR in /forgot/t/:token : ${e}`);
      }
      res.redirect(`/forgot/t/${token}`);
    }
  }
});
```

In case you were wondering this is what the email looks like this once the password was reset successfully :

![Password was reset email notification screen](../static/img/email-password-was-reset.png)

We used the `bcrypt` library to generate a new password hash using the newly provided password by the password reset form. In addition, I reset the value of the `reset_password_token` such that this function is only ran once and the token is reset after its use. After a successful password reset, I send an email to the user notifying them that their password was recently reset. It is a good security practice to send such an email to the user. Worst case scenario they get an additional email from you that they can delete or in a best case the user sees a password change that they did not initiate. Following the sent email using SendGrid, I redirect the user into the login page so that they can login to their account using their newly set password. If the password was not successful, I simply redirect the user back to the set new password form.

## User profiles

User profiles in our case are meant to be a starting place. It was deliberately decided into the construction of the user requirements that a user could not change an email address by themselves. It is our one rule in the application. Thus, if a user is requesting an email change they must go through the proper contact us channels.

A user can, however, change their username and password. The password change is currently implemented via the password reset form. Whereas, the username can be changed via the profile screen.

![Complete user profile screen](../static/img/profile-screen.png)

Head over and create the following route handler

```js title=".routes/users.js"
// ...
router.get('/profile', csrfProtection, (req, res, next) => {
  if (req.user) {
    //<1>
    res.render('users/profile', {
      title: `My profile - Elderoost`,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.redirect('/users/signin');
  }
});
// ...
```

- <1> Check that the user object is there before loading the template

and then go ahead and create the template for the profile screen

```handlebars title="views/users/profile.hbs"
<section class="main main-text-wrapper">
  <div class="main__wrapper-purple padding-left padding-right">
    <h1 class="main__wrapper-purple__text">Profile
    </h1>
  </div>
  <div class="main__wrapper main__negative-top-margin">
    <div class="padding-left padding-right padding-top padding-bottom">
      <form action="/users/profile" method="POST"> <1>
        <input type="hidden" name="_csrf" value="{{csrfToken}}"> <2>
        <div class="field">
          <label class="label" for="username">Username</label>
          <div class="input-wrapper">
            <input id="username" name="username" type="text" class="input" required spellcheck="false"
              autocomplete="off" value={{user.username}}> <3>
          </div>
        </div>
        <div class="field">
          <label class="label" for="email">Email</label>
          <div class="input-wrapper">
            <input id="email" name="email" type="email" class="input" required spellcheck="false" autocomplete="off" value={{user.email}} readonly> <4>
            <p class="help">Your email cannot be changed. Please contact us to do that.</p>
          </div>
        </div>
        <div class="field">
          <label class="label" for="password">Password</label>
          <div class="input-wrapper">
            <input id="password" name="password" type="password" class="input" required spellcheck="false" autocomplete="off"> <5>
          </div>
        </div>
        <button class="button is-primary full-width" type="submit">Save <i class="fa fa-save"
            aria-hidden="true"></i></button>
      </form>
    </div>
  </div>
</section>
```

- <1> Route handler that we will have to build to handle this form's `POST` request to `/users/profile`
- <2> csrf token
- <3> User data gathered from session data and can change their username
- <4> Email is in a read-only mode and cannot be changed
- <5> Require a password for the change to be implemented

As you can see above, our `user` object appeared somehow magically?! It was passed on to the template through the code in our session data. More specifically, we have the code `req.locals.user` and `req.user` objects that has the data that we need to display in our user profile template.

What is left over after displaying the template is to build the route handlers that will process the changes requested in our user profile form. Let's head over and build that code

```js title="routes/users.js"
// ...
router.post('/profile', csrfProtection, async (req, res, next) => {
  const { username, email, password } = req.body;
  if (username && email && password) {
    // all good we can change the username
    const user = await User.findOne({ where: { email: `${email}` } }); //<1>
    if (user) {
      const compare = await bcrypt.compare(password, user.password); //<2>
      if (compare) {
        if (user.username !== username) {
          const \_usernameExists = await User.findOne({
            where: { username: `${username}` },
          }); //<3>
          if (!\_usernameExists) {
            const updatedUser = await User.update(
              { username: username },
              { where: { email: `${email}` } }
            ); //<4>
          }
        }
      }
      res.redirect('/users/profile');
    } else {
      res.redirect('/users/logout');
    }
  }
});
// ...
```

- <1> Find the user by email
- <2> Check that the password for the user is correct
- <3> Check that there are no other users with the same username
- <4> Change the username for the user with the provided email address

Now, we have implemented all of the features to have a successful user with a user account. We, also, have built enough automation so a user can reset their passwords and change usernames without me having to intervene. Small wins that you can automate for the user are always a good idea to invest time into.

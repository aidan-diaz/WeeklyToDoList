module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('tasks').find({user: req.user}).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            tasks: result
          })
        })
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/task', (req, res) => {
      db.collection('tasks').save({user: req.user, task: req.body.task, day: req.body.day}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/moveLeft', (req, res) => {
      db.collection('tasks')
      .findOneAndUpdate({user: req.user, task: req.body.task, day: req.body.day}, {
        $set: {
          day: moveLeft(req.body.day)
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/moveRight', (req, res) => {
      db.collection('tasks')
      .findOneAndUpdate({user: req.user, task: req.body.task, day: req.body.day}, {
        $set: {
          day: moveRight(req.body.day)
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/deleteTask', (req, res) => {
      db.collection('tasks').findOneAndDelete({user: req.user, task: req.body.task, day: req.body.day}, (err, result) => {
        if (err) return res.send(500, err)
        console.log(req.body.day)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}



function moveLeft(day) {
  switch (day) {
    case 'monday':
      return 'sunday';
      break;
    case 'sunday':
      return 'saturday';
      break;
    case 'saturday':
      return 'friday';
      break;
    case 'friday':
      return 'thursday';
      break;
    case 'thursday':
      return 'wednesday';
      break;
    case 'wednesday':
      return 'tuesday';
      break;
    case 'tuesday':
      return 'monday';
      break;
  }
}

function moveRight(day) {
  switch (day) {
    case 'monday':
      return 'tuesday';
      break;
    case 'tuesday':
      return 'wednesday';
      break;
    case 'wednesday':
      return 'thursday';
      break;
    case 'thursday':
      return 'friday';
      break;
    case 'friday':
      return 'saturday';
      break;
    case 'saturday':
      return 'sunday';
      break;
    case 'sunday':
      return 'monday';
      break;
  }
}

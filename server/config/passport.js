const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User          = require('../models/User');

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email  = profile.emails[0].value;
    const name   = profile.displayName;
    const avatar = profile.photos[0]?.value || '';

    // check if user exists
    let user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email:    email      }
      ]
    });

    if (user) {
      // existing user — update google info if missing
      if (!user.googleId) {
        user.googleId        = profile.id;
        user.avatar          = user.avatar || avatar;
        user.isEmailVerified = true;
        await user.save();
      }
      return done(null, user);
    }

    // new user — create account
    user = await User.create({
      name,
      email,
      googleId:        profile.id,
      avatar,
      authProvider:    'google',
      isEmailVerified: true,
      // no password needed for Google users
      password:        `google_${profile.id}_${Date.now()}`,
    });

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;
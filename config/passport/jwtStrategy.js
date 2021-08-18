const fs = require("fs");
const path = require("path");
const passport = require("passport");
const JWT_STRATEGY = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../../models/user");
const { genPassword } = require("../../helper/utils");

const pathToKey = path.join(__dirname, "../../", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// PASSPORT-JWT OPTIONS
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

//  VERIFY CALLBACK
const verifyCallback = async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.sub });
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    done(err, false);
  }
};

// Creating a jwt strategy
const strategy = new JWT_STRATEGY(options, verifyCallback);
passport.use(strategy);

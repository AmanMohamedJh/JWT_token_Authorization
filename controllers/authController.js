const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email

  if (err.message === "Incorrect Email") {
    errors.email = "This email is not registered ! ";
  }
  //incorrect password

  if (err.message === "Incorrect password") {
    errors.password = "This password is not registered ! ";
  }

  if (err.code === 11000) {
    //duplicate credential input error-->11000 error code

    errors.email = "this email is already registered";
    return errors;
  }

  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// creating tokens // then use this in after creating a user

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "mySecret", {
    expiresIn: maxAge,
  });
};

///GET --> SIGNUP///

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

///GET --> Login ///

module.exports.login_get = (req, res) => {
  res.render("login");
};

///POST --> SIGNUP///////////////////////////////////////////

module.exports.signup_post = async (req, res) => {
  const credentials = ({ email, password } = req.body);

  try {
    const user = await User.create(credentials);
    const token = createToken(user._id);
    //here we create a cookie for jwt token so whenever user enter it stores in jwt token cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

///POST --> Login//////////////////////////////////////

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

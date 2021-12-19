const { user } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().min(10).required(),
    password: Joi.string().min(5).required(),
    fullname: Joi.string().min(2).required(),
    phone: Joi.number().min(10).required(),
    address: Joi.string().min(4).required(),
    gender: Joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const userData = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    console.log(userData);

    if (userData) {
      return res.status(400).send({
        status: "Failed",
        message: "User already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      ...req.body,
      password: hashedPassword,
      avatar: null,
      role: "user",
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.TOKEN_KEY
    );

    res.send({
      status: "Success",
      message: "Your account has successfully created",
      data: {
        email: newUser.email,
        fullname: newUser.fullname,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    let userData = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt, updatedAt"],
      },
    });

    if (!userData) {
      return res.status(400).send({
        status: "Failed",
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, userData.password);

    if (!isValid) {
      return res.status(400).send({
        status: "Failed",
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        id: userData.id,
        role: userData.role,
      },
      process.env.TOKEN_KEY
    );

    userData = JSON.parse(JSON.stringify(userData));

    const avatar = userData.avatar
      ? process.env.PATH_AVATAR_IMAGES + userData.avatar
      : process.env.PATH_AVATAR_IMAGES + "no-photo.jpg";

    const newUserData = {
      id: userData.id,
      email: userData.email,
      fullname: userData.fullname,
      gender: userData.gender,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      avatar: avatar,
      token,
    };

    res.send({
      status: "Success",
      message: "Login successful",
      data: newUserData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    let userData = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!userData) {
      return res.status(404).send({
        status: "failed",
      });
    }

    userData = JSON.parse(JSON.stringify(userData));

    const avatar = userData.avatar
      ? process.env.PATH_AVATAR_IMAGES + userData.avatar
      : process.env.PATH_AVATAR_IMAGES + "no-photo.jpg";

    const newUserData = {
      id: userData.id,
      fullname: userData.fullname,
      email: userData.email,
      gender: userData.gender,
      phone: userData.phone,
      address: userData.address,
      role: userData.role,
      avatar: avatar,
    };

    res.send({
      status: "Success",
      data: {
        user: newUserData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

const { literature, user } = require("../../models");
const Joi = require("joi");
const fs = require("fs");

// create literature 
exports.addLiterature = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(4).required(),
    publication_date: Joi.date().required(),
    pages: Joi.number().required(),
    isbn: Joi.string().min(13).max(13),
    author: Joi.string().min(2),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  try {
    const newLiterature = await literature.create({
      ...req.body,
      userId: req.user.id,
      attache: req.file.filename,
      status: "Waiting Approve"
    });

    let data = await literature.findOne({
      where: {
        id: newLiterature.id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = {
      ...data,
      attache: process.env.PATH_LITERATURE_FILES + data.attache,
    };

    res.send({
      status: "Success",
      message: "Literature has successfully added",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// search literature 
exports.getSearchLiterature = async (req, res) => {
  const titleQuery = req.query.title;
  const { Op } = require("sequelize");

  try {
    let data = await literature.findAll({
      where: {
        title: {
          [Op.substring]: titleQuery,
        },
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["password","gender", "avatar", "role", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = data.map((item) => ({
      id: item.id,
      title: item.title,
      userId: item.user,
      publication_date: item.publication_date,
      pages: item.pages,
      isbn: item.isbn,
      author: item.author,
      status: item.status,
      attache: process.env.PATH_LITERATURE_FILES + item.attache,
    }));

    res.send({
      status: "Success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// get literature profile 
exports.getLiteratureProfile = async (req, res) => {
  const { id } = req.user;

  try {
    let data = await literature.findAll({
      where: {
        userId: id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = data.map((item) => ({
      ...item,
      attache: process.env.PATH_LITERATURE_FILES + item.attache,
      user: item.user,
    }));

    res.send({
      status: "Success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// detail literature
exports.getLiterature = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await literature.findOne({
      where: {
        id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = {
      ...data,
      attache: process.env.PATH_LITERATURE_FILES + data.attache,
    };

    res.send({
      status: "Success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// get all literature 
exports.getLiteratures = async (req, res) => {
  try {
    let data = await literature.findAll({
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = data.map((item) => ({
      ...item,
      attache: {
        filename: item.attache,
        url: process.env.PATH_LITERATURE_FILES + item.attache,
      },
    }));

    res.send({
      status: "Success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// delete literature 
exports.deleteLiterature = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await literature.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (data.attache) {
      fs.unlink("uploads/literatures/" + data.attache, (error) => {
        if (error) throw error;
      });
    }

    await literature.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      message: "Literature has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

// update literature 
exports.updateStatusLiterature = async (req, res) => {
  const { id } = req.params;

  try {
    await literature.update(req.body, {
      where: {
        id,
      },
    });

    let data = await literature.findOne({
      where: {
        id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = {
      ...data,
      attache: process.env.PATH_LITERATURE_FILES + data.attache,
    };

    res.send({
      status: "Success",
      message: "Literature status has been updated",
      data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
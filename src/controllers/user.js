const { user } = require("../../models");

const fs = require("fs");

exports.updateUserData = async (req, res) => {
  const { id } = req.user;

  try {
    await user.update(req.body, {
      where: {
        id,
      },
    });

    let data = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const avatar = data.avatar
      ? process.env.PATH_AVATAR_IMAGES + data.avatar
      : null;

    const newData = {
      ...data,
      avatar: avatar,
    };

    res.send({
      status: "Success",
      message: "Data has been changed",
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

exports.updateUserAvatar = async (req, res) => {
  const { id } = req.user;

  const data = { avatar: req.file.filename };

  try {
    const userData = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (userData.avatar) {
      fs.unlink("uploads/avatars/" + userData.avatar, (err) => {
        if (err) throw err;
      });
    }

    await user.update(data, {
      where: {
        id,
      },
    });

    let updatedData = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    updatedData = JSON.parse(JSON.stringify(updatedData));
    const newUpdatedData = {
      ...updatedData,
      avatar: process.env.PATH_AVATAR_IMAGES + updatedData.avatar,
    };

    res.send({
      status: "Success",
      message: "Avatar has successfully changed",
      data: newUpdatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};

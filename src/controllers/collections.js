const { user, literature, collection } = require("../../models");

// add collection 
exports.addMyCollection = async (req, res) => {
    const { id } = req.user;
  
    try {
      const newCollection = await collection.create({
        ...req.body,
        userId: id,
      });
  
      const data = await collection.findOne({
        where: {
          id: newCollection.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      res.send({
        status: "Success",
        message: "Literature has been added to your collection",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Failed",
        message: "Server error",
      });
    }
};

// delete collection 
exports.deleteMyCollection = async (req, res) => {
    const { id } = req.params;
  
    try {
      await collection.destroy({
        where: {
          id,
        },
      });
  
      res.send({
        status: "Success",
        message: "Literature has been deleted from your collection",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "Failed",
        message: "Server error",
      });
    }
};

// get collection 
exports.getMyCollection = async (req, res) => {
    const { id } = req.params;
  
    try {
      let data = await collection.findOne({
        where: {
          literatureId: id,
          userId: req.user.id,
        },
        include: [
          {
            model: literature,
            as: "literature",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: user,
            as: "user",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "userId", "literatureId"],
        },
      });
  
      data = JSON.parse(JSON.stringify(data));
  
      const newData = {
        ...data,
        literature: {
          ...data.literature,
          attache: process.env.PATH_LITERATURE_FILES + data.literature.attache,
        },
        user: {
          ...data.user,
          avatar: process.env.PATH_AVATAR_IMAGES + data.user.avatar,
        },
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

// get all collection 
exports.getMyCollections = async (req, res) => {
  const { id } = req.user;

  try {
    let data = await collection.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: literature,
          as: "literature",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId", "literatureId"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const newData = data.map((item) => ({
      ...item,
      literature: {
        ...item.literature,
        attache: process.env.PATH_LITERATURE_FILES + item.literature.attache,
      },
      user: {
        ...item.user,
        avatar: process.env.PATH_AVATAR_IMAGES + item.user.avatar,
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
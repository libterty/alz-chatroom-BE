const db = require('../models');
const Message = db.Message;
const User = db.User;

const messageController = {
  getAllMessages: (req, res) => {
    // join Table會拉出使用者敏感資訊＠＠
    return Message.findAll().then(async messages => {
      const Users = await User.findAll().then(user => user);
      messages = messages.map(message => ({
        ...message.dataValues,
        username: Users.filter(i => i.dataValues).find(
          user => user.id == message.dataValues.UserId
        )
          ? Users.filter(i => i.dataValues).find(
              user => user.id == message.dataValues.UserId
            ).name
          : '使用者已被刪除'
      }));
      return res.status(200).json({ status: 'success', messages });
    });
  },
  postMessage: (req, res) => {
    const { message, UserId } = req.body;
    if (message && UserId) {
      return Message.create({ message, UserId }).then(message => {
        return res
          .status(200)
          .json({ status: 'success', message: 'Add New Message' });
      });
    } else {
      return res
        .status(400)
        .json({ status: 'error', message: 'Missing Something Important' });
    }
  }
};

module.exports = messageController;

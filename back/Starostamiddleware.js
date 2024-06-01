import UserModel from './models/user.js';

const checkGroupLeadersLimit = async (req, res, next) => {
  const { groupName, NumberGroup, isVip } = req.body;
  
  if (isVip) {
    const group = `${groupName}-${NumberGroup}`;
    const leadersCount = await UserModel.countDocuments({ group, role: 'vip' });

    if (leadersCount >= 2) {
      return res.status(400).json({ message: "В этой группе уже два старосты" });
    }
  }

  next();
};

export default checkGroupLeadersLimit;
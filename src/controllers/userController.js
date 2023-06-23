import { Sequelize } from "sequelize";
import initModels from "../models/init-models.js";
import sequelize from "../models/index.js";
import { successCode, errorCode } from "../config/response.js";

const models = initModels(sequelize);

const Op = Sequelize.Op;

const getUserLiked = async (req, res) => {
  let { user_id } = req.body;
  try {
    let data = await models.like_res.findAll({
      include: ["user"],
    });
    let newData = data.map((it) => {
      return {
        user_id: it.user.user_id,
        user_name: it.user.full_name,
      };
    });
    const resMap = {};
    newData.forEach((it) => {
      const { user_id, user_name } = it;
      const key = `${user_id}-${user_name}`;
      if (resMap[key]) {
        resMap[key].likes += 1;
      } else {
        resMap[key] = {
          user_id,
          user_name,
          likes: 1,
        };
      }
    });
    const result = Object.values(resMap);
    if (!user_id) {
      successCode(res, result, "Lấy dữ liệu thành công");
    } else {
      const foundUser = result.filter((obj) => obj.user_id === Number(user_id));
      successCode(res, foundUser, "Lấy dữ liệu thành công");
    }
  } catch {
    errorCode(res, "Lỗi BE");
  }
};

const getUserLikeRes = async (req, res) => {
  try {
    let { userid, resid } = req.params;
    let data = await models.like_res.findAll({
      include: ["user", "re"],
    });
    let newData = data.map((it) => {
      return {
        user_id: it.user_id,
        user_name: it.user.full_name,
        res_id: it.res_id,
        res_name: it.re.res_name,
      };
    });
    const resMap = {};
    newData.forEach((it) => {
      const { res_id, res_name, user_id, user_name } = it;
      const key = `${res_id}-${res_name}-${user_id}-${user_name}`;
      if (resMap[key]) {
        resMap[key].likes += 1;
      } else {
        resMap[key] = {
          user_id,
          user_name,
          res_id,
          res_name,
          likes: 1,
        };
      }
    });
    const result = Object.values(resMap);
    const foundUserLike = result.filter(
      (obj) => obj.user_id === Number(userid)
    );
    const foundResLike = result.filter((obj) => obj.res_id === Number(resid));
    const foundLike = result.filter(
      (obj) => obj.res_id === Number(resid) && obj.user_id === Number(userid)
    );
    let users = await models.user.findAll();
    let ress = await models.restaurant.findAll();
    const foundUser = users.find((obj) => obj.user_id === Number(userid));
    const foundRes = ress.find((obj) => obj.res_id === Number(resid));
    if (!foundUser) {
      if (!foundRes) {
        successCode(
          res,
          "Không tìm thấy user và nhà hàng trong dữ liệu",
          "Lấy dữ liệu thành công"
        );
      } else {
        successCode(
          res,
          "Không tìm thấy user trong dữ liệu",
          "Lấy dữ liệu thành công"
        );
      }
    } else {
      if (!foundRes) {
        successCode(
          res,
          "Không tìm thấy nhà hàng trong dữ liệu",
          "Lấy dữ liệu thành công"
        );
      } else {
        if (!foundUserLike) {
          if (!foundResLike) {
            successCode(
              res,
              `Khách hàng ${foundUser.full_name} chưa thích và nhà hàng ${foundRes.res_name} chưa được thích`,
              "Lấy dữ liệu thành công"
            );
          } else {
            successCode(
              res,
              `Nhà hàng ${foundRes.res_name} không được thích bởi khách hàng ${foundUser.full_name} và được thích bởi: ${foundResLike.user_name}`,
              "Lấy dữ liệu thành công"
            );
          }
        } else {
          if (!foundResLike) {
            successCode(
              res,
              `Khách hàng ${foundUser.full_name} chưa thích nhà hàng ${foundRes.res_name}, mà thích nhà hàng ${foundUserLike.res_name}`,
              "Lấy dữ liệu thành công"
            );
          } else {
            if (foundLike) {
              successCode(res, foundLike, "Lấy dữ liệu thành công");
            } else {
              successCode(
                res,
                `Khách hàng ${foundUser.full_name} không thích nhà hàng ${foundRes.res_name} `,
                "Lấy dữ liệu thành công"
              );
            }
          }
        }
      }
    }
  } catch {
    errorCode(res, "Lỗi BE");
  }
};

const userAddRate = async (req, res) => {
  try {
    let { res_id, user_id } = req.params;
    let { amount } = req.body;
    let date_rate = new Date();
    let newData = {
      user_id: Number(user_id),
      res_id: Number(res_id),
      amount,
      date_rate,
    };
    await models.rate_res.create(newData);
    successCode(res, newData, "Thêm mới thành công");
  } catch (error) {
    errorCode(res, error.message);
  }
};

const getUserRated = async (req, res) => {
  let { user_id } = req.body;
  try {
    let data = await models.rate_res.findAll({
      include: ["user", "re"],
    });
    let newData = data.map((it) => {
      return {
        user_id: it.user.user_id,
        user_name: it.user.full_name,
        res_id: it.re.res_id,
        res_name: it.re.res_name,
        amount: it.amount,
      };
    });
    if (!user_id) {
      successCode(res, newData, "Lấy dữ liệu thành công");
    } else {
      const foundUser = newData.filter(
        (obj) => obj.user_id === Number(user_id)
      );
      successCode(res, foundUser, "Lấy dữ liệu thành công");
    }
  } catch {
    errorCode(res, "Lỗi BE");
  }
};

const userCreateOrder = async (req, res) => {
  try {
    let { food_id } = req.params;
    let { user_id, amount } = req.body;
    let code = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    let order = {
      user_id,
      food_id,
      amount,
      code,
    };
    await models.order.create(order);
    successCode(res, order, "Thêm mới thành công");
  } catch (error) {
    errorCode(res, error.message);
  }
};

export {
  getUserLiked,
  getUserLikeRes,
  userAddRate,
  getUserRated,
  userCreateOrder,
};

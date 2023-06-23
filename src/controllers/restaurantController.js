import { Sequelize } from "sequelize";
import initModels from "../models/init-models.js";
import sequelize from "../models/index.js";
import { successCode, errorCode } from "../config/response.js";
import { count } from "console";

const models = initModels(sequelize);

const Op = Sequelize.Op;

const getRestaurantLiked = async (req, res) => {
  let { res_id } = req.body;
  try {
    let data = await models.like_res.findAll({
      include: ["re", "user"],
    });
    let newData = data.map((it) => {
      return {
        res_id: it.re.res_id,
        res_name: it.re.res_name,
      };
    });
    const resMap = {};
    newData.forEach((it) => {
      const { res_id, res_name } = it;
      const key = `${res_id}-${res_name}`;
      if (resMap[key]) {
        resMap[key].likes += 1;
      } else {
        resMap[key] = {
          res_id,
          res_name,
          likes: 1,
        };
      }
    });
    const result = Object.values(resMap);
    if (!res_id) {
      successCode(res, result, "Lấy dữ liệu thành công");
    } else {
      const foundRes = result.filter((obj) => obj.res_id === Number(res_id));
      successCode(res, foundRes, "Lấy dữ liệu thành công");
    }
  } catch {
    errorCode(res, "Lỗi BE");
  }
};

const getResRated = async (req, res) => {
  let { res_id } = req.body;
  try {
    let data = await models.rate_res.findAll({
      include: ["user", "re"],
    });
    let newData = data.map((it) => {
      return {
        res_id: it.re.res_id,
        res_name: it.re.res_name,
        user_id: it.user.user_id,
        user_name: it.user.full_name,
        amount: it.amount,
      };
    });
    if (!res_id) {
      successCode(res, newData, "Lấy dữ liệu thành công");
    } else {
      const foundRes = newData.filter((obj) => obj.res_id === Number(res_id));
      successCode(res, foundRes, "Lấy dữ liệu thành công");
    }
  } catch {
    errorCode(res, "Lỗi BE");
  }
};

export { getRestaurantLiked, getResRated };

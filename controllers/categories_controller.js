var { sqldb } = require("../models/dbconfig");

let getCategoryByName = async (name) => {
  try {
    let data = await sqldb.categories.findOne({
      where: {
        name: name,
        is_deleted: 0,
      },
    });
    if (data) {
      return { status: true, data: data, message: "User found!" };
    } else {
      return { status: false, data: {}, message: "User not found!" };
    }
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let createCategory = async (categoryData) => {
  try {
    let category = await getCategoryByName(categoryData.name);
    if (category.status) {
      return {
        status: false,
        data: category,
        message: "Category with the same name already exists!",
      };
    }
    let data = await sqldb.categories.create(categoryData);

    return {
      status: true,
      data: data,
      message: "Category created successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let updateCategory = async (category_id, data) => {
  try {
    let category = await getCategoryByName(data.name);
    if (
      category.status &&
      JSON.parse(JSON.stringify(category)).data.category_id != category_id
    ) {
      return {
        status: false,
        data: category,
        message: "Category with the same name already exists!",
      };
    }
    await sqldb.categories.update(data, {
      where: {
        category_id: category_id,
      },
      individualHooks: true,
    });
    return {
      status: true,
      message: "Category updated successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let getAll = async () => {
  try {
    let categories = await sqldb.categories.findAll({
      where: { is_deleted: 0 },
    });
    return {
      status: true,
      data: categories,
      message: "Fetched all users successfully!",
    };
  } catch (error) {
    return { status: false, data: [], message: error.message, error };
  }
};

let getCategoryById = async (category_id) => {
  try {
    let category = await sqldb.categories.findByPk(category_id);
    return {
      status: true,
      data: category,
      message: "Fetched all categories successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

let deleteCategory = async (category_id) => {
  try {
    let category = await sqldb.categories.update(
      {
        is_deleted: 1,
      },
      {
        where: {
          category_id: category_id,
        },
      }
    );
    return {
      status: true,
      data: category,
      message: "Deleted category successfully!",
    };
  } catch (error) {
    return { status: false, data: error, message: error.message };
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getAll,
  getCategoryById,
  deleteCategory,
};

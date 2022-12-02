const Joi = require('joi');
const categoryService = require('../services/categoryService');
const postService = require('../services/postService');

const checkPost = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    categoryIds: Joi.array().required(),
  }).required().messages({
    'any.required': 'Some required fields are missing',
    'string.empty': 'Some required fields are missing',
});

const checkUpdate = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  }).required().messages({
    'any.required': 'Some required fields are missing',
    'string.empty': 'Some required fields are missing',
});

const validate = async (req, res, next, check) => {
    const post = req.body;
    const { error } = check.validate(post);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
  
    next();
};

const validatePost = async (req, res, next) => {
    validate(req, res, next, checkPost);
};

const validateUpdate = async (req, res, next) => {
    validate(req, res, next, checkUpdate);
};

const validateCategoryId = async (req, res, next) => {
    const { categoryIds } = req.body;
    const verifyCategory = await Promise.all(categoryIds
    .map((id) => categoryService.getByCategoryId(id)));
    const allValidaded = verifyCategory.every((item) => item !== null);
    if (!allValidaded) {
        return res.status(400).json({ message: 'one or more "categoryIds" not found' });
    }
  
    next();
};

const validatePostUser = async (req, res, next) => {
    const { id } = req.user;
    const verifyUser = await postService.getPostById(id);
    if (verifyUser.users.id !== id) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
  
    next();
};

module.exports = {
    validatePost,
    validateCategoryId,
    validatePostUser,
    validateUpdate,
};
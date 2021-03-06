const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.get(
  '/:modId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { modId } = req.params;
    const users = await User.findAll({
      where: {
        modId: modId 
      }
    });
    res.json({users})
  }
));

// Sign up
router.post(
  '/',
  validateSignup,
  asyncHandler(async (req, res) => {
    const user = await User.signup(req.body);

    await setTokenCookie(res, user);

    return res.json({
      user
    });
  })
);



module.exports = router;
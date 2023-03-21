const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');

// @desc login
// @route post /api/auth/login
// @access public
const login = async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ message: 'all fields are required' });
  }

  const foundUser = await userModel.findOne({ username }).exec();

  if (!foundUser.username || !foundUser.active) {
    return response.status(401).json({ message: 'unauthorized' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // creates Secure Cookie with refresh token
    response.cookie('__rt_token__', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send accessToken containing username and user role
    response.json({ foundUser, accessToken });
  } else {
    return response.status(401).json({ message: 'unauthorized' });
  }
};

// @desc register
// @route post /api/auth/register
// @access public
const register = async (request, response) => {
  const { username, password, roles } = request.body;

  // confirm data
  if (!username || !password) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  // check for duplicate username
  const duplicate = await userModel
    .findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return response.status(409).json({ message: 'Duplicate username' });
  }

  // hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = {
    username,
    password: hashedPwd,
    roles,
  };

  // create and store new user
  const user = await userModel.create(userObject);

  if (user) {
    //created
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.username,
          roles: user.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // create secure cookie with refresh token
    response.cookie('__rt_token__', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: 'none', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // send accessToken containing username and roles
    response.json({ user, accessToken });
    response.status(201).json({ message: `New user ${username} created` });
  } else {
    response.status(400).json({ message: 'Invalid user data received' });
  }
};

// @desc refresh
// @route get /api/auth/refresh
// @access public - because access token has expired
const refresh = (request, response) => {
  const cookies = request.cookies;

  if (!cookies?.__rt_token__)
    return response.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.__rt_token__;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return response.status(403).json({ message: 'Forbidden' });

      const foundUser = await userModel
        .findOne({
          username: decoded.username,
        })
        .exec();

      if (!foundUser)
        return response.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      response.json({ accessToken });
    }
  );
};

// @desc logout
// @route post /api/auth/logout
// @access public - just to clear cookie if exists
const logout = async (request, response) => {
  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(204); //no content

  response.clearCookie('__rt_token__', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  response.sendStatus(204);
  response.json({ message: 'Cookie cleared' });
};

module.exports = { login, register, refresh, logout };

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { userModel } from '../models/user';

// @desc Login
// @route POST /api/auth/login
// @access Public
const login = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  const foundUser = await userModel.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return response.status(401).json({ message: 'Unauthorized' });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return response.status(401).json({ message: 'Unauthorized' });

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

  // Create secure cookie with refresh token
  response.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'none', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  response.json({ accessToken });
};

// @desc Register
// @route POST /api/auth/register
// @access Public
const register = async (request: Request, response: Response) => {
  const { username, password, roles } = request.body;

  // Confirm data
  if (!username || !password) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  // Check for duplicate username
  const duplicate = await userModel
    .findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return response.status(409).json({ message: 'Duplicate username' });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPwd }
      : { username, password: hashedPwd, roles };

  // Create and store new user
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
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Create secure cookie with refresh token
    response.cookie('jwt', refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: 'none', //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    response.json({ accessToken });
    response.status(201).json({ message: `New user ${username} created` });
  } else {
    response.status(400).json({ message: 'Invalid user data received' });
  }
};

// @desc Refresh
// @route GET /api/auth/refresh
// @access Public - because access token has expired
const refresh = (request: Request, response: Response) => {
  const cookies = request.cookies;

  if (!cookies?.jwt)
    return response.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

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

// @desc Logout
// @route POST /api/auth/logout
// @access Public - just to clear cookie if exists
const logout = (request: Request, response: Response) => {
  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(204); //No content
  response.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  response.json({ message: 'Cookie cleared' });
};

export { login, register, refresh, logout };

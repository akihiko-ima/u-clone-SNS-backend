const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateIdenticon = require("../utils/generateIdenticon");


const prisma = new PrismaClient()


// 新規ユーザー登録API
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // iconの生成
  const defaultIconImage = generateIdenticon(email);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      Profile: {
        create: {
          bio: "はじめまして",
          profileImageUrl: defaultIconImage,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return res.json({ user });
});

// ユーザーログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: "そのユーザーは存在しません" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "そのパスワードは間違っています" })
  }

  // jwt-token
  const secretKey = process.env.SECRET_KEY;
  const token = jwt.sign({ id: user.id }, secretKey, {
    expiresIn: "1d",
  });
  return res.json({ token });
})

module.exports = router;

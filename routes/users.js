const express = require("express");
const db = require("../db/index");
const router = express.Router();
const bcrypt = require("bcryptjs");
// Encrypt

// Decrypt
// bcrypt.compareSync("plaintextpassword", hashedPassword);
// returns true

router.get("/", (req, res) => {
  db.query(
    `SELECT id, username AS name, avatar_url AS avatar FROM users;`
  ).then(({ rows: users }) => {
    const updatedUsers = users.map((user) => {
      return { ...user, room_id: null, channel_id: null };
    });
    res.json(updatedUsers);
  });
});

// TODO: REMOVE - Remove for deploy
// get single user
router.get("/:id", (req, res) => {
  db.query(
    `SELECT id, username AS name, avatar_url AS avatar FROM users WHERE id = $1;`,
    [req.params.id]
  ).then(({ rows: users }) => {
    const user = users[0];
    res.json({
      action: {
        type: "SET_USER",
        value: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          room_id: null,
          channel_id: null,
        },
      },
    });
  });
});

// get friends
router.get("/friends/:userID", (req, res) => {
  db.query(
    `
    SELECT users.* FROM friends
    JOIN users ON friend_id = users.id
    WHERE user_id = $1
    ;`,
    [req.params.userID]
  ).then(({ rows: friends }) => {
    res.json(friends);
  });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    `INSERT INTO users (username, email, password, avatar_url)
    VALUES ($1, $2, $3, 'https://i.pinimg.com/736x/f5/23/3a/f5233afc4af9c7be02cc1c673c7c93e9.jpg') RETURNING id, username, avatar_url;`,
    [name, email, bcrypt.hashSync(password, 10)]
  )
    .then((data) => {
      const dbResponse = data.rows[0];
      res.json({
        action: {
          type: "SET_USER",
          value: {
            id: dbResponse.id,
            name: dbResponse.username,
            avatar: dbResponse.avatar_url,
          },
        },
      });
    })
    .catch((err) => {
      res.json({
        action: {
          type: "SET_ERRORS",
          value:
            "Someone has already registered with that email, try a different one",
        },
      });
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(`SELECT * FROM users WHERE email = $1;`, [email]).then((data) => {
    const dbResponse = data.rows[0];
    if (dbResponse && bcrypt.compareSync(password, dbResponse.password)) {
      res.json({
        action: {
          type: "SET_USER",
          value: {
            id: dbResponse.id,
            name: dbResponse.username,
            avatar: dbResponse.avatar_url,
          },
        },
      });
    } else {
      res.json({
        action: { type: "SET_ERRORS", value: "Email/Password is incorrect" },
      });
    }
  });
});

// TODO: get all distinct users from the users table that are in the same rooms as the current logged in user

// TODO: Login will need to get a user by email and password they enter, that password will need to be compared against the hashed password (check INFO.md for directions)

module.exports = router;

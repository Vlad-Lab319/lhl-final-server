const express = require("express");
const db = require("../db/index");
const router = express.Router();

// router.get("/:channelID", (req, res) => {
//   db.query(`SELECT * FROM messages WHERE channel_id = $1;`, [
//     req.params.channelID,
//   ]).then(({ rows: messages }) => {
//     res.json(messages);
//   });
// });

// router.get("/:userID", (req, res) => {
//   db.query(
//     `SELECT DISTINCT(messages.*) FROM messages JOIN channels ON channels.id = messages.channel_id JOIN rooms ON channels.room_id = rooms.id JOIN room_users ON rooms.id = room_users.room_id JOIN users ON users.id = rooms.user_id WHERE users.id = $1 ORDER BY messages.created_at;`,
//     [req.params.userID]
//   ).then(({ rows: messages }) => {
//     res.json(messages);
//   });
// });

router.get("/", (req, res) => {
  db.query(`SELECT * FROM messages ORDER BY messages.created_at;`).then(
    ({ rows: messages }) => {
      res.json(messages);
    }
  );
});

router.post("/", (req, res) => {
  const { userID, channelID, message } = req.body;
  db.query(
    `
      INSERT INTO messages (user_id, channel_id, message) VALUES ($1, $2, $3) RETURNING *;
    `,
    [userID, channelID, message]
  )
    .then(({ rows: messages }) => {
      res.json(messages);
    })
    .catch((error) => console.log(error));
});

module.exports = router;

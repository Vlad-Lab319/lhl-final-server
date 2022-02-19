const express = require("express");
const db = require("../db/index");
const router = express.Router();

router.get("/:userID", (req, res) => {
  db.query(
    `SELECT channels.* FROM channels JOIN room_users ON channels.room_id = room_users.room_id WHERE room_users.user_id = $1;`,
    [req.params.userID]
  ).then(({ rows: channels }) => {
    res.json(channels);
  });
});

router.post("/edit", (req, res) => {
  const { name, id } = req.body;
  db.query(
    `
      UPDATE channels SET name=$1 where id=$2;
    `,
    [name, id]
  )
    .then(() => {
      res.json({});
    })
    .catch((error) => console.log(error));
});

router.post("/delete", (req, res) => {
  const { id } = req.body;
  db.query(
    `
      DELETE FROM channels where id=$1;
    `,
    [id]
  )
    .then(() => {
      res.json({});
    })
    .catch((error) => console.log(error));
});

router.post("/", (req, res) => {
  const { roomID, newChannelName } = req.body;
  db.query(
    `
      INSERT INTO channels (room_id, name) VALUES ($1, $2) RETURNING *;
    `,
    [roomID, newChannelName]
  )
    .then(({ rows: channels }) => {
      res.json(channels);
    })
    .catch((error) => console.log(error));
});

module.exports = router;

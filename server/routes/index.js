const express = require('express');
const router = express.Router();

// INDEX 
router.get('/', (req, res, next) => {
  res.json({ message: 'API Server - INDEX PAGE' })
});

module.exports = router;

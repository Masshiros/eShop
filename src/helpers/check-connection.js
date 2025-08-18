const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const INTERVAL = 5000;
const countConnections = () => mongoose.connections.length;
const checkOverload = () => {
  setInterval(() => {
    const numberConnections = countConnections();
    const numberCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numberCores * 4;
    console.log(`Active connections: ${numberConnections}`);
    console.log(`Memory Usage: ${memoryUsage/1024/1024} MB`);
    if (numberConnections > maxConnections) {
      console.log("Connection Overload Detected");
    }
  }, INTERVAL);
};
module.exports = {
  countConnections,
  checkOverload,
};

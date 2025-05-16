const express = require("express");
const bodyParser = require("body-parser");
const { SerialPort } = require("serialport");

const PORT = 3001;
const SERIAL_PORT_PATH = "/dev/cu.usbmodem1101";

const app = express();

app.use(bodyParser.text());
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

let serial;
try {
  serial = new SerialPort({
    path: SERIAL_PORT_PATH,
    baudRate: 9600,
    autoOpen: false,
  });

  serial.open((err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    } else {
      console.log(`alive on port ${SERIAL_PORT_PATH}`);
    }
  });

  serial.on("error", (err) => {
    console.error(err.message);
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("alive");
});

app.post("/display", (req, res) => {
  const message = req.body?.trim();

  if (!message) {
    return res.status(400).send("no message content");
  }

  const fullMessage = message + "\r\n";

  if (serial?.isOpen) {
    serial.write(fullMessage, (err) => {
      if (err) {
        return res.status(500).send("writing error");
      }
      res.send("sent");
    });
  } else {
    res
      .status(500)
      .send("port not open. check if being used by something else");
  }
});

setInterval(() => {}, 1000);

app.listen(PORT, () => {
  console.log(`express server running at http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";
import QRCode from 'qrcode';

const app = express();
const host = `localhost`;
const port = 3001;

// parse application/json
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/preview", async (req, res) => {
  if (!req.query?.url) {
    res.status(400);
    res.send("error");
    return;
  }

  // pass the link directly
  try {
    const data = await getLinkPreview(req.query.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    });
    res.status(200);
    res.send(data);
  } catch (err) {
    res.status(400);
    res.send(`error fetching url: ${err}`);
  }
});

const connectionsDictionary = {};

app.get('/reset', async(req, res) => {
    connectionsDictionary = {};
    res.send(true);
});

app.get('/connection-data', async(req, res) => {
    const offerUuid = req.query.uuid;

    res.send(connectionsDictionary[offerUuid]);
});

app.post("/register-offer", async (req, res) => {

    const uuid = req.body.uuid;
    const offer = req.body.offer;
    const appBasePath = req.body.appBasePath;

    connectionsDictionary[uuid] = {
        offer: offer,
        answer: undefined
    };

    const offerAcceptedUrl = `${appBasePath}?syncId=${uuid}`
    const qr = await QRCode.toDataURL(offerAcceptedUrl, {
        type: 'image/jpeg',
        rendererOpts: {
            quality: 2,
        }
    });

    res.send({
        qrCode: qr,
        url: offerAcceptedUrl,
        uuid: uuid
    });
});

app.post("/register-answer", async (req, res) => {

    const uuid = req.body.uuid;
    const answer = req.body.answer;

    if (!connectionsDictionary[uuid]) {
        connectionsDictionary[uuid] = {};
    }

    connectionsDictionary[uuid].answer = answer;

    res.send({
        success: true
    });
});

app.get ("/receive-offer", async (req, res) => {
    const offerUuid = req.query.uuid;

    res.send({
        offer: connectionsDictionary[offerUuid].offer
    });
});

app.get ("/receive-acceptance", async (req, res) => {
    const offerUuid = req.query.uuid;

    res.send({
        acceptance: connectionsDictionary[offerUuid].answer
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

import { Hono } from "hono";
import { Page } from "./pages/page";
import { Home } from "./pages/home";
const fs = require("node:fs");
const path = require("path");
import { serveStatic } from "hono/bun";


const app = new Hono();

const regexExp =
  /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/gi;

let AssignedDir: string;
let AssignedPort: number;

if (Bun.argv.indexOf("--dir") !== -1) {
  let idx = Bun.argv.indexOf("--dir");
  let lpath = Bun.argv[idx + 1];
  if (lpath && fs.existsSync(lpath) && fs.lstatSync(lpath).isDirectory()) {
    AssignedDir = lpath;
  } else {
    console.log("Invalid directory");
  }
}

if (Bun.argv.indexOf("--port") !== -1) {
  let idx = Bun.argv.indexOf("--port");
  let lport = Bun.argv[idx + 1];
  if (lport && !isNaN(lport) && regexExp.test(lport)) {
    AssignedPort = lport;
  } else {
    console.log("Invalid port");
  }
}

const defaultPort = AssignedPort || 3030;
const defaultPath = AssignedDir || "./";
const ScanPath = path.join(defaultPath);

let fileList = fs.readdirSync(ScanPath);


export type Video = {
  id: string;
  title: string;
  path: string;
  size: string;
  date: string;
};

const videos: Video[] = [];

for (let i = 0; i < fileList.length; i++) {
  let videoPath = path.join(ScanPath, fileList[i]);

  let stats = fs.statSync(videoPath);
  if (stats.isFile() && path.extname(videoPath) === '.mp4') {
    videos.push({
      id: String(i),
      title: fileList[i],
      path: `./${fileList[i]}`,
      size: stats.size,
      date: stats.mtimeMs || stats.ctimeMs,
    });
  }
}

const getVideos = () => videos;

const getVideo = (id: string) => {
  return videos.find((video) => video.id == id);
};

// Controller
app.get("/", (c) => {
  const videos = getVideos();
  return c.html(<Home videos={videos} />);
});

app.use("/static/*", serveStatic({ root: "./src" }));

app.get("/video/:id{[0-9]+}", (c) => {
  const id = c.req.param("id");
  const video = getVideo(id);
  if (!video) return c.notFound();
  return c.html(<Page video={video} />);
});

app.get("/stream/:id{[0-9]+}", (c) => {
  const id = c.req.param("id");
  const video = getVideo(id);
  const range = c.req.header("range");
  if (!range) {
    return c.notFound();
  }
  let videoPath = path.join(ScanPath, video.path);

  let stat = fs.statSync(videoPath);
  let videoSize = stat.size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const videoStream = Bun.file(videoPath).stream(start, end);
  c.header("Content-Range", `bytes ${start}-${end}/${videoSize}`);
  c.header("Accept-Ranges", "bytes");
  c.header("Content-Length", String(contentLength));
  c.header("Content-Type", "video/mp4");
 
  return c.stream(async (stream) => {
    await stream.pipe(videoStream);
  });
});

export default {
  port: defaultPort,
  fetch: app.fetch,
};

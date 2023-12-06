import { Layout } from "../components/Layout";
import type { Video } from "../index";

const toDate = (ms) => new Date(ms).toDateString();
const textTruncate = (text) => {
  let len = 25;
  return text.substring(0, len);
};

function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

const Tr = (props: { video: Video }) => (
  <tr>
    <td>{parseInt(props.video.id) + 1}</td>
    <td>
      <a
        href={`/video/${props.video.id}`}
        data-toggle="tooltip"
        data-placement="top"
        title={props.video.title}
      >
        {textTruncate(props.video.title)}
      </a>
    </td>
    <td>{formatBytes(props.video.size)}</td>
    <td>{toDate(props.video.date)}</td>
  </tr>
);

export const Home = (props: { videos: Video[] }) => {
  return (
    <Layout title={"Video List"}>
      
        <div class="row">
          <div class="col-md-2"></div>
          <div class="col-md-8">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>size</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {props.videos.map((post) => (
                  <Tr video={post} />
                ))}
              </tbody>
            </table>
          </div>
          <div class="col-md-2"></div>
        </div>
      
    </Layout>
  );
};

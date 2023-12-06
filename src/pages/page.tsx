import { Layout } from "../components/Layout";
import type { Video } from "../index";

export const Page = (props: { video: Video }) => {
  return (
    <Layout title={props.video.title}>
      
        <div class="row">
          
          <div class="col-md-12">
            <div class="card">
              <h5 class="card-header">{props.video.title}</h5>
              <div class="card-body">
                <video id="my-video" controls preload="auto" width={"100%"} height={"60%"}>
                  <source src={`/stream/${props.video.id}`} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          
        </div>
      
    </Layout>
  );
};

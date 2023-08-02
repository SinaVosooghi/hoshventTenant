import moment from "moment";
import Blog from "../../datamodel/Blog";
require("./style.less");

const BlogItem = ({ blog }: { blog: Blog }) => {
  return (
    <div className="blog-slider-item">
      <div
        className="item-image"
        style={{
          backgroundImage: `url('${
            process.env.NEXT_PUBLIC_SITE_URL + "/" + blog.image
          }')`,
        }}
      >
        <span className="top-arrow">
          <img src="/assets/latest/musical-note-sharp.png" alt="rasta" />
        </span>
        <div className="item-content">
          <p className="item-title">{blog.title}</p>
          <span className="item-author">
            {blog?.author?.firstName} {blog?.author?.lastName}
          </span>
        </div>
      </div>

      <div className="item-info">
        {moment(blog.created).format("YYYY MMMM dddd D")}
      </div>
    </div>
  );
};

export default BlogItem;

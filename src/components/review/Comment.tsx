import { Image, Rate } from "antd";
import moment from "moment";
import { useEffect } from "react";

const CommentItem = ({
  review,
  hideRating,
}: {
  review: any;
  hideRating?: boolean;
}) => {
  let total = 0;

  useEffect(() => {
    if (review?.answers?.length) {
      Object.entries(review.answers).map(([key, value]) => {
        // @ts-ignore
        (total += value) / Object.keys(review.answers).length;
      });
    }
  }, [review]);

  return (
    <div className="comment-item">
      <div className="comment-info">
        <div className="comment-avatar">
          <Image
            src="/assets/user.png"
            alt="avatar"
            preview={false}
            width={28}
            height={28}
          />
        </div>
        <div className="comment-user">
          <div className="comment-user-name">
            <p>
              {review?.user?.firstName ?? ""} {review?.user?.lastName ?? ""}
            </p>
            <span> {moment(review?.created).format("YYYY/M/D")}</span>
          </div>
          {!hideRating && (
            <Rate
              disabled
              allowHalf
              defaultValue={total / Object.keys(review?.answers).length}
            />
          )}
        </div>
      </div>
      <p className="comment">{review?.comment?.body}</p>
    </div>
  );
};

export default CommentItem;

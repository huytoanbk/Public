import { Card, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

const PostList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          cover={
            <img
              alt="example"
              src={post.images[0]}
              className="rounded-t-lg h-40 w-full object-cover"
            />
          }
        >
          <Title level={4} ellipsis={{ rows: 1 }}>
            {post.title}
          </Title>
          <div
            className="line-clamp-2 mb-1"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          ></div>
          <div className="text-lg font-semibold text-red-500 mb-2">
            Giá: {post.price} VNĐ
          </div>
          <div className="text-sm text-gray-500">
            Diện tích: {post.acreage} m²
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Đã đăng {post.uptime}
          </div>
          <div className="text-xs text-gray-400">
            {post.district}, {post.province}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PostList;

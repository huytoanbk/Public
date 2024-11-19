import { Card, List, Typography } from "antd";
import CardHorizontal from "../../components/CardItem/CardHorizontal";

const { Title, Paragraph, Text } = Typography;

const PostList = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <List
        itemLayout="vertical"
        dataSource={posts}
        renderItem={(item) => <CardHorizontal item={item} />}
        pagination={false}
      />
    </div>
  );
};

export default PostList;

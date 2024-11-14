import { Avatar } from 'antd';

const AuthorInfo = ({ author }) => {
  return (
    <div className="text-center">
      <Avatar src={author.avatar} size={80} className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold">{author.fullName}</h3>
      <p className="text-gray-500">Bài viết: {author.totalPost}</p>
      <p className="text-gray-400 text-sm">Hoạt động: {author.uptime}</p>
    </div>
  );
};

export default AuthorInfo;

const AuthorInfo = ({ author }) => {
  return (
    <div className="text-sm text-gray-900 duration-300  rounded-lg  bg-white">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <a href="#">
            <img className="w-10 h-10 rounded-full border border-solid border-gray-200 shadow-sm border-1" src={author.avatar} />
          </a>
        </div>
        <p className="text-base font-semibold leading-none text-gray-900">
          <a href="#">{author.fullName}</a>
        </p>
        <p className="mb-3 text-sm font-normal">
          <a href="#" className="hover:underline text-gray-600">
            {author.email}
          </a>
        </p>
        <p className="mb-4 text-sm text-gray-700">{author?.description}</p>
        <ul className="flex text-sm gap-x-3">
          <li className="me-2">
            <span>Hoạt động:</span>
            <span className="font-semibold text-gray-900">{author.uptime}</span>
          </li>
          <li className="me-2">
            <span>Bài viết: </span>
            <span className="font-semibold text-gray-900">
              {author.totalPost}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthorInfo;

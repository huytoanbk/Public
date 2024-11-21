import { List } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ImageGallery from "../ImageGallery";
import { BiArea } from "react-icons/bi";
import { IoPricetag } from "react-icons/io5";
import { IoIosTimer } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { getAvatar, getThumbnail } from "../../utiils/format-info-room";
import LikeButton from "../LikeButton";

export default function CardHorizontal({ item }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/author/${item?.userPostRes?.id}`);
  };
  return (
    <List.Item
      className="flex-row-reverse product-card rounded-lg shadow mb-4 cursor-pointer"
      onClick={() => navigate(`/post/${item.id}`)}
      extra={
        item?.images?.length > 1 ? (
          <ImageGallery images={item.images} />
        ) : (
          <div className="w-full h-[160px]">
            <img
              src={getThumbnail(item.images[0])}
              alt={item.title}
              className="product-image object-contain"
            />
          </div>
        )
      }
    >
      <List.Item.Meta
        className="!mb-0"
        title={
          <div className="flex items-center justify-between">
            <Link
              to={`/post/${item.id}`}
              className="text-lg font-semibold text-gray-900 dark:text-black line-clamp-1"
            >
              {item.title}
            </Link>
            <LikeButton post={item} />
          </div>
        }
      />
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm flex items-center">
          <BiArea className="mr-1" width={12} height={12} />
          Diện tích: <span className="font-semibold ml-1">
            {item.acreage}
          </span>{" "}
          m²
        </p>
        <div className="text-gray-700 font-semibold text-lg flex items-center">
          <IoPricetag className="mr-1 text-indigo-600" />
          {item.price.toLocaleString()} đ
        </div>
      </div>
      <div
        className="line-clamp-2 mb-1"
        dangerouslySetInnerHTML={{
          __html: item.content,
        }}
      ></div>
      <div className="flex items-center justify-between">
        <span className="py-1 text-xs font-regular text-gray-900 flex items-center">
          <IoIosTimer className="mr-[6px] w-4 h-4" width={16} height={16} />
          Đã đăng {item.uptime}
        </span>
        <span className="py-1 text-xs font-regular text-gray-900 flex items-center">
          <CiLocationOn className="mr-[4px] w-4 h-4" width={16} height={16} />
          {item.district}, {item.province}
        </span>
      </div>
      <div className="border border-solid border-[#e5e7eb] my-1"></div>
      <div className="flex items-center justify-between">
        <figcaption className="flex items-center" onClick={handleClick}>
          <div className="border border-[#8492a6] rounded-full w-8 h-8 overflow-hidden border-solid	">
            <img
              className="w-full h-full object-contain"
              src={getAvatar(item.userPostRes.avatar)}
              alt="profile picture"
            />
          </div>
          <div className="font-medium text-left rtl:text-right ms-3">
            <div>{item.userPostRes.fullName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0">
              {item.userPostRes.totalPost} tin đăng
            </div>
          </div>
        </figcaption>
        <Link
          href={`/post/${item.id}`}
          className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Xem ngay
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </List.Item>
  );
}

export function timeAgo(createdAt) {
  const [date, timeWithOffset] = createdAt.split("T");
  const [day, month, year] = date.split("-");
  const formattedCreatedAt = `${year}-${month}-${day}T${timeWithOffset}`;

  const createdDate = new Date(formattedCreatedAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now - createdDate) / 1000);

  if (isNaN(diffInSeconds)) return "Thời gian không hợp lệ";

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} giây trước`;
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else {
    return `${days} ngày trước`;
  }
}

export function getRoomType(roomType) {
  if (!roomType) return "";
  switch (roomType.toUpperCase()) {
    case "RENT":
      return "Cho thuê";
    case "GRAFT":
      return "Ở ghép";
    default:
      return "";
  }
}

export function getRoomStatus(statusRoom) {
  if (!statusRoom) return "";
  switch (statusRoom.toUpperCase()) {
    case "EMPTY":
      return "Nhà trống";
    case "FULLY_FURNISHED":
      return "Nội thất đầy đủ";
    case "LUXURY_FURNITURE":
      return "Nội thất cao cấp";
    default:
      return "";
  }
}

export function getPostStatus(statusRoom) {
  if (!statusRoom) return "";
  switch (statusRoom.toUpperCase()) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "PENDING":
      return "Đang chờ duyệt";
    case "INACTIVE":
      return "Không hoạt động";
    case "REJECT":
      return "Bị từ chối";
    default:
      return "";
  }
}

export function getAvatar(avatar) {
  if (!avatar) return "./default-avatar.jpg";
  return avatar;
}

export function getThumbnail(thumbnail) {
  if (!thumbnail) return "./default-thumbnail.png";
  return thumbnail;
}

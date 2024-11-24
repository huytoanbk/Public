export const generateDateLabels = (startDate, endDate) => {
  const labels = [];
  let currentDate = startDate.clone();
  const lastDate = endDate.clone();

  while (
    currentDate.isBefore(lastDate) ||
    currentDate.isSame(lastDate, "day")
  ) {
    labels.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }

  return labels;
};

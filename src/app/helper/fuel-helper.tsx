import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns";

export const groupByTimeInterval = (logs, interval) => {
  const groupedData = {};

  logs.forEach((log) => {
    const date = new Date(log.purchase_date);
    let key;

    switch (interval) {
      case "daily":
        key = format(date, "yyyy-MM-dd"); // Group by day
        break;

      case "weekly":
        key = startOfWeek(date, { weekStartsOn: 1 }); // Group by week
        break;
      case "monthly":
        key = startOfMonth(date); // Group by month
        break;
      case "yearly":
        key = startOfYear(date); // Group by year
        break;
      default:
        key = format(date, "yyyy-MM-dd"); // Default to daily
        break;
    }

    const keyString = key.toString();

    if (!groupedData[keyString]) {
      groupedData[keyString] = { distance: 0, liters: 0 };
    }

    groupedData[keyString].distance += log.distance_traveled;
    groupedData[keyString].liters += log.fuel_liters_quantity;
  });

  return Object.entries(groupedData).map(([key, value]) => ({
    label: key,
    ...value,
  }));
};

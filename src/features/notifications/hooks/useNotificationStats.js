import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { notificationService } from "../services/notificationService";

// AdminNotificationController has no dedicated stats endpoint, and the data
// model tracks read/unread per recipient rather than a sent/delivered/failed
// pipeline — so "Success Rate" / "Failed" from the original spec don't map
// to anything the API returns. These are computed client-side from the
// notification list instead: Total Sent, Sent Today, and Read Rate.
export function useNotificationStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSent: 0, sentToday: 0, readRate: 0 });

  useEffect(() => {
    let active = true;
    notificationService.getNotifications({ page: 1, pageSize: 1000 }).then((res) => {
      if (!active) return;
      const items = res.data.items;
      const totalSent = res.data.totalCount;
      const today = dayjs().startOf("day");
      const sentToday = items.filter((n) => dayjs(n.createdAt).isAfter(today)).length;
      const readCount = items.filter((n) => n.isRead).length;
      const readRate = items.length ? Math.round((readCount / items.length) * 100) : 0;
      setStats({ totalSent, sentToday, readRate });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { loading, stats };
}

import React, { useEffect, useState } from "react";
import { Descriptions, Select, Input, Button, Space, Skeleton, Avatar, App } from "antd";
import { SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { ticketService } from "../services/ticketService";

const STATUSES = ["Open", "InProgress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

export default function TicketDetailDrawer({ open, ticket, loading, onClose, onChanged }) {
  const { message } = App.useApp();
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (open && ticket?.id) {
      setMessagesLoading(true);
      ticketService.getMessages(ticket.id).then((res) => {
        setMessages(res.data.items);
        setMessagesLoading(false);
      });
    }
  }, [open, ticket?.id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await ticketService.updateStatus(ticket.id, { status });
      message.success(`Status set to ${status}.`);
      onChanged?.();
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (priority) => {
    setUpdating(true);
    try {
      await ticketService.updatePriority(ticket.id, { priority });
      message.success(`Priority set to ${priority}.`);
      onChanged?.();
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await ticketService.addMessage(ticket.id, { message: reply.trim() });
      setMessages((prev) => [...prev, res.data]);
      setReply("");
      onChanged?.(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <DetailDrawer open={open} title={ticket ? `Ticket #${ticket.id}` : "Ticket Detail"} width={560} onClose={onClose}>
      {loading || !ticket ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="User">{ticket.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Subject">{ticket.subject}</Descriptions.Item>
            <Descriptions.Item label="Created">{dayjs(ticket.createdAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
            {ticket.closedAt && (
              <Descriptions.Item label="Closed">{dayjs(ticket.closedAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
            )}
          </Descriptions>

          <Space size={12} style={{ width: "100%", marginBottom: 16 }}>
            <Select
              style={{ width: 160 }}
              value={ticket.status}
              disabled={updating}
              onChange={handleStatusChange}
              options={STATUSES.map((s) => ({ value: s, label: s }))}
            />
            <Select
              style={{ width: 140 }}
              value={ticket.priority}
              disabled={updating}
              onChange={handlePriorityChange}
              options={PRIORITIES.map((p) => ({ value: p, label: p }))}
            />
            <StatusTag status={ticket.status} />
          </Space>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {messagesLoading ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              messages.map((m) => (
                <div key={m.id} style={{ display: "flex", gap: 8, flexDirection: m.isFromAdmin ? "row-reverse" : "row" }}>
                  <Avatar size={28} style={{ backgroundColor: m.isFromAdmin ? "#2F6FED" : "#98A2B3", flexShrink: 0 }}>
                    {m.senderEmail.charAt(0).toUpperCase()}
                  </Avatar>
                  <div
                    className={`merfit-timeline-message ${m.isFromAdmin ? "is-admin" : ""}`}
                    style={{ maxWidth: "80%" }}
                  >
                    {m.message}
                    <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 4 }}>
                      {dayjs(m.createdAt).format("DD MMM, HH:mm")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Space.Compact style={{ width: "100%" }}>
            <Input.TextArea
              rows={2}
              placeholder="Write a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              disabled={ticket.status === "Closed"}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={sending}
              onClick={handleReply}
              disabled={ticket.status === "Closed"}
            />
          </Space.Compact>
        </>
      )}
    </DetailDrawer>
  );
}

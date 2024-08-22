// src/components/Timestamp.tsx
import React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface TimestampProps {
  date: string;
  className: string;
}

const Timestamp: React.FC<TimestampProps> = ({ date, className }) => {
  const dateObject = parseISO(date);
  const timeAgo = formatDistanceToNow(dateObject, { addSuffix: true });

  return <span className={className}>{timeAgo}</span>;
};

export default Timestamp;

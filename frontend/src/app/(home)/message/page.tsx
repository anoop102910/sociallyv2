"use client";
import ConvList from "./ConvList";
import ChatArea from "./ChatArea";

const MessagePage = () => {
  return (
    <div className="flex justify-between gap-4">
      <ConvList />
      <ChatArea />
    </div>
  );
};

export default MessagePage;

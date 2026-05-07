import { initSocket } from "@/config/socket";
import { setNotificationCount } from "@/slices/common";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = initSocket();

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_admin");
    });

    socket.on("notification_count_updated", (data) => {
      dispatch(setNotificationCount(data.count ?? 0));
    });

    return () => {
      socket.off("connect");
      socket.off("notification_count_updated");
    };
  }, []);

  return socketRef.current;
};

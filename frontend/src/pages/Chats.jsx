import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { RepairContext, backend_url } from "../Context/ALlContext";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};
const socketOrigin = backend_url.replace(/\/api\/?$/i, "");

const Chats = () => {
  const { role } = useContext(RepairContext);
  const location = useLocation();
  const [threads, setThreads] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const selectedThreadRef = useRef("");
  const messageListRef = useRef(null);
  const bootstrapTriedRef = useRef(false);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      withAccountId: String(params.get("with") || "").trim(),
      problemId: String(params.get("problemId") || "").trim(),
    };
  }, [location.search]);

  const selectPreferredThreadId = useCallback(
    (threadList = [], currentThreadId = "") => {
      if (!Array.isArray(threadList) || threadList.length === 0) return "";

      if (queryParams.withAccountId || queryParams.problemId) {
        const preferredThread = threadList.find((thread) => {
          const matchCounterpart =
            !queryParams.withAccountId ||
            String(thread?.counterpart?.accountId || "") === queryParams.withAccountId;
          const matchProblem =
            !queryParams.problemId ||
            String(thread?.problemId || "") === queryParams.problemId;
          return matchCounterpart && matchProblem;
        });
        if (preferredThread?.threadId) {
          return preferredThread.threadId;
        }
      }

      if (currentThreadId && threadList.some((thread) => thread?.threadId === currentThreadId)) {
        return currentThreadId;
      }

      return threadList[0]?.threadId || "";
    },
    [queryParams.problemId, queryParams.withAccountId]
  );

  const upsertMessage = useCallback((incomingMessage) => {
    if (!incomingMessage?.id) return;

    setMessages((previousMessages) => {
      const alreadyPresent = previousMessages.some((item) => item?.id === incomingMessage.id);
      if (alreadyPresent) return previousMessages;
      return [...previousMessages, incomingMessage];
    });
  }, []);

  const updateThreadPreview = useCallback(
    (incomingMessage) => {
      if (!incomingMessage?.threadId) return;

      setThreads((previousThreads) =>
        previousThreads.map((thread) => {
          if (thread.threadId !== incomingMessage.threadId) return thread;

          const messageFromCurrentRole = incomingMessage.senderRole === role;
          const nextUnreadCount =
            thread.threadId === selectedThreadRef.current || messageFromCurrentRole
              ? 0
              : Number(thread?.unreadCount || 0) + 1;

          return {
            ...thread,
            unreadCount: nextUnreadCount,
            updatedAt: incomingMessage.createdAt,
            lastMessage: {
              text: incomingMessage.text,
              senderAccountId: incomingMessage.senderAccountId,
              senderRole: incomingMessage.senderRole,
              createdAt: incomingMessage.createdAt,
            },
          };
        })
      );
    },
    [role]
  );

  const loadInbox = useCallback(
    async (preferredThreadId = "") => {
      if (!role) return;
      try {
        setLoadingInbox(true);
        const response = await axios.get(`${backend_url}/api/chat/inbox`, {
          withCredentials: true,
        });

        const threadList = Array.isArray(response?.data?.threads) ? response.data.threads : [];
        let workingThreads = threadList;
        let nextThreadId = selectPreferredThreadId(
          threadList,
          preferredThreadId || selectedThreadRef.current
        );

        if (
          !nextThreadId &&
          queryParams.withAccountId &&
          !bootstrapTriedRef.current &&
          (role === "user" || queryParams.problemId)
        ) {
          bootstrapTriedRef.current = true;
          const bootstrapResponse = await axios.post(
            `${backend_url}/api/chat/threads/bootstrap`,
            {
              problemId: queryParams.problemId,
              counterpartAccountId: queryParams.withAccountId,
            },
            { withCredentials: true }
          );
          const bootstrappedThread = bootstrapResponse?.data?.thread;
          if (bootstrappedThread?.threadId) {
            workingThreads = [bootstrappedThread, ...threadList];
            nextThreadId = bootstrappedThread.threadId;
          }
        }

        setThreads(workingThreads);
        setSelectedThreadId(nextThreadId);
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Unable to load inbox");
      } finally {
        setLoadingInbox(false);
      }
    },
    [queryParams.problemId, queryParams.withAccountId, role, selectPreferredThreadId]
  );

  const loadMessages = useCallback(
    async (threadId) => {
      if (!threadId) {
        setMessages([]);
        return;
      }

      try {
        setLoadingMessages(true);
        const response = await axios.get(
          `${backend_url}/api/chat/threads/${threadId}/messages`,
          { withCredentials: true }
        );

        const threadMessages = Array.isArray(response?.data?.messages)
          ? response.data.messages
          : [];
        setMessages(threadMessages);
        setThreads((previousThreads) =>
          previousThreads.map((thread) =>
            thread.threadId === threadId ? { ...thread, unreadCount: 0 } : thread
          )
        );
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Unable to load messages");
      } finally {
        setLoadingMessages(false);
      }
    },
    []
  );

  useEffect(() => {
    selectedThreadRef.current = selectedThreadId;
  }, [selectedThreadId]);

  useEffect(() => {
    bootstrapTriedRef.current = false;
  }, [queryParams.problemId, queryParams.withAccountId]);

  useEffect(() => {
    if (!role) return;
    loadInbox();
  }, [loadInbox, role]);

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([]);
      return;
    }

    loadMessages(selectedThreadId);
    socketRef.current?.emit("chat:join-thread", { threadId: selectedThreadId });
  }, [loadMessages, selectedThreadId]);

  useEffect(() => {
    if (!role) return;

    const socket = io(socketOrigin, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));
    socket.on("chat:new-message", (payload = {}) => {
      const incomingMessage = payload?.message;
      if (!incomingMessage?.id) return;

      if (payload.threadId === selectedThreadRef.current) {
        upsertMessage(incomingMessage);
      }
      updateThreadPreview(incomingMessage);
    });
    socket.on("chat:thread-updated", (payload = {}) => {
      loadInbox(payload?.threadId || selectedThreadRef.current);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setSocketConnected(false);
    };
  }, [loadInbox, role, updateThreadPreview, upsertMessage]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, selectedThreadId]);

  const selectedThread = useMemo(
    () => threads.find((thread) => thread?.threadId === selectedThreadId) || null,
    [selectedThreadId, threads]
  );

  const handleSendMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = String(messageText || "").trim();
    if (!trimmedMessage || !selectedThreadId) return;

    if (!socketRef.current || !socketConnected) {
      toast.error("Chat is reconnecting. Please wait...");
      return;
    }

    setMessageText("");
    socketRef.current.emit(
      "chat:send-message",
      { threadId: selectedThreadId, text: trimmedMessage },
      (acknowledgement = {}) => {
        if (!acknowledgement?.success) {
          setMessageText(trimmedMessage);
          toast.error(acknowledgement?.msg || "Unable to send message");
          return;
        }

        if (acknowledgement?.message) {
          upsertMessage(acknowledgement.message);
          updateThreadPreview(acknowledgement.message);
        }
      }
    );
  };

  if (!role || !["user", "repairer"].includes(role)) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] pt-28 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 border border-gray-100 text-center text-gray-600">
          Please log in to view chats.
          <div className="mt-3">
            <Link to="/login" className="text-sm text-black font-semibold underline">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] pt-24 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Inbox</h1>
          <Link
            to={role === "repairer" ? "/repairer/account" : "/"}
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Back
          </Link>
        </div>

        <div className="grid lg:grid-cols-[340px_1fr] gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <p className="font-semibold text-gray-800">Conversations</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  socketConnected ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {socketConnected ? "Live" : "Connecting"}
              </span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {loadingInbox ? (
                <div className="p-4 text-sm text-gray-500">Loading inbox...</div>
              ) : threads.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">
                  No chats yet. Start a chat from a repairer profile or from a repair request.
                </div>
              ) : (
                threads.map((thread) => {
                  const isActive = thread.threadId === selectedThreadId;
                  const previewText = thread?.lastMessage?.text || "Start chatting";
                  return (
                    <button
                      key={thread.threadId}
                      type="button"
                      onClick={() => setSelectedThreadId(thread.threadId)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 transition ${
                        isActive ? "bg-[#f5f2ed]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {thread?.counterpart?.name || "Contact"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {thread?.problemTitle || "Repair discussion"}
                          </p>
                        </div>
                        {Number(thread?.unreadCount || 0) > 0 && (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-black text-white text-[11px] flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{previewText}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatTime(thread?.lastMessage?.createdAt || thread?.updatedAt)}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow flex flex-col min-h-[70vh] h-[70vh] overflow-hidden">
            {!selectedThread ? (
              <div className="m-auto text-center text-gray-500 px-5">
                Select a conversation to view messages.
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">
                    {selectedThread?.counterpart?.name || "Contact"}
                  </p>
                  <p className="text-sm text-gray-500">{selectedThread?.problemTitle}</p>
                </div>

                <div ref={messageListRef} className="flex-1 p-4 overflow-y-auto bg-[#fbfaf8]">
                  {loadingMessages ? (
                    <div className="text-sm text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No messages yet. Start the conversation.
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMine = message.senderRole === role;
                      return (
                        <div
                          key={message.id}
                          className={`flex mb-3 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                              isMine
                                ? "bg-black text-white rounded-br-md"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                isMine ? "text-gray-300" : "text-gray-400"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-gray-100 flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                    maxLength={2000}
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-xl font-medium cursor-pointer disabled:opacity-60"
                    disabled={!messageText.trim() || !socketConnected}
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;

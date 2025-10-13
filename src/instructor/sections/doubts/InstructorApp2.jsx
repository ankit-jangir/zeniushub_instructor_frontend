import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './InstructorApp.css';

const socket = io('http://localhost:3000', {
  autoConnect: true,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

const MessageList = React.memo(({ messages, userId, contacts, activeRoom, contactStatuses }) => {
  return messages.map(msg => {
    return (
      <div
        key={msg.messageId}
        className={`flex mb-2  ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs p-2  ml-3 rounded-lg ${msg.userId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <p className="text-sm font-bold">
            {msg.userId === userId
              ? 'You'
              : contacts.find(c => c.id === msg.userId)?.name || msg.userId}
          </p>
          <p>{msg.content}</p>
          <div className="flex justify-between items-center">
            <p className="text-xs opacity-50">{msg.timestamp}</p>
            {msg.userId === userId && (
              <span className="text-xs">
                {msg.seen ? (
                  <span className="seen-tick">seen</span>
                ) : msg.delivered || contactStatuses[msg.targetId] === 'Online' ? (
                  <span className="double-tick">✓✓</span>
                ) : (
                  <span className="single-tick">✓</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  });
});

const InstructorApp = () => {
  const [userId, setUserId] = useState('');
  const [joinedRooms, setJoinedRooms] = useState(new Set());
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [activeRoom, setActiveRoom] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [isConnected, setConnected] = useState(false);
  const [studentStatuses, setStudentStatuses] = useState({});
  const [targetStatus, setTargetStatus] = useState('Offline');
  const [unseenCounts, setUnseenCounts] = useState({});
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [messageOffsets, setMessageOffsets] = useState({});
  const [totalMessages, setTotalMessages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const hasRegistered = useRef(false);
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const chatContainerRef = useRef(null);

  const messagesPerPage = 20;
  const userType = 'instructor';

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getRoomId = (id1, id2) => [id1, id2].sort().join('_');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      console.log('Scrolled to bottom');
    }
  };

  const checkIfAtBottom = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      return scrollHeight - scrollTop - clientHeight < 10;
    }
    return true;
  };

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsAtBottom(checkIfAtBottom());
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (messages[activeRoom]?.length > 0 && !isLoading && !isLoadingOlderMessages && isAtBottom) {
      scrollToBottom();
    }
  }, [messages, activeRoom, isLoading, isLoadingOlderMessages, isAtBottom]);

  useEffect(() => {
    if (activeRoom && messages[activeRoom]?.length > 0 && !isLoadingOlderMessages) {
      scrollToBottom();
      setIsAtBottom(true);
    }
  }, [activeRoom]);

  useEffect(() => {
    if (userId && !hasRegistered.current && isValidEmail(userId)) {
      socket.emit('registerUser', { userId });
      console.log(`Registering instructor ${userId}`);
      hasRegistered.current = true;
      fetch(`http://localhost:3000/api/v1/chat/students/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log('Fetched students:', data);
          setStudents(data);
          setError('');
        })
        .catch(err => {
          console.error('Fetch students error:', err.message);
          setError('Failed to load students. Please try again.');
        });
    } else if (userId && !isValidEmail(userId)) {
      setError('Please enter a valid email address');
    }
  }, [userId]);

  useEffect(() => {
    let observerTimeout = null;
    const handleLoadMore = debounce(() => {
      const targetId = students.find(c => getRoomId(userId, c.id) === activeRoom)?.id;
      if (targetId) {
        const offset = messageOffsets[activeRoom] || 0;
        const total = totalMessages[activeRoom] || 0;
        if (offset < total) {
          console.log(`Loading more messages for ${activeRoom} at offset ${offset}`);
          setIsLoading(true);
          setIsLoadingOlderMessages(true);
          socket.emit('loadMoreMessages', {
            userId,
            userType,
            targetId,
            offset: offset,
            limit: messagesPerPage,
          });
        } else {
          console.log(`No more messages to load for ${activeRoom} (offset=${offset}, total=${total})`);
          if (messagesTopRef.current) {
            observer.unobserve(messagesTopRef.current);
          }
        }
      }
    }, 300);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && activeRoom && !isLoadingOlderMessages) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (messagesTopRef.current && activeRoom) {
      observer.observe(messagesTopRef.current);
    }

    return () => {
      if (messagesTopRef.current) {
        observer.unobserve(messagesTopRef.current);
      }
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }
    };
  }, [activeRoom, userId, students, messageOffsets, totalMessages, isLoading, isLoadingOlderMessages]);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      setError('');
      console.log(`Connected: ${socket.id}`);
      if (userId && isValidEmail(userId) && !hasRegistered.current) {
        socket.emit('registerUser', { userId });
        console.log(`Re-registering instructor ${userId} after reconnect`);
        hasRegistered.current = true;
      }
    });

    socket.on('connect_error', (err) => {
      setConnected(false);
      setError(`Connection failed: ${err.message}`);
      console.error(`Socket connection error: ${err.message}`);
    });

    socket.on('receiveMessage', (data) => {
      console.log('Received message:', data);
      const roomId = getRoomId(data.userId, data.targetId);
      setMessages(prev => {
        const updatedMessages = { ...prev };
        const roomMessages = updatedMessages[roomId] || [];
        if (!roomMessages.some(msg => msg.messageId === data.messageId)) {
          const isActiveRoom = roomId === activeRoom;
          const messageToAdd = isActiveRoom && data.userId !== userId && data.targetId === userId
            ? { ...data, seen: true }
            : { ...data };
          updatedMessages[roomId] = [...roomMessages, messageToAdd];
          console.log(`Added message ${data.messageId} to ${roomId}`);
          if (isActiveRoom && data.userId !== userId && !data.seen) {
            socket.emit('messageSeen', { messageId: data.messageId, userId });
            if (isAtBottom && !isLoading) {
              console.log(`Scrolling to bottom for new message in active room ${roomId}`);
              scrollToBottom();
            }
          }
        } else {
          console.log(`Skipped duplicate message ${data.messageId} in ${roomId}`);
        }
        return updatedMessages;
      });
      if (data.userId !== userId && data.targetId === userId && !data.seen && roomId !== activeRoom) {
        console.log(`Setting hasNewMessage to true for message in ${roomId}`);
        setHasNewMessage(true);
        setUnseenCounts(prev => ({
          ...prev,
          [roomId]: (prev[roomId] || 0) + 1,
        }));
      }
    });

    socket.on('messageDelivered', ({ messageId, userId: deliveredTo }) => {
      console.log(`Message ${messageId} delivered to ${deliveredTo}`);
      setMessages(prev => {
        const updatedMessages = { ...prev };
        Object.keys(updatedMessages).forEach(roomId => {
          updatedMessages[roomId] = updatedMessages[roomId].map(msg =>
            msg.messageId === messageId ? { ...msg, delivered: true } : msg
          );
        });
        console.log('Updated messages with delivery:', updatedMessages);
        return updatedMessages;
      });
    });

    socket.on('messageHistory', ({ messages: history, total }) => {
      console.log(`Received history for ${activeRoom}: ${history.length} messages, total=${total}`);
      setIsLoading(false);
      if (!history.length) {
        console.log(`No history for: ${activeRoom}`);
        setMessages(prev => ({
          ...prev,
          [activeRoom]: [],
        }));
        setTotalMessages(prev => ({
          ...prev,
          [activeRoom]: total,
        }));
        setMessageOffsets(prev => ({
          ...prev,
          [activeRoom]: 0,
        }));
        scrollToBottom();
        return;
      }
      const roomId = getRoomId(history[0].userId, history[0].targetId);
      const existingMessageIds = new Set((messages[roomId] || []).map(msg => msg.messageId));
      const newMessages = history.filter(msg => !existingMessageIds.has(msg.messageId));
      console.log(`Appending new messages for ${roomId}: ${newMessages.map(msg => msg.messageId).join(', ')}`);
      setMessages(prev => {
        const currentMessages = prev[roomId] || [];
        const updatedMessages = [...newMessages, ...currentMessages];
        return {
          ...prev,
          [roomId]: updatedMessages,
        };
      });
      setTotalMessages(prev => ({
        ...prev,
        [roomId]: total,
      }));
      setMessageOffsets(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + newMessages.length,
      }));
      if (roomId === activeRoom) {
        history.forEach(msg => {
          if (msg.targetId === userId && !msg.seen) {
            socket.emit('messageSeen', { messageId: msg.messageId, userId });
          }
        });
        scrollToBottom();
      } else {
        const unseen = history.filter(msg => msg.targetId === userId && !msg.seen).length;
        if (unseen > 0) {
          console.log(`Setting hasNewMessage to true for history in ${roomId}`);
          setHasNewMessage(true);
          setUnseenCounts(prev => ({
            ...prev,
            [roomId]: (prev[roomId] || 0) + unseen,
          }));
        }
      }
    });

    socket.on('moreMessages', ({ messages: newMessages, total }) => {
      console.log(`Received more messages for ${activeRoom}: ${newMessages.length} messages, total=${total}`);
      setIsLoading(false);
      setIsLoadingOlderMessages(false);
      if (newMessages.length > 0) {
        const roomId = getRoomId(newMessages[0].userId, newMessages[0].targetId);
        const existingMessageIds = new Set((messages[roomId] || []).map(msg => msg.messageId));
        const filteredMessages = newMessages.filter(msg => !existingMessageIds.has(msg.messageId));
        console.log(`Appending messages for ${roomId}: ${filteredMessages.map(msg => msg.messageId).join(', ')}`);
        const scrollHeightBefore = chatContainerRef.current?.scrollHeight || 0;
        const scrollTopBefore = chatContainerRef.current?.scrollTop || 0;
        setMessages(prev => {
          const currentMessages = prev[roomId] || [];
          return {
            ...prev,
            [roomId]: [...filteredMessages, ...currentMessages],
          };
        });
        setMessageOffsets(prev => ({
          ...prev,
          [roomId]: (prev[roomId] || 0) + newMessages.length,
        }));
        setTotalMessages(prev => ({
          ...prev,
          [roomId]: total,
        }));
        if (chatContainerRef.current) {
          const scrollHeightAfter = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
          console.log(`Adjusted scroll position: ${chatContainerRef.current.scrollTop}`);
        }
      } else {
        console.log(`No new messages received for ${activeRoom}, stopping observer`);
        if (messagesTopRef.current) {
          observer.unobserve(messagesTopRef.current);
        }
      }
    });

    socket.on('userStatus', ({ userId: targetId, isOnline }, callback) => {
      console.log(`Received userStatus for ${targetId}: ${isOnline ? 'Online' : 'Offline'} at ${new Date().toISOString()}`);
      if (students.some(c => c.id === targetId)) {
        setStudentStatuses(prev => {
          const newStatus = isOnline ? 'Online' : 'Offline';
          if (prev[targetId] === newStatus) return prev;
          const newStatuses = {
            ...prev,
            [targetId]: newStatus,
          };
          console.log('Updated studentStatuses:', newStatuses);
          return newStatuses;
        });
        const roomId = getRoomId(userId, targetId);
        if (roomId === activeRoom) {
          console.log(`Setting targetStatus for ${targetId}: ${isOnline ? 'Online' : 'Offline'}`);
          setTargetStatus(isOnline ? 'Online' : 'Offline');
        }
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        console.log(`Ignoring userStatus for non-student ${targetId}`);
      }
    });

    socket.on('messageSeen', ({ messageId, userId: seenBy }) => {
      console.log(`Message ${messageId} seen by ${seenBy}`);
      setMessages(prev => {
        const updatedMessages = { ...prev };
        Object.keys(updatedMessages).forEach(roomId => {
          updatedMessages[roomId] = updatedMessages[roomId].map(msg =>
            msg.messageId === messageId ? { ...msg, seen: true } : msg
          );
        });
        return updatedMessages;
      });
      setUnseenCounts(prev => {
        const updatedCounts = { ...prev };
        Object.keys(updatedCounts).forEach(roomId => {
          const unseen = messages[roomId]?.filter(
            msg => msg.targetId === userId && !msg.seen && msg.userId !== userId && roomId !== activeRoom
          ).length || 0;
          updatedCounts[roomId] = unseen;
        });
        console.log('Updated unseenCounts:', updatedCounts);
        return updatedCounts;
      });
    });

    socket.on('newStudent', ({ studentId }) => {
      console.log('New student:', studentId);
      const roomId = getRoomId(userId, studentId);
      if (!students.some(s => s.id === studentId)) {
        fetch(`http://localhost:3000/api/v1/chat/student/${studentId}`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return res.json();
          })
          .then(data => {
            setStudents(prev => {
              if (prev.some(s => s.id === studentId)) {
                console.log(`Student ${studentId} already in list, skipping update`);
                return prev;
              }
              const newStudents = [...prev, { id: String(studentId), name: data.name || studentId }];
              console.log('Updated students:', newStudents);
              return newStudents;
            });
            if (!joinedRooms.has(roomId)) {
              socket.emit('joinRoom', { userId, userType, targetId: studentId, offset: 0, limit: messagesPerPage });
              socket.emit('getUserStatus', { targetId: studentId });
              setJoinedRooms(prev => new Set(prev).add(roomId));
              console.log(`Instructor ${userId} auto-joining ${roomId} for new student ${studentId}`);
              // Removed setUnseenCounts to avoid automatic highlight
              setActiveRoom(roomId);
              setTargetStatus('Offline');
            }
          })
          .catch(err => {
            console.error('Student fetch error:', err.message);
            setError('Failed to fetch student details');
          });
      } else {
        console.log(`Student ${studentId} already in list, joining room if not joined`);
        if (!joinedRooms.has(roomId)) {
          socket.emit('joinRoom', { userId, userType, targetId: studentId, offset: 0, limit: messagesPerPage });
          socket.emit('getUserStatus', { targetId: studentId });
          setJoinedRooms(prev => new Set(prev).add(roomId));
          console.log(`Instructor ${userId} auto-joining ${roomId} for existing student ${studentId}`);
          // Removed setUnseenCounts to avoid automatic highlight
        }
      }
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);
      let displayError = 'Server error';
      if (err.message.includes('Invalid user')) {
        displayError = 'Invalid email address';
      } else if (err.message.includes('No batch assigned')) {
        displayError = 'Student not assigned to a batch';
      } else if (err.message.includes('Invalid student')) {
        displayError = 'Invalid student selected';
      } else if (err.message.includes('No course assigned')) {
        displayError = 'Student not assigned to a course';
      } else {
        displayError = err.message || 'Server error';
      }
      setError(displayError);
      setIsLoading(false);
      setIsLoadingOlderMessages(false);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('receiveMessage');
      socket.off('messageDelivered');
      socket.off('messageHistory');
      socket.off('moreMessages');
      socket.off('userStatus');
      socket.off('messageSeen');
      socket.off('newStudent');
      socket.off('error');
    };
  }, [userId, activeRoom, students, userType, messages]);

  useEffect(() => {
    const hasUnseen = Object.values(unseenCounts).some(count => count > 0);
    console.log(`Updating hasNewMessage: ${hasUnseen}`);
    setHasNewMessage(hasUnseen);
  }, [unseenCounts]);

  useEffect(() => {
    if (activeRoom && userId) {
      const targetId = students.find(c => getRoomId(userId, c.id) === activeRoom)?.id;
      if (targetId) {
        const roomId = getRoomId(userId, targetId);
        const currentStatus = studentStatuses[targetId] || 'Offline';
        if (targetStatus !== currentStatus) {
          console.log(`Syncing targetStatus to ${currentStatus} for ${targetId}`);
          setTargetStatus(currentStatus);
        }
        if (unseenCounts[activeRoom] !== 0) {
          setUnseenCounts(prev => ({
            ...prev,
            [roomId]: 0,
          }));
        }
      } else if (targetStatus !== 'Offline') {
        console.log(`No targetId for ${activeRoom}, setting targetStatus to Offline`);
        setTargetStatus('Offline');
      }
    }
  }, [activeRoom, userId, students, studentStatuses, unseenCounts]);

  const joinRoom = (contactId) => {
    if (!userId || !isValidEmail(userId)) return alert('Please enter a valid email address');
    if (!students.some(c => c.id === contactId)) return alert('Invalid student');
    const roomId = getRoomId(userId, contactId);
    setActiveRoom(roomId);
    setTargetStatus(studentStatuses[contactId] || 'Offline');
    setUnseenCounts(prev => ({
      ...prev,
      [roomId]: 0,
    }));
    if (joinedRooms.has(roomId)) {
      const roomMessages = messages[roomId] || [];
      roomMessages.forEach(msg => {
        if (msg.targetId === userId && !msg.seen) {
          socket.emit('messageSeen', { messageId: msg.messageId, userId });
        }
      });
      return;
    }
    socket.emit('joinRoom', { userId, userType, targetId: contactId, offset: messageOffsets[roomId] || 0, limit: messagesPerPage });
    socket.emit('getUserStatus', { targetId: contactId });
    setJoinedRooms(prev => new Set(prev).add(roomId));
    console.log(`${userType} ${userId} joining ${roomId}`);
  };

  const sendMessage = () => {
    if (message && userId && activeRoom) {
      const targetId = students.find(c => getRoomId(userId, c.id) === activeRoom)?.id;
      if (!targetId) {
        return alert('Invalid target. Select a student.');
      }
      const roomId = getRoomId(userId, targetId);
      const messageData = {
        userId,
        targetId,
        userType,
        content: message,
        timestamp: new Date().toLocaleTimeString(),
        delivered: false,
        messageId: Date.now().toString(),
      };
      console.log('Sending message:', messageData);
      socket.emit('sendMessage', messageData);
      const roomMessages = messages[roomId] || [];
      roomMessages.forEach(msg => {
        if (msg.targetId === userId && !msg.seen) {
          socket.emit('messageSeen', { messageId: msg.messageId, userId });
        }
      });
      setUnseenCounts(prev => ({
        ...prev,
        [roomId]: 0,
      }));
      setMessage('');
      setIsAtBottom(true);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (userId && isValidEmail(userId)) {
      const fetchStudents = () => {
        fetch(`http://localhost:3000/api/v1/chat/students/${userId}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
            return res.json();
          })
          .then(data => {
            setStudents(prev => {
              const existingIds = new Set(prev.map(s => s.id));
              const newStudents = data.filter(s => !existingIds.has(s.id));
              if (newStudents.length > 0) {
                console.log('Fetched new students:', newStudents);
                newStudents.forEach(student => {
                  const roomId = getRoomId(userId, student.id);
                  if (!joinedRooms.has(roomId)) {
                    socket.emit('joinRoom', { userId, userType, targetId: student.id, offset: 0, limit: messagesPerPage });
                    socket.emit('getUserStatus', { targetId: student.id });
                    setJoinedRooms(prev => new Set(prev).add(roomId));
                  }
                });
                return [...prev, ...newStudents];
              }
              return prev;
            });
            setError('');
          })
          .catch(err => {
            console.error('Fetch students error:', err.message);
            setError('Failed to load students');
          });
      };

      fetchStudents();
      const interval = setInterval(fetchStudents, 30000);

      return () => clearInterval(interval);
    }
  }, [userId, joinedRooms]);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ***************************** sidebar ******************************** */}
      <div className={`w-[20%] bg-blue-200 h-full border-r flex flex-col ${hasNewMessage ? 'border-blue-300 shadow-md' : ''}`} style={{position:"fixed"}} >
        <div className="p-4 border-b">
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter Instructor Email"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex-1 overflow-y-auto" >
          {students.length > 0 ? (
            students.map(student => {
              const roomId = getRoomId(userId, student.id);
              const hasUnseen = (unseenCounts[roomId] || 0) > 0;
              return (
                <div
                  key={student.id}
                  onClick={() => joinRoom(student.id)}
                  className={`p-4 cursor-pointer bg-blue-500  ${activeRoom === roomId ? 'bg-green-300' : ''} ${hasUnseen ? 'font-bold bg-yellow-100' : ''}`}
                >
                  <div className='font-semibold'>{student.name} </div>
                  {hasUnseen && (
                    <div className="text-sm text-gray-500">A new message has arrived</div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="p-4 text-gray-500">No students available.</p>
          )}
        </div>
      </div>


      <div className="w-[80%] flex flex-col" style={{marginLeft:"280px"}} >
        <div className="flex-1  overflow-y-auto" ref={chatContainerRef}>
          {!isConnected && (
            <p className="text-red-500 text-center">Disconnected. Reconnecting...</p>
          )}
          {error && (
            <p className="p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</p>
          )}
          {activeRoom ? (
            <>
              {/* *************************** right top header ************************ */}
              <div className="flex items-center mb-2 border-2 py-4 bg-gray-200 shadow-lg/30 shadow-gray-500 w-full fixed pl-2" >
                <p className="text-lg font-bold">
                  {students.find(c => getRoomId(userId, c.id) === activeRoom)?.name || activeRoom}
                </p>
                <p className="text-sm text-blue-600 ml-2 ">{targetStatus} </p>
              </div>

              {isLoading && (
                <p className="text-center text-gray-500">Loading more messages...</p>
              )}
              <div ref={messagesTopRef} className='pt-36'/>
              {messages[activeRoom]?.length > 0 ? (
                <MessageList
                  messages={messages[activeRoom]}
                  userId={userId}
                  contacts={students}
                  activeRoom={activeRoom}
                  contactStatuses={studentStatuses}
                />
              ) : (
                <p className="text-center text-gray-500">No messages yet</p>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <p className="text-center text-gray-500">Select a student to chat</p>
          )}
        </div>
        {activeRoom && (
          <div className="p-4 border-t flex fixed bottom-0 w-full">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded bg-amber-100"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorApp;
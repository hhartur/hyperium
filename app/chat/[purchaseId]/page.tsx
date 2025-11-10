'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, XCircle, Languages } from 'lucide-react';
import { useAuthContext } from '@/components/providers/auth-provider';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

interface Message {
  id: string;
  purchase_id: string;
  sender_id: string;
  content: string;
  translated_content?: string | null;
  timestamp: string;
  sender: {
    username: string;
    avatar_url?: string | null;
  };
}

interface Purchase {
  id: string;
  chat_status: string | null;
  chat_closed_reason: string | null;
  game: {
    title: string;
    image_url: string;
  };
  user: {
    id: string;
    username: string;
  };
  seller: {
    id: string;
    username: string;
  };
}

const MessageContent = ({ message }: { message: Message }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const hasTranslation = message.translated_content && message.translated_content !== message.content;

  if (!hasTranslation) {
    return <p className="text-sm">{message.content}</p>;
  }

  return (
    <div>
      <p className="text-sm">
        {showOriginal ? message.content : message.translated_content}
      </p>
      <button
        onClick={() => setShowOriginal(!showOriginal)}
        className="text-xs text-blue-500 hover:underline mt-1"
      >
        {showOriginal ? 'Show translation' : 'Show original'}
      </button>
    </div>
  );
};

export default function ChatPage() {
  const params = useParams();
  const purchaseId = params.purchaseId as string;
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isCloseChatDialogOpen, setIsCloseChatDialogOpen] = useState(false);
  const [closeReason, setCloseReason] = useState("");

  const handleCloseChat = () => {
    if (!purchaseId || !closeReason || !socket) return;
    socket.emit('close_chat', { purchaseId, reason: closeReason });
    setIsCloseChatDialogOpen(false);
  };

  const fetchInitialData = useCallback(async () => {
    if (!user || !purchaseId) return;
    try {
      const [purchaseRes, messagesRes] = await Promise.all([
        fetch(`/api/purchases/${purchaseId}`),
        fetch(`/api/chat?purchaseId=${purchaseId}`),
      ]);

      if (purchaseRes.ok) {
        const purchaseData = await purchaseRes.json();
        setPurchase(purchaseData);
      } else {
        console.error('Failed to fetch purchase details');
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    } finally {
      setLoading(false);
    }
  }, [purchaseId, user]);

  useEffect(() => {
    fetchInitialData();

    socket = io('http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to socket server');
      // Register browser language with the server
      if (navigator.language) {
        socket.emit('register_language', navigator.language);
      }
      socket.emit('join_chat', purchaseId);
    });

    socket.on('receive_message', (message: Message) => {
      // Check if the message is for the current user before translating
      if (message.sender_id !== user?.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
      } else {
          // If the message is from the current user, add it without translation
          const originalMessage = { ...message, translated_content: null };
          setMessages((prevMessages) => [...prevMessages, originalMessage]);
      }
    });

    socket.on('chat_closed', ({ reason }) => {
      setPurchase(prev => prev ? { ...prev, chat_status: 'CLOSED', chat_closed_reason: reason } : null);
      toast.info(`Chat closed. Reason: ${reason}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchInitialData, purchaseId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!user || !newMessage.trim() || !purchase || !socket) return;

    const messagePayload = {
      purchaseId,
      senderId: user.id,
      content: newMessage.trim(),
    };

    socket.emit('send_message', messagePayload);

    // Manually add the sent message to the UI immediately
    const optimisticMessage: Message = {
        id: new Date().toISOString(), // Temporary ID
        purchase_id: purchaseId,
        sender_id: user.id,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        sender: {
            username: user.username,
            avatar_url: user.avatar_url
        }
    };
    setMessages(prev => [...prev, optimisticMessage]);

    setNewMessage('');
  };

  if (loading) {
    return <p>Loading chat...</p>;
  }

  if (!purchase) {
    return <p>Chat not found or unauthorized.</p>;
  }

  const isChatClosed = purchase.chat_status === 'CLOSED';
  const participant = user?.id === purchase.user.id ? purchase.seller.username : purchase.user.username;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat about &quot;{purchase.game.title}&quot; with {participant}
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Language Selector Placeholder */}
            {user?.id === purchase.seller.id && !isChatClosed && (
              <Dialog open={isCloseChatDialogOpen} onOpenChange={setIsCloseChatDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Close Chat</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Close Chat</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Select onValueChange={setCloseReason}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="SPAM">Spam</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button onClick={handleCloseChat} disabled={!closeReason}>
                      Close Chat
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col h-96 overflow-y-auto border rounded-lg p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 mb-4 ${
                  message.sender_id === user?.id ? 'justify-end' : ''
                }`}
              >
                {message.sender_id !== user?.id && (
                  <div className="relative w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {message.sender.avatar_url ? (
                      <Image
                        fill
                        src={message.sender.avatar_url}
                        alt={message.sender.username}
                        className="w-full h-full rounded-full object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {message.sender.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-[70%] ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="font-medium text-sm mb-1">
                    {message.sender.username}
                  </p>
                  <MessageContent message={message} />
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {message.sender_id === user?.id && (
                  <div className="relative w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar_url ? (
                      <Image
                        fill
                        src={user.avatar_url}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {isChatClosed ? (
            <div className="flex items-center justify-center text-muted-foreground p-4 border rounded-lg">
              <XCircle className="w-5 h-5 mr-2" />
              This chat has been closed. Reason: {purchase.chat_closed_reason}
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                disabled={isChatClosed}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim() || isChatClosed}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
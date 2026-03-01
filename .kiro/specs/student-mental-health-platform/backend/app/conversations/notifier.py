import asyncio
from typing import Dict, Set
from bson import ObjectId

class MessageNotifier:
    """
    Simple in-memory broadcast system for real-time chat updates via SSE.
    """
    def __init__(self):
        # Map conversation_id (str) to a set of message queues
        self.queues: Dict[str, Set[asyncio.Queue]] = {}
        self.max_queue_size = 100

    def subscribe(self, conversation_id: str) -> asyncio.Queue:
        """Subscribe to new messages in a conversation."""
        queue = asyncio.Queue(maxsize=self.max_queue_size)
        if conversation_id not in self.queues:
            self.queues[conversation_id] = set()
        self.queues[conversation_id].add(queue)
        return queue

    def unsubscribe(self, conversation_id: str, queue: asyncio.Queue):
        """Unsubscribe from a conversation."""
        if conversation_id in self.queues:
            self.queues[conversation_id].discard(queue)
            if not self.queues[conversation_id]:
                del self.queues[conversation_id]

    async def broadcast(self, conversation_id: str, message: dict):
        """Broadcast a new message to all subscribers of a conversation."""
        if conversation_id in self.queues:
            # Create a list because the set might change during iteration
            for queue in list(self.queues[conversation_id]):
                try:
                    queue.put_nowait(message)
                except asyncio.QueueFull:
                    # Evict stale subscriber
                    self.unsubscribe(conversation_id, queue)

notifier = MessageNotifier()

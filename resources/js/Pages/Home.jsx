
import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import { useEventBus } from '@/EventBus';
import axios from 'axios';
import AttachmentsPreviewModal from '@/Components/App/AttachmentsPreviewModal';


function Home({ selectedConversation = null, messages = null }) {

    const [localMessages, setLocalMessages] = useState([])
    const [noMoreMessages,setNoMoreMessages] = useState(false)
    const [scrollFromBottom,setScrolfromBottom] = useState(0)
    const messagesContainerRef = useRef(null)
    const loadMoreIntersect = useRef(null)
    const [showAttachmentPreview,setShowAttachmentPreview] = useState(false)
    const [previewAttachment,setPreviewAttachment] = useState({}) 
    const {on} = useEventBus()

    const messageCreated = (message) => {
        if (selectedConversation && selectedConversation.is_group && selectedConversation.id == message.group_id) {
            setLocalMessages((prevMessages) => [...prevMessages,message])
        }
        if (selectedConversation && selectedConversation.is_user && (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)) {
            setLocalMessages((prevMessages) => [...prevMessages,message])
        }
    }
    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) {
            return;
        }
        const firstMessage = localMessages[0]
        axios.get(route('message.loadOlder',firstMessage.id))
             .then(({data}) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true)
                    return;
                }
                const scrollHeight = messagesContainerRef.current.scrollHeight
                const scrollTop = messagesContainerRef.current.scrollTop
                const clientHeight = messagesContainerRef.current.clientHeight
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight
                setScrolfromBottom(scrollHeight- scrollTop - clientHeight)
                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(),...prevMessages]
                })
             })
    },[localMessages,noMoreMessages])
    const onAttachmentClick = (attachments,ind) => {
        setPreviewAttachment({
            attachments,
            ind
        })
        setShowAttachmentPreview(true)
    }
    useEffect(() => {
        setTimeout(() => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
            }
        }, 10);
       const offCreated =  on('message.created',messageCreated)
       setScrolfromBottom(0)
       return () => {
            offCreated()
       }
    }, [selectedConversation])

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : [])
    }, [messages])
    useEffect(() => {
        if (messagesContainerRef.current && scrollFromBottom !== null) {
            messagesContainerRef.current.scrollTop =  messagesContainerRef.current.scrollHeight - messagesContainerRef.current.offsetHeight -
            scrollFromBottom
        }
        if (noMoreMessages) {
            return
        }
        const observer = new IntersectionObserver(
            (entries) => 
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
                {
                    rootMargin:'0px  0px 250px 0px'
                }
        ) 
        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current)
            }, 100);
        }
        return () => {
            observer.disconnect()
        }
    },[localMessages])

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center w-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Selecione uma conversa para ver as mensagens
                    </div>
                    <ChatBubbleLeftRightIcon className='w-32 h-32 inline-block' />

                </div>
            )

            }
            {messages && (
                <>
                    <ConversationHeader selectedConversation={selectedConversation} />
                    <div ref={messagesContainerRef} className='flex-1 overflow-y-auto p-5'>
                        {localMessages.length === 0 && (
                            <div className="text-lg text-slate-200">
                                Ainda não há mensagens
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex flex-1 flex-col">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {previewAttachment.attachments && (
                <AttachmentsPreviewModal attachments={previewAttachment.attachments} 
                index={previewAttachment.ind} show={showAttachmentPreview} onClose={() =>setShowAttachmentPreview(false)}/>
            )}
        </>)
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}
        >
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    )
}

export default Home
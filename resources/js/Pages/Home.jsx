
import ChatLayout from '@/Layouts/ChatLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useRef, useState } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';

function Home({ selectedConversation = null, messages = null }) {

    const [localMessages, setLocalMessages] = useState([])
    const messagesContainerRef = useRef(null)
    useEffect(() => {
        setTimeout(() => {

            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }, 10);
    }, [selectedConversation])
    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : [])
    }, [messages])

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
                                {localMessages.map((message) => (
                                    <MessageItem key={message.id} message={message} />
                                ))}
                            </div>
                        )}
                    </div>
                    {/*<MessageInput conversation={selectedConversation}/>*/}
                </>
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
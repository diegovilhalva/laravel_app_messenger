import { usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"


const ChatLayout = ({children}) => {
    const page = usePage()
    const conversations = page.props.conversations
    const selectedConversation  = page.props.selectedConversation
    const [localConversations,setLocalConversations] = useState([])
    const [sortedConversations,setSortedConversations] = useState([])
    const [onlineUsers,setOnlineUsers] = useState({})
    const isUserOnline = (userId) => onlineUsers[userId]

    console.log('conversations',conversations)
    console.log('selectedConversation')
    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b) => {
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at >  b.blocked_at ? 1 : -1
                }else if(a.blocked_at){
                    return 1
                }
                else if (b.blocked_at){
                    return -1
                }
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date)
                }else if(a.last_message_date){
                    return -1
                }else if(a.last_message_date){
                    return 1
                }else{
                    return 0
                }
            })
        )
    },[localConversations])
    useEffect(() => {
        setLocalConversations(conversations)
    },[conversations])
    useEffect(() => {
        Echo.join('online')
            .here((users) => {
                const onlineUsersObject = Object.fromEntries(users.map((user) => [user.id,user]))
                setOnlineUsers((prev) => {
                    return {...prev,...onlineUsersObject}
                })
            })
            .joining((user) => {
               setOnlineUsers((prev) => {
                const updatedUsers = {...prev}
                updatedUsers[user.id] = user
                return updatedUsers
               })
            })
            .leaving((user) => {
               setOnlineUsers((prev) => {
                const updatedUsers = {...prev}
                delete updatedUsers[user.id] 
                return updatedUsers
               })
            })
            .error((error) => {
                console.error('error',error)
            })
            return () => {
                Echo.leave('online')
            }
    },[])
  return (
    <>
       
    </>
  )
}

export default ChatLayout
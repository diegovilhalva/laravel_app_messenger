import { FaceSmileIcon, FireIcon, HandRaisedIcon, HandThumbUpIcon, PaperAirplaneIcon, PaperClipIcon, PhotoIcon, XCircleIcon } from "@heroicons/react/24/solid"
import { useState, Fragment } from "react"

import NewMessageInput from "./NewMessageInput"
import EmojiPicker from "emoji-picker-react"
import axios from "axios"
import { Popover, Transition } from "@headlessui/react"
import { isAudio, isImage } from "@/helpers"
import CustomAudioPlayer from "./CustomAudioPlayer"
import AttachmentPreview from "./AttachmentPreview"

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("")
    const [inputErrorMessage, setInputErrorMessage] = useState("")
    const [messageSending, setMessageSending] = useState(false)
    const [chosenFiles,setChosenFiles] = useState([])
    const [uploadProgress,setUploadProgress] = useState(0)

    const onFileChange = (e) => {
        const files = e.target.files

        const updatedFiles = [...files].map((file) => {
            return {
                file : file,
                url:URL.createObjectURL(file)
            }
        })
        setChosenFiles((prevFiles) => {
            return [...prevFiles,...updatedFiles]
        })
    }

    const onSend = () => {
        if (messageSending) {
            return;
        }
        if (newMessage.trim() === "") {
            setInputErrorMessage("Por favor,escreva uma mensagem ou envie um arquivo")
            setTimeout(() => {
                setInputErrorMessage("")
            }, 3000)
            return;
        }
        const formData = new FormData()
        chosenFiles.forEach((file) => {
            formData.append('attachments[]',file.file)
        })
        formData.append('message', newMessage)
        if (conversation.is_user) {
            formData.append('receiver_id', conversation.id)
        } else if (conversation.is_group) {
            formData.append('group_id', conversation.id)
        }

        setMessageSending(true)
        axios.post(route('message.store'), formData, {
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                console.log(progress)
                setUploadProgress(progress)
            }
        }).then(response => {
            setNewMessage("")
            setMessageSending(false)
            setUploadProgress(0)
            setChosenFiles([])
        })
            .catch((error) => {
                setMessageSending(false)
                setChosenFiles([])
                const message = error?.response?.data?.message
                setInputErrorMessage(message || "Ocorreu um erro ao enviar a mensagem")
            })

    }
    const onLikeClick = () => {
        if (messageSending) {
            return
        }
        const data = {
            message:'👍🏻'
        }
        if (conversation.is_user) {
            data['receiver_id'] = conversation.id
        } else if (conversation.is_group) {
            data['group_id'] = conversation.id
        }

        axios.post(route('message.store'),data)

        setNewMessage()
    }
    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input type="file" onChange={onFileChange} multiple className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input type="file" multiple accept="image/*" onChange={onFileChange} className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer" />
                </button>
            </div>
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex">
                    <NewMessageInput value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)} onSend={onSend}  />
                    <button onClick={onSend} disabled={messageSending} className="btn btn-info rounded-l-none">
                        {messageSending && (
                            <span className="loading loading-spinner loading-xs"></span>
                        )}
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Enviar</span>
                    </button>
                </div>
                {!!uploadProgress &&(
                    <progress
                    className="progress progress-info  w-full"
                    value={uploadProgress}
                    max={100}
                    ></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-xs text-red-400 ">{inputErrorMessage}</p>
                )}
                <div className="flex flex-warp gap-1 mt-2">
                    {
                        chosenFiles.map((file) => (
                            <div className={"relative flex justify-between cursor-pointer" + (!isImage(file.file) ? " w-[240px]" : "")} key={file.file.name}>
                                {isImage(file.file) && (
                                    <img src={file.url} alt="" className="w-16 h-16 object-cover" />
                                )}
                                {
                                    isAudio(file.file) && (
                                        <CustomAudioPlayer file={file} showVolume={false}/>
                                    )
                                }
                                {!isAudio(file.file) && !isImage(file.file) && (
                                    <AttachmentPreview file={file} />
                                )}
                                <button className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-gray-300 hover:text-gray-100 z-10" onClick={() => setChosenFiles(chosenFiles.filter((f) => f.name.name !== file.file.name))}>
                                    <XCircleIcon className="w-6" />
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Popover.Panel className="absolute z-10 right-0 bottom-full ">
                        <EmojiPicker theme="dark" onEmojiClick={
                            (e) => setNewMessage(newMessage + e.emoji)
                        }>

                        </EmojiPicker>
                    </Popover.Panel>
                </Popover>

                <button onClick={onLikeClick} className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className="w-6 h-6" />
                </button>

            </div>
        </div>
    )
}

export default MessageInput
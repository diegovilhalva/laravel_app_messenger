import { useEffect, useRef } from "react"


const NewMessageInput = ({value,onChange,onSend}) => {
    const input = useRef()
    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault()
            onSend()
        }
    }
    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight()
        }, 10);
        onChange(ev)
    }

    const adjustHeight = () => {
        setTimeout(() => {
            input.current.style.height = 'auto'
            input.current.style.height = input.current.scrollHeight +   + 'px'
        }, 100);
    }
    useEffect(() => {
        adjustHeight()
    },[])
  return (
<textarea  ref={input} value={value} rows={1} placeholder="Escrever mensagem" onKeyDown={onInputKeyDown} onChange={(e) => onChangeEvent(e)} className="input input-bordered w-full rounded-r-none resize-none overflow-y-auto max-h-40"></textarea>
  )
}

export default NewMessageInput
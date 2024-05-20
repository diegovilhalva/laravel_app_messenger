import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const AudioRecorder = ({fileReady}) => {
    const [mediaRecorder,setMediaRecorder] = useState(null)
    const [recording,setRecording] = useState(false)


    const onMicrofoneClick = async () => {
        if (recording) {
            setRecording(false)
            if (mediaRecorder) {
                mediaRecorder.stop()
                setMediaRecorder(null)
            }
            return
        }
        setRecording(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio:true
            }) 
            const newMediaRecorder = new MediaRecorder(stream)
            const chunks = []

            newMediaRecorder.addEventListener('dataavailable',(event) => {
                chunks.push(event.data)
            } )
            newMediaRecorder.addEventListener('stop',() => {
                let audioBlob = new Blob(chunks,{
                    type:'audio/ogg; codecs=opus'
                })
                let audioFile = new File([audioBlob],'recorded_audio.ogg',{
                    type:'audio/ogg; codecs=opus',
                })
                const url = URL.createObjectURL(audioFile)
                fileReady(audioFile,url)
            })
            newMediaRecorder.start()
            setMediaRecorder(newMediaRecorder)
        } catch (error) {
            setRecording(false)
            console.log("Erro ao accessar o microfine",error)
        }
    }
  return (
    <button onClick={onMicrofoneClick} className="p-1 text-gray-400 hover:text-gray-200">
      {recording &&   <StopCircleIcon className="w-6 text-red-600 "/>}
       {!recording &&  <MicrophoneIcon className="h-6 w-6 text-gray-500" />}
    </button>
  )
}

export default AudioRecorder
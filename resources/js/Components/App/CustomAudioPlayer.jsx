import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid"
import React, { useRef, useState } from "react"
const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioref = useRef()
    const [isPlaying, setisPlaying] = useState(false)
    const [volume, setVolume] = useState(1)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const togglePlayPause = () => {
        const audio = audioref.current
        if (isPlaying) {
            audio.pause()
        } else {
            setDuration(audio.duration)
            audio.play()
        }
        setisPlaying(!isPlaying)
    }
    const handleVolumeChange = (e) => {
        const volume = e.target.value
        audioref.current.volume = volume
        setVolume(volume)
    } 

    const handleTimeUpdate = (e) => {
        const audio = audioref.current
        setDuration(audio.duration)
    }

    const handleLoadedMetaData = (e) => {
        setDuration(e.target.duration)
    }
    const handleSeekChange = (e) => {
        const time = e.target.currentTime = time
        audioref.current.currentTime = time
        setCurrentTime(time)
    }
    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <audio ref={audioref} src={file.url} controls onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetaData} className="hidden"/>
            <button onClick={togglePlayPause}>
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {
                showVolume && (
                    <input type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                     />
                )
            }
            <input type="range" className="flex-1" min="0" max={duration} step={"0.01"} 
            value={currentTime} onChange={handleSeekChange} />
        </div>

  )
}

export default CustomAudioPlayer
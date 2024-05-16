export const formatMessageDateLong = (date) => {
    const now = new Date()
    const inputDate = new Date(date)
    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    } else if (isYesterday(inputDate)) {
        return (
            "Ontem " + inputDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        )
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: '2-digit',
            month: 'short'
        })
    } else {
        return inputDate.toLocaleDateString()
    }
}

export const formatMessageDateShort = (date) => {
    const now = new Date();
    const inputDate = new Date(date);


    //inputDate.setTime(inputDate.getTime() - inputDate.getTimezoneOffset() * 60 * 1000);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } else if (isYesterday(inputDate)) {
        return "Ontem";
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
}


export const isToday = (date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getYear() === today.getYear()
    );
};
export const isYesterday = (date) => {
    const yestrday = new Date();
    yestrday.setDate(yestrday.getDate() - 1);
    return (
        date.getDate() === yestrday.getDate() &&
        date.getMonth() === yestrday.getMonth() &&
        date.getYear() === yestrday.getYear()
    );
};

export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type
    mime = mime.split("/")
    return mime[0].toLowerCase() === "image"

}

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type
    mime = mime.split("/")
    return mime[0].toLowerCase() === "video"
}

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type
    mime = mime.split("/")
    return mime[0].toLowerCase() === "audio"
}

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type
    return mime === "application/pdf"
}

export const isPriviwable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    )
}

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes","KB","MB","GB"]

    let i = 0;
    let size = bytes
    while (size >= k) {
        size /= k;
        i++;
    }

    return parseFloat(size.toFixed(dm)) + " " + sizes[i]

} 
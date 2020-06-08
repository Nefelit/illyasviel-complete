let fetch = require('node-fetch');
class TriviaManager {
    constructor(videos) {
        this.videos = null;
        fetch('https://openings.moe/api/list.php?eggs&shuffle').then(data => data.json()).then(data => {
            this.videos = data;
        });
    };
    static async getVideos() {
        let vids = await fetch('https://openings.moe/api/list.php?eggs&shuffle');
        return new TriviaManager(await vids.json());
    }
    getMime(mime) {
        switch (mime.replace('video/', '')) {
            case "mp4":
            case "m4v":
                return "mp4";
            case "ogg":
            case "ogm":
            case "ogv":
                return "ogg";
            case "webm":
                return "webm";
            default:
                return null;
        };
    }
    random() {
        return this.videos[Math.random() * this.videos.length | 0]
    }
    getPath(video) {
        let type = this.getMime(video.mime[0]);
        if (type === null) return this.randomVid();
        return `https://openings.moe/video/${video.file}.${type}`;
    }

    randomVid() {
        let vid = this.random();
        let path = this.getPath(vid);
        if (!vid || !path) return this.randomVid();
        vid.uri = path;
        return vid;
    }
}


module.exports = TriviaManager;
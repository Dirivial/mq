async function ConfigureMusicKit(token) {
  try {
    const music = await MusicKit.configure({
      developerToken: token,
      app: {
        name: "My Cool App",
        build: "1.0",
      },
    });
    await music.authorize();
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

async function AddAlbumToQueue(album) {
  try {
    const music = MusicKit.getInstance();
    await music.setQueue({ album: album });
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

async function Pause() {
  try {
    const music = MusicKit.getInstance();
    await music.pause();
  } catch (error) {
    console.log(error);
  }
}

async function Play() {
  try {
    const music = MusicKit.getInstance();
    await music.play();
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}


async function SkipToNext() {
  try {
    const music = MusicKit.getInstance();
    await music.skipToNextItem();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  ConfigureMusicKit,
  AddAlbumToQueue,
  Pause,
  Play,
  SkipToNext,
};
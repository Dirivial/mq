import { env } from "~/env.mjs";

export default async function ConfigureMusicKit() {
  console.log("Hello");

  try {
    console.log("Trying with token: " + env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN);
    // @ts-ignore
    await MusicKit.configure({
      developerToken: env.NEXT_PUBLIC_APPLE_DEVELOPER_TOKEN,
      app: {
        name: "My Cool App",
        build: "1.0",
      },
    });
    // @ts-ignore
    const music = MusicKit.getInstance();
    await music.authorize();
    console.log("Deez nutz");
  } catch (error) {
    console.log(error);
  }
}
import { env } from "~/env.mjs";

type SpotifyAccessResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export default async function fetchSpotifyToken(
  code: string,
  redirect_uri: string,
) {
  const params = new URLSearchParams();
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("grant_type", "authorization_code");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        env.NEXT_PUBLIC_SPOTIFY_ID + ":" + env.NEXT_PUBLIC_SPOTIFY_SECRET,
      ).toString("base64")}`,
    },
  }).then((res) => res.json() as Promise<SpotifyAccessResponse>);

  return res;
}

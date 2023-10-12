export async function AddAlbumToQueue(album: string): Promise<boolean>;
export async function AddSongToQueue(song: string): Promise<boolean>;
export async function Pause(): void;
export async function Play(): Promise<boolean>;
export async function ConfigureMusicKit(token: string): Promise<boolean>;
export async function SkipToNext(): void;

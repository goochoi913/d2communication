import { ref, uploadBytesResumable } from "firebase/storage";

import { newId } from "@/content/format";
import type { ImageAsset, LogoAsset, LoopAsset } from "@/content/schema";
import { firebase, storageUrl } from "../firebase";
import { processImage, videoFrame } from "./image";
import { processLogo } from "./logo";

/** Uploaded files never change, so browsers and Google's edge may cache them for a year. */
const CACHE = "public, max-age=31536000, immutable";

export type Progress = (fraction: number) => void;

function put(path: string, blob: Blob, contentType: string, onBytes?: (sent: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const task = uploadBytesResumable(ref(firebase().storage, path), blob, { contentType, cacheControl: CACHE });
    task.on("state_changed", (s) => onBytes?.(s.bytesTransferred), reject, () => resolve());
  });
}

/** Where an image is used decides how large it gets. */
export const IMAGE_WIDTHS = {
  hero: [960, 1600, 2560],
  photo: [640, 1280, 1920, 2560],
  poster: [640, 1280, 1920],
  cover: [960, 1600, 2560],
  portrait: [540, 1080, 1600],
  background: [960, 1600],
} as const;

export type ImageKind = keyof typeof IMAGE_WIDTHS;

export async function uploadImage(
  file: File,
  kind: ImageKind,
  { redline = false, onProgress }: { redline?: boolean; onProgress?: Progress } = {},
): Promise<ImageAsset> {
  onProgress?.(0.02);
  const processed = await processImage(file, { widths: [...IMAGE_WIDTHS[kind]], redline });
  onProgress?.(0.15);
  const folder = kind === "poster" ? "poster" : "img";
  const id = newId("i");
  const total = processed.variants.reduce((n, v) => n + v.blob.size, 0);
  let done = 0;
  for (const v of processed.variants) {
    await put(`media/${folder}/${id}/${v.width}.${processed.ext}`, v.blob, processed.mime, (sent) =>
      onProgress?.(0.15 + (0.85 * (done + sent)) / total),
    );
    done += v.blob.size;
  }
  onProgress?.(1);
  return {
    src: storageUrl(`media/${folder}/${id}/{w}.${processed.ext}`),
    widths: processed.variants.map((v) => v.width),
    width: processed.width,
    height: processed.height,
    lqip: processed.lqip,
    bottomTone: processed.bottomTone,
    ...(redline ? { treatment: "redline" as const } : {}),
  };
}

export async function uploadLogo(file: File, onProgress?: Progress): Promise<LogoAsset> {
  const logo = await processLogo(file);
  const path = `media/logo/${newId("l")}.${logo.ext}`;
  await put(path, logo.blob, logo.mime, (sent) => onProgress?.(sent / logo.blob.size));
  return { src: storageUrl(path), width: logo.width, height: logo.height };
}

export const LOOP_MAX_BYTES = 25 * 1024 * 1024;

export async function uploadLoop(file: File, onProgress?: Progress): Promise<LoopAsset> {
  const frame = await videoFrame(file);
  const id = newId("v");
  const type = file.type === "video/webm" ? "video/webm" : "video/mp4";
  const ext = type === "video/webm" ? "webm" : "mp4";
  const posterPath = `media/poster/${id}/frame.jpg`;
  await put(posterPath, frame.blob, "image/jpeg");
  await put(`media/loop/${id}.${ext}`, file, type, (sent) => onProgress?.(sent / file.size));
  return {
    src: storageUrl(`media/loop/${id}.${ext}`),
    poster: storageUrl(posterPath),
    width: frame.width,
    height: frame.height,
    bytes: file.size,
    duration: Math.round(frame.duration * 10) / 10,
  };
}

export const formatBytes = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

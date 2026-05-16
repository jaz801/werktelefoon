// Local face detection with EXIF-aware dimensions — no cloud services.
import type { FaceDetector as MediaPipeFaceDetector } from "@mediapipe/tasks-vision";

export type FaceBounds = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

export type FaceDetectionResult = {
  face: FaceBounds;
  width: number;
  height: number;
};

type FaceImageSource = HTMLCanvasElement | HTMLImageElement | ImageBitmap;

type NativeFaceDetector = {
  detect: (
    source: ImageBitmapSource,
  ) => Promise<Array<{ boundingBox: DOMRectReadOnly }>>;
};

let mediaPipeDetector: MediaPipeFaceDetector | null = null;
let mediaPipeInit: Promise<MediaPipeFaceDetector> | null = null;

function toFaceBounds(box: {
  x?: number;
  y?: number;
  originX?: number;
  originY?: number;
  width: number;
  height: number;
}): FaceBounds {
  const x = box.originX ?? box.x ?? 0;
  const y = box.originY ?? box.y ?? 0;
  return {
    centerX: x + box.width / 2,
    centerY: y + box.height / 2,
    width: box.width,
    height: box.height,
  };
}

async function detectWithNativeFaceDetector(
  source: FaceImageSource,
): Promise<FaceBounds | null> {
  const FaceDetectorCtor = (
    globalThis as typeof globalThis & {
      FaceDetector?: new (opts?: { maxDetectedFaces?: number }) => NativeFaceDetector;
    }
  ).FaceDetector;
  if (!FaceDetectorCtor) return null;

  try {
    const detector = new FaceDetectorCtor({ maxDetectedFaces: 1 });
    const faces = await detector.detect(source);
    if (faces.length === 0) return null;
    return toFaceBounds(faces[0].boundingBox);
  } catch {
    return null;
  }
}

async function getMediaPipeDetector(): Promise<MediaPipeFaceDetector> {
  if (mediaPipeDetector) return mediaPipeDetector;
  if (!mediaPipeInit) {
    mediaPipeInit = (async () => {
      const { FaceDetector, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
      );
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
      const modelAssetPath =
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";
      try {
        mediaPipeDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath, delegate: "GPU" },
          runningMode: "IMAGE",
        });
      } catch {
        mediaPipeDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath, delegate: "CPU" },
          runningMode: "IMAGE",
        });
      }
      return mediaPipeDetector;
    })();
  }
  return mediaPipeInit;
}

async function detectWithMediaPipe(
  source: FaceImageSource,
): Promise<FaceBounds | null> {
  try {
    const detector = await getMediaPipeDetector();
    const result = detector.detect(source);
    if (result.detections.length === 0) return null;

    const box = result.detections[0].boundingBox;
    if (!box) return null;

    return toFaceBounds(box);
  } catch {
    return null;
  }
}

async function detectFaceInSource(
  source: FaceImageSource,
): Promise<FaceBounds | null> {
  if (typeof window === "undefined") return null;
  return (
    (await detectWithNativeFaceDetector(source)) ??
    (await detectWithMediaPipe(source))
  );
}

/** Decode image with EXIF orientation, detect face in true pixel coordinates. */
export async function detectFaceFromBlob(
  blob: Blob,
): Promise<FaceDetectionResult | null> {
  const bitmap = await createImageBitmap(blob, {
    imageOrientation: "from-image",
  });

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return null;
  }

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const face = await detectFaceInSource(canvas);
  if (!face) return null;

  return { face, width: canvas.width, height: canvas.height };
}

export async function detectFaceFromUrl(
  url: string,
): Promise<FaceDetectionResult | null> {
  const response = await fetch(url);
  const blob = await response.blob();
  return detectFaceFromBlob(blob);
}

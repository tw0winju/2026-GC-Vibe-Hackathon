import { nanoid } from "nanoid";
import path from "node:path";
import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";
import { AppError } from "../middlewares/errorHandler.js";

type UploadType = "resume" | "thumbnail";

// 업로드 타입별 설정
const UPLOAD_CONFIG: Record<
  UploadType,
  {
    bucket: string;
    maxSize: number;
    allowedMimes: string[];
    isPublic: boolean;
  }
> = {
  resume: {
    bucket: process.env.SUPABASE_BUCKET_RESUME || "resume-files", 
    maxSize: process.env.MAX_FILE_SIZE_PDF ? parseInt(process.env.MAX_FILE_SIZE_PDF) : 5 * 1024 * 1024,
    allowedMimes: ["application/pdf"],
    isPublic: false,
  },
  thumbnail: {
    bucket: process.env.SUPABASE_BUCKET_THUMBNAIL || "thumbnails",
    maxSize: process.env.MAX_FILE_SIZE_IMAGE ? parseInt(process.env.MAX_FILE_SIZE_IMAGE) : 2 * 1024 * 1024,
    allowedMimes: ["image/jpeg", "image/png", "image/webp"],
    isPublic: true,
  },
};

/**
 * 업로드용 Presigned URL 발급
 * 클라이언트는 이 URL로 직접 파일을 업로드함
 */
export const createUploadUrl = async (params: {
  userId: number;
  type: UploadType;
  filename: string;
  mimeType: string;
}) => {
  const { userId, type, filename, mimeType } = params;
  const config = UPLOAD_CONFIG[type];

  // MIME 검증
  if (!config.allowedMimes.includes(mimeType)) {
    throw new AppError(
      400,
      `허용되지 않은 파일 형식입니다. 허용: ${config.allowedMimes.join(", ")}`,
    );
  }

  // 안전한 파일 경로: userId/uuid_타임스탬프.확장자
  const ext = path.extname(filename).toLowerCase() || ".bin";
  const filePath = `${userId}/${nanoid()}_${Date.now()}${ext}`;

  const { data, error } = await supabase.storage
    .from(config.bucket)
    .createSignedUploadUrl(filePath);

  if (error || !data) {
    throw new AppError(500, `업로드 URL 생성 실패: ${error?.message}`);
  }

  return {
    upload_url: data.signedUrl,
    file_path: data.path,
    token: data.token,
    max_size: config.maxSize,
  };
};

/**
 * 파일 경로 → 접근 가능한 URL 변환
 * Public 버킷은 영구 URL, Private 버킷은 Signed URL
 */
export const getFileUrl = async (params: {
  type: UploadType;
  filePath: string;
  expiresIn?: number;
}) => {
  const { type, filePath, expiresIn = 3600 } = params;
  const config = UPLOAD_CONFIG[type];

  if (config.isPublic) {
    const { data } = supabase.storage
      .from(config.bucket)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  const { data, error } = await supabase.storage
    .from(config.bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error || !data) {
    throw new AppError(500, `Signed URL 생성 실패: ${error?.message}`);
  }
  return data.signedUrl;
};

/**
 * 파일 삭제 (게시글 삭제 시 같이 호출)
 */
export const deleteFile = async (type: UploadType, filePath: string) => {
  const config = UPLOAD_CONFIG[type];

  const { error } = await supabase.storage
    .from(config.bucket)
    .remove([filePath]);

  if (error) throw new AppError(500, `파일 삭제 실패: ${error.message}`);
};

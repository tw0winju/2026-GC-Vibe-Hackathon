import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Check, FileText, Upload, X } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { isCurrentUser } from "../../../lib/auth/session";
import {
  getResumePost,
  getUploadUrl,
  updateResumePost,
  uploadFileToSignedUrl,
} from "../../../lib/api/devfeedback";
import { RESUME_FEEDBACK_CATEGORIES, type ResumeFeedbackCategory } from "../model/resumeFeedback";
import "./ResumeFeedbackWritePage.css";

type ResumePosition = Exclude<ResumeFeedbackCategory, "전체">;

const positions = RESUME_FEEDBACK_CATEGORIES.filter(
  (category): category is ResumePosition => category !== "전체",
);

function ResumeFeedbackEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<"" | ResumePosition>("");
  const [description, setDescription] = useState("");
  const [filePath, setFilePath] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = Boolean(title.trim() && position && description.trim() && (file || filePath));
  const fileSizeText = useMemo(() => {
    if (!file) return "";
    return `${Math.max(1, Math.round(file.size / 1024))}KB`;
  }, [file]);

  useEffect(() => {
    if (!postId) return;
    let mounted = true;

    getResumePost(postId)
      .then((post) => {
        if (!mounted) return;
        const postOwnerId = post.user?.id ?? post.user?.user_id;
        if (!isCurrentUser(postOwnerId)) {
          setCanEdit(false);
          setErrorMessage("본인이 작성한 글만 수정할 수 있습니다.");
          return;
        }

        setTitle(post.title);
        setPosition(post.position);
        setDescription(post.description);
        setFilePath(post.file_url ?? "");
      })
      .catch((error) => {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : "게시글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId]);

  if (!postId) {
    return <Navigate to={ROUTES.resumeFeedbacks} replace />;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setErrorMessage("백엔드 명세상 포트폴리오 업로드는 PDF만 지원합니다.");
      return;
    }
    setFile(selectedFile);
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !position) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let nextFilePath = filePath;

      if (file) {
        const upload = await getUploadUrl({
          type: "resume",
          filename: file.name,
          mime_type: file.type,
        });
        await uploadFileToSignedUrl(upload.upload_url, file);
        nextFilePath = upload.file_path;
      }

      await updateResumePost(postId, {
        title: title.trim(),
        description: description.trim(),
        file_url: nextFilePath,
        position,
      });
      navigate(`/resume-feedbacks/${postId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "포트폴리오 피드백 글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="resume-write-page resume-write-page--edit">
        <main className="resume-write-content">
          <div className="resume-write-heading">
            <h1>포트폴리오 피드백 글 수정</h1>
            <p>기존 내용을 확인하고 필요한 부분만 수정하세요.</p>
          </div>

          {isLoading ? (
            <article className="resume-write-form">불러오는 중입니다.</article>
          ) : !canEdit ? (
            <article className="resume-write-form">{errorMessage}</article>
          ) : (
            <form className="resume-write-form" onSubmit={handleSubmit}>
              <section className="resume-form-section">
                <label htmlFor="resume-title">1. 제목</label>
                <div className="resume-input-with-count">
                  <input
                    id="resume-title"
                    maxLength={100}
                    placeholder="제목을 입력해주세요."
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <span>{title.length}/100</span>
                </div>
              </section>

              <section className="resume-form-section">
                <span className="resume-form-label">2. 직무</span>
                <div className="resume-position-options" aria-label="직무 선택">
                  {positions.map((item) => (
                    <button
                      className={position === item ? "is-active" : ""}
                      key={item}
                      type="button"
                      onClick={() => setPosition(item)}
                    >
                      {position === item && <Check size={15} strokeWidth={2.4} />}
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              <section className="resume-form-section">
                <label htmlFor="resume-file">3. 포트폴리오 첨부</label>
                <p>{file ? "새 파일로 교체됩니다." : "새 파일을 선택하지 않으면 기존 첨부 파일을 유지합니다."}</p>
                <label className="resume-file-dropzone" htmlFor="resume-file">
                  <Upload size={30} strokeWidth={2.1} />
                  <strong>{file ? file.name : "PDF 파일을 선택해 첨부 파일을 교체하세요"}</strong>
                  <span>PDF 파일만 가능</span>
                </label>
                <input
                  id="resume-file"
                  accept="application/pdf,.pdf"
                  className="resume-file-input"
                  type="file"
                  onChange={handleFileChange}
                />
                {(file || filePath) && (
                  <div className="resume-selected-file">
                    <FileText size={18} />
                    <strong>{file ? file.name : "기존 첨부 파일"}</strong>
                    <span>{file ? fileSizeText : "유지"}</span>
                    {file && (
                      <button type="button" aria-label="첨부 파일 삭제" onClick={() => setFile(null)}>
                        <X size={18} />
                      </button>
                    )}
                  </div>
                )}
              </section>

              <section className="resume-form-section">
                <label htmlFor="resume-description">4. 피드백 요청 내용</label>
                <div className="resume-textarea-with-count">
                  <textarea
                    id="resume-description"
                    maxLength={1000}
                    placeholder="궁금한 점을 구체적으로 작성해주세요."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  <span>{description.length}/1000</span>
                </div>
              </section>

              <div className="resume-form-actions">
                {errorMessage && <p>{errorMessage}</p>}
                <button disabled={!canSubmit || isSubmitting} type="submit">
                  {isSubmitting ? "수정 중..." : "수정 완료"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </AppLayout>
  );
}

export default ResumeFeedbackEditPage;

import { ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { Check, FileImage, Plus, Trash2, Upload } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  getProjectPost,
  getUploadUrl,
  updateProjectPost,
  uploadFileToSignedUrl,
} from "../../../lib/api/devfeedback";
import {
  PROJECT_FEEDBACK_CATEGORIES,
  type ProjectFeedbackCategory,
} from "../model/projectFeedback";
import "./ProjectFeedbackWritePage.css";

type ProjectPosition = Exclude<ProjectFeedbackCategory, "전체">;

const positions = PROJECT_FEEDBACK_CATEGORIES.filter(
  (category): category is ProjectPosition => category !== "전체",
);

function splitProjectDescription(description: string) {
  const marker = "\n\n[주요 기능]\n";
  if (!description.includes(marker)) {
    return { intro: description, features: "" };
  }

  const [intro, features] = description.split(marker);
  return { intro, features };
}

function ProjectFeedbackEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<"" | ProjectPosition>("");
  const [intro, setIntro] = useState("");
  const [features, setFeatures] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [stacks, setStacks] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = Boolean(title.trim() && position && intro.trim() && features.trim() && stacks.length > 0);
  const imageName = useMemo(() => {
    if (imageFile) return imageFile.name;
    if (thumbnail) return "기존 썸네일";
    return "";
  }, [imageFile, thumbnail]);

  useEffect(() => {
    if (!postId) return;
    let mounted = true;

    getProjectPost(postId)
      .then((post) => {
        if (!mounted) return;
        const parsedDescription = splitProjectDescription(post.description);
        setTitle(post.title);
        setPosition(post.position);
        setIntro(parsedDescription.intro);
        setFeatures(parsedDescription.features || post.description);
        setStacks(post.tag ?? []);
        setThumbnail(post.thumbnail ?? undefined);
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
    return <Navigate to={ROUTES.projectFeedbacks} replace />;
  }

  const handleAddStack = () => {
    const nextStack = stackInput.trim();
    if (!nextStack || stacks.includes(nextStack) || stacks.length >= 8) return;
    setStacks((current) => [...current, nextStack]);
    setStackInput("");
  };

  const handleStackKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleAddStack();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
      setErrorMessage("백엔드 명세상 썸네일은 JPG, PNG, WEBP만 지원합니다.");
      return;
    }
    setImageFile(selectedFile);
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !position) return;

    const description = [
      intro.trim(),
      "",
      "[주요 기능]",
      features.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let nextThumbnail = thumbnail;

      if (imageFile) {
        const upload = await getUploadUrl({
          type: "thumbnail",
          filename: imageFile.name,
          mime_type: imageFile.type,
        });
        await uploadFileToSignedUrl(upload.upload_url, imageFile);
        nextThumbnail = upload.file_path;
      }

      await updateProjectPost(postId, {
        title: title.trim(),
        description,
        thumbnail: nextThumbnail,
        position,
        tag: stacks,
      });
      navigate(`/project-feedbacks/${postId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "프로젝트 피드백 글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="project-write-page project-write-page--edit">
        <main className="project-write-content">
          <div className="project-write-heading">
            <h1>프로젝트 피드백 글 수정</h1>
            <p>기존 내용을 확인하고 필요한 부분만 수정하세요.</p>
          </div>

          {isLoading ? (
            <article className="project-write-form">불러오는 중입니다.</article>
          ) : (
            <form className="project-write-form" onSubmit={handleSubmit}>
              <section className="project-form-section">
                <label htmlFor="project-title">제목 *</label>
                <div className="project-input-with-count">
                  <input
                    id="project-title"
                    maxLength={50}
                    placeholder="프로젝트 제목을 입력해주세요."
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <span>{title.length}/50</span>
                </div>
              </section>

              <section className="project-form-section">
                <span className="project-form-label">카테고리 *</span>
                <div className="project-category-options" aria-label="프로젝트 카테고리">
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

              <section className="project-form-section">
                <label htmlFor="project-intro">프로젝트 소개 *</label>
                <div className="project-textarea-with-count">
                  <textarea
                    id="project-intro"
                    maxLength={300}
                    placeholder="프로젝트가 무엇인지 간단히 설명해주세요."
                    value={intro}
                    onChange={(event) => setIntro(event.target.value)}
                  />
                  <span>{intro.length}/300</span>
                </div>
              </section>

              <section className="project-form-section">
                <label htmlFor="project-features">주요 기능 *</label>
                <div className="project-textarea-with-count">
                  <textarea
                    id="project-features"
                    maxLength={500}
                    placeholder="프로젝트의 주요 기능과 특징을 작성해주세요."
                    value={features}
                    onChange={(event) => setFeatures(event.target.value)}
                  />
                  <span>{features.length}/500</span>
                </div>
              </section>

              <section className="project-form-section">
                <label htmlFor="project-stack">기술 스택 *</label>
                <div className="project-stack-input">
                  <input
                    id="project-stack"
                    placeholder="사용한 기술 스택을 입력해주세요."
                    value={stackInput}
                    onChange={(event) => setStackInput(event.target.value)}
                    onKeyDown={handleStackKeyDown}
                  />
                  <button type="button" onClick={handleAddStack}>
                    <Plus size={16} strokeWidth={2.3} />
                    추가
                  </button>
                </div>
                <div className="project-stack-list" aria-label="등록된 기술 스택">
                  {stacks.map((stack) => (
                    <button key={stack} type="button" onClick={() => setStacks((current) => current.filter((item) => item !== stack))}>
                      {stack}
                      <Trash2 size={13} strokeWidth={2.2} />
                    </button>
                  ))}
                </div>
              </section>

              <section className="project-form-section">
                <label htmlFor="project-image">썸네일 이미지</label>
                <p>새 이미지를 선택하지 않으면 기존 썸네일을 유지합니다.</p>
                <label className="project-image-dropzone" htmlFor="project-image">
                  <Upload size={26} strokeWidth={2.1} />
                  <strong>{imageName || "이미지 파일을 선택해 썸네일을 교체하세요."}</strong>
                  <span>JPG, PNG, WEBP 파일만 지원</span>
                </label>
                <input
                  id="project-image"
                  accept="image/jpeg,image/png,image/webp"
                  className="project-file-input"
                  type="file"
                  onChange={handleImageChange}
                />
                {(imageFile || thumbnail) && (
                  <div className="project-selected-file">
                    <FileImage size={18} />
                    <strong>{imageName}</strong>
                    {imageFile && <button type="button" onClick={() => setImageFile(null)}>삭제</button>}
                  </div>
                )}
              </section>

              <div className="project-form-actions">
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

export default ProjectFeedbackEditPage;

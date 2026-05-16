import { ChangeEvent, FormEvent, KeyboardEvent, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Code2,
  FileImage,
  GitBranch,
  Lightbulb,
  Link as LinkIcon,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  PROJECT_FEEDBACK_CATEGORIES,
  type ProjectFeedbackCategory,
} from "../model/projectFeedback";
import "./ProjectFeedbackWritePage.css";

type ProjectPostCreatePayload = {
  title: string;
  description: string;
  file_url: string;
  thumbnail: string;
  position: Exclude<ProjectFeedbackCategory, "전체">;
};

type WritingStep = {
  label: string;
  description: string;
  isDone: boolean;
};

const positions = PROJECT_FEEDBACK_CATEGORIES.filter(
  (category): category is Exclude<ProjectFeedbackCategory, "전체"> => category !== "전체",
);

const feedbackTypes = [
  {
    icon: Sparkles,
    title: "기능 개선 제안",
    description: "사용성, 기능 추가 아이디어를 제안받을 수 있어요.",
  },
  {
    icon: Code2,
    title: "코드 및 구조 리뷰",
    description: "코드 품질, 설계 구조에 대한 의견을 받을 수 있어요.",
  },
  {
    icon: Lightbulb,
    title: "기술 스택 조언",
    description: "기술 선택의 적절성, 대안 기술을 추천받을 수 있어요.",
  },
  {
    icon: ShieldCheck,
    title: "성능 및 보안",
    description: "성능 개선, 보안 이슈에 대한 피드백을 받을 수 있어요.",
  },
  {
    icon: MessageSquare,
    title: "기타 조언",
    description: "배포, 협업 방식, 문서화 등 다양한 조언을 받을 수 있어요.",
  },
];

const etiquette = [
  "상대방을 존중하는 태도로 피드백을 주고받아요.",
  "비판보다는 건설적인 제안을 해주세요.",
  "모든 피드백은 감사히 받아들이는 자세를 가져요.",
  "좋은 피드백 문화는 함께 만들어가요.",
];

function ProjectFeedbackWriteSidebar({ steps }: { steps: WritingStep[] }) {
  const completedCount = steps.filter((step) => step.isDone).length;
  const progressValue = Math.round((completedCount / steps.length) * 100);

  return (
    <aside className="project-write-sidebar" aria-label="프로젝트 피드백 작성 안내">
      <Link className="project-write-sidebar__back" to={ROUTES.projectFeedbacks}>
        목록으로 돌아가기
      </Link>

      <h2>피드백 작성</h2>

      <div className="project-write-sidebar__progress" aria-label="작성 진행률">
        <div>
          <strong>{progressValue}%</strong>
          <span>
            {completedCount}/{steps.length} 완료
          </span>
        </div>
        <progress value={completedCount} max={steps.length} />
      </div>

      <ol className="project-write-sidebar__steps">
        {steps.map((step, index) => {
          const StepIcon = step.isDone ? CheckCircle2 : Circle;

          return (
            <li className={step.isDone ? "is-done" : ""} key={step.label}>
              <span aria-hidden="true">
                <StepIcon size={18} strokeWidth={2.2} />
              </span>
              <div>
                <strong>
                  {index + 1}. {step.label}
                </strong>
                <p>{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="project-write-sidebar__tip">
        <h3>피드백 작성 팁</h3>
        <ul>
          <li>구체적인 정보를 제공할수록 좋은 피드백을 받을 수 있어요.</li>
          <li>기술 스택, 구현 기능, 고민했던 부분을 자세히 적어보세요.</li>
          <li>스크린샷이나 링크가 있으면 검토가 쉬워져요.</li>
        </ul>
        <Link to={ROUTES.guide}>
          <BookOpen size={17} strokeWidth={2.2} />
          작성 가이드 보기
        </Link>
      </section>
    </aside>
  );
}

function ProjectFeedbackWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<"" | Exclude<ProjectFeedbackCategory, "전체">>("");
  const [intro, setIntro] = useState("");
  const [features, setFeatures] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [stacks, setStacks] = useState<string[]>([]);
  const [projectUrl, setProjectUrl] = useState("");
  const [linkType, setLinkType] = useState("GitHub");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [extraFeedback, setExtraFeedback] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const canSubmit = Boolean(title.trim() && position && intro.trim() && features.trim() && stacks.length > 0);

  const writingSteps = useMemo<WritingStep[]>(
    () => [
      {
        label: "제목",
        description: title.trim() ? "프로젝트 제목이 입력됐어요." : "피드백 받을 프로젝트를 한 줄로 적어주세요.",
        isDone: Boolean(title.trim()),
      },
      {
        label: "분야",
        description: position ? `${position} 분야로 등록돼요.` : "프로젝트와 가장 가까운 분야를 선택하세요.",
        isDone: Boolean(position),
      },
      {
        label: "프로젝트 설명",
        description: intro.trim() ? "프로젝트 소개가 작성됐어요." : "무엇을 해결하는 프로젝트인지 적어주세요.",
        isDone: Boolean(intro.trim()),
      },
      {
        label: "주요 기능",
        description: features.trim() ? "핵심 기능이 정리됐어요." : "구현한 기능과 특징을 bullet points로 적어주세요.",
        isDone: Boolean(features.trim()),
      },
      {
        label: "기술 스택",
        description: stacks.length > 0 ? `${stacks.length}개 기술 스택이 등록됐어요.` : "사용한 기술 스택을 추가하세요.",
        isDone: stacks.length > 0,
      },
    ],
    [features, intro, position, stacks.length, title],
  );

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
    setImageFile(selectedFile);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !position) return;

    const description = [
      intro.trim(),
      "",
      "[주요 기능]",
      features.trim(),
      "",
      `[기술 스택] ${stacks.join(", ")}`,
      extraFeedback.trim() ? `\n[추가로 받고 싶은 피드백]\n${extraFeedback.trim()}` : "",
      anonymous ? "\n[작성 옵션] 익명 작성" : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload: ProjectPostCreatePayload = {
      title: title.trim(),
      description,
      file_url: projectUrl.trim(),
      thumbnail: imageFile?.name ?? "",
      position,
    };

    console.log("POST /project-posts payload", payload, { linkType });
    navigate(ROUTES.projectFeedbacks);
  };

  return (
    <AppLayout>
      <div className="project-write-page">
        <ProjectFeedbackWriteSidebar steps={writingSteps} />

        <main className="project-write-content">
          <div className="project-write-heading">
            <h1>프로젝트 피드백 글 작성</h1>
            <p>프로젝트에 대해 설명하고, 어떤 피드백을 받고 싶은지 작성해주세요.</p>
          </div>

          <form className="project-write-form" onSubmit={handleSubmit}>
            <section className="project-form-section">
              <label htmlFor="project-title">제목 *</label>
              <div className="project-input-with-count">
                <input
                  id="project-title"
                  maxLength={50}
                  placeholder="프로젝트 제목을 입력해주세요. 예: 스터디 매칭 플랫폼"
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
                  placeholder="프로젝트가 무엇인지, 어떤 문제를 해결하고자 했는지 간단히 설명해주세요."
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
                  placeholder="프로젝트의 주요 기능과 특징을 bullet points 형태로 작성해주세요."
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
                  placeholder="사용한 기술 스택을 입력해주세요. 예: Next.js, TypeScript, Prisma"
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
              <label htmlFor="project-link">프로젝트 링크</label>
              <p>GitHub, 배포 사이트, 시연 영상 등 관련 링크를 추가해주세요.</p>
              <div className="project-link-row">
                <div>
                  <LinkIcon size={18} strokeWidth={2.2} />
                  <input
                    id="project-link"
                    placeholder="https://github.com/username/project"
                    value={projectUrl}
                    onChange={(event) => setProjectUrl(event.target.value)}
                  />
                </div>
                <select value={linkType} onChange={(event) => setLinkType(event.target.value)}>
                  <option>GitHub</option>
                  <option>배포 URL</option>
                  <option>시연 영상</option>
                  <option>문서</option>
                </select>
              </div>
            </section>

            <section className="project-form-section">
              <label htmlFor="project-image">참고 이미지</label>
              <p>프로젝트 화면, 아키텍처 다이어그램, ERD 등 참고할 수 있는 이미지를 첨부해주세요.</p>
              <label className="project-image-dropzone" htmlFor="project-image">
                <Upload size={26} strokeWidth={2.1} />
                <strong>{imageFile ? imageFile.name : "이미지 파일을 드래그하거나 클릭해서 업로드하세요."}</strong>
                <span>JPG, PNG, GIF 파일 권장</span>
              </label>
              <input
                id="project-image"
                accept="image/*"
                className="project-file-input"
                type="file"
                onChange={handleImageChange}
              />
              {imageFile && (
                <div className="project-selected-file">
                  <FileImage size={18} />
                  <strong>{imageFile.name}</strong>
                  <button type="button" onClick={() => setImageFile(null)}>
                    삭제
                  </button>
                </div>
              )}
            </section>

            <section className="project-form-section">
              <label htmlFor="project-extra-feedback">추가로 받고 싶은 피드백</label>
              <div className="project-textarea-with-count">
                <textarea
                  id="project-extra-feedback"
                  maxLength={300}
                  placeholder={"특히 어떤 부분에 대한 피드백을 받고 싶은지 적어주세요.\n예: 구조 개선 방향, 코드 리뷰, 기능 제안 등"}
                  value={extraFeedback}
                  onChange={(event) => setExtraFeedback(event.target.value)}
                />
                <span>{extraFeedback.length}/300</span>
              </div>
            </section>

            <div className="project-form-actions">
              <label>
                <input
                  checked={anonymous}
                  type="checkbox"
                  onChange={(event) => setAnonymous(event.target.checked)}
                />
                익명으로 작성
              </label>
              <button disabled={!canSubmit} type="submit">
                작성 완료
              </button>
            </div>
          </form>
        </main>

        <aside className="project-write-aside" aria-label="작성 도움말">
          <section>
            <h2>어떤 피드백을 받을 수 있나요?</h2>
            <div className="project-feedback-type-list">
              {feedbackTypes.map(({ icon: Icon, title: feedbackTitle, description }) => (
                <article key={feedbackTitle}>
                  <span>
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div>
                    <h3>{feedbackTitle}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>피드백 에티켓</h2>
            <ul className="project-etiquette-list">
              {etiquette.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={17} strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

export default ProjectFeedbackWritePage;

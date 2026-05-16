import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Edit3,
  FileText,
  Check,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { RESUME_FEEDBACK_CATEGORIES, type ResumeFeedbackCategory } from "../model/resumeFeedback";
import "./ResumeFeedbackWritePage.css";

type Visibility = "public" | "followers";

type ResumePostCreatePayload = {
  title: string;
  description: string;
  file_url: string;
  thumbnail: string;
  position: Exclude<ResumeFeedbackCategory, "전체">;
};

type WritingStep = {
  label: string;
  description: string;
  isDone: boolean;
};

const positions = RESUME_FEEDBACK_CATEGORIES.filter(
  (category): category is Exclude<ResumeFeedbackCategory, "전체"> => category !== "전체",
);

const writingTips = [
  "구체적으로 작성할수록 더 정확한 피드백을 받을 수 있어요.",
  "특히 궁금한 부분이나 고민되는 부분을 상세히 적어주세요.",
  "이력서의 전체적인 방향성도 함께 고민해보세요.",
];

function ResumeFeedbackWriteSidebar({ steps }: { steps: WritingStep[] }) {
  const completedCount = steps.filter((step) => step.isDone).length;
  const progressValue = Math.round((completedCount / steps.length) * 100);

  return (
    <aside className="resume-write-sidebar" aria-label="이력서 피드백 작성 안내">
      <h2>이력서 피드백</h2>

      <div className="resume-write-sidebar__progress" aria-label="작성 진행률">
        <div>
          <strong>{progressValue}%</strong>
          <span>
            {completedCount}/{steps.length} 완료
          </span>
        </div>
        <progress value={completedCount} max={steps.length} />
      </div>

      <ol className="resume-write-sidebar__steps">
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

      <div className="resume-write-sidebar__status">
        <strong>{completedCount === steps.length ? "제출 준비 완료" : "작성 중"}</strong>
        <span>
          {completedCount === steps.length
            ? "오른쪽 작성 완료 버튼을 눌러 피드백 요청을 올릴 수 있어요."
            : "필수 항목을 채우면 제출 버튼이 활성화돼요."}
        </span>
      </div>
    </aside>
  );
}

function ResumeFeedbackWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<"" | Exclude<ResumeFeedbackCategory, "전체">>("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const canSubmit = Boolean(title.trim() && position && description.trim() && file);
  const writingSteps = useMemo<WritingStep[]>(
    () => [
      {
        label: "제목",
        description: title.trim() ? "요청 제목이 입력됐어요." : "어떤 피드백을 받고 싶은지 한 줄로 적어주세요.",
        isDone: Boolean(title.trim()),
      },
      {
        label: "직무",
        description: position ? `${position} 기준으로 피드백을 받을 수 있어요.` : "지원하거나 목표로 하는 직무를 선택하세요.",
        isDone: Boolean(position),
      },
      {
        label: "이력서 첨부",
        description: file ? `${file.name} 파일이 첨부됐어요.` : "검토받을 PDF 또는 DOCX 파일을 올려주세요.",
        isDone: Boolean(file),
      },
      {
        label: "요청 내용",
        description: description.trim() ? "중점적으로 볼 내용이 작성됐어요." : "궁금한 점과 고민되는 부분을 구체적으로 남겨주세요.",
        isDone: Boolean(description.trim()),
      },
    ],
    [description, file, position, title],
  );

  const fileSizeText = useMemo(() => {
    if (!file) return "";
    return `${Math.max(1, Math.round(file.size / 1024))}KB`;
  }, [file]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();

    const nextTag = tagInput.trim().replace(/^#/, "");
    if (!nextTag || tags.includes(nextTag) || tags.length >= 5) return;

    setTags((current) => [...current, nextTag]);
    setTagInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !position || !file) return;

    const payload: ResumePostCreatePayload = {
      title: title.trim(),
      description: description.trim(),
      file_url: file.name,
      thumbnail: "",
      position,
    };

    console.log("POST /resume-posts payload", payload);
    navigate(ROUTES.resumeFeedbacks);
  };

  return (
    <AppLayout>
      <div className="resume-write-page">
        <ResumeFeedbackWriteSidebar steps={writingSteps} />

        <main className="resume-write-content">
          <div className="resume-write-heading">
            <h1>이력서 피드백 글 작성</h1>
            <p>이력서를 공유하고, 더 나은 방향으로 개선할 수 있도록 피드백을 받아보세요.</p>
          </div>

          <form className="resume-write-form" onSubmit={handleSubmit}>
            <section className="resume-form-section">
              <label htmlFor="resume-title">1. 제목</label>
              <div className="resume-input-with-count">
                <input
                  id="resume-title"
                  maxLength={100}
                  placeholder="제목을 입력해주세요. 예: 백엔드 신입 이력서 피드백 부탁드립니다!"
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
              <label htmlFor="resume-file">3. 이력서 첨부</label>
              <label className="resume-file-dropzone" htmlFor="resume-file">
                <Upload size={30} strokeWidth={2.1} />
                <strong>이력서 파일을 드래그하거나 클릭하여 첨부하세요</strong>
                <span>PDF, DOCX 파일만 가능 (최대 10MB)</span>
              </label>
              <input
                id="resume-file"
                accept=".pdf,.doc,.docx"
                className="resume-file-input"
                type="file"
                onChange={handleFileChange}
              />
              {file && (
                <div className="resume-selected-file">
                  <FileText size={18} />
                  <strong>{file.name}</strong>
                  <span>{fileSizeText}</span>
                  <button type="button" aria-label="첨부 파일 삭제" onClick={() => setFile(null)}>
                    <X size={18} />
                  </button>
                </div>
              )}
            </section>

            <section className="resume-form-section">
              <label htmlFor="resume-description">4. 피드백 요청 내용</label>
              <p>어떤 부분을 중점적으로 봐주시면 좋을지, 궁금한 점을 자세히 적어주세요.</p>
              <div className="resume-textarea-with-count">
                <textarea
                  id="resume-description"
                  maxLength={1000}
                  placeholder={"예) 기술 스택의 적정성, 프로젝트 경험 어필 방법, 문장 표현 개선 등\n궁금한 점을 구체적으로 작성해주세요."}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <span>{description.length}/1000</span>
              </div>
            </section>

            <div className="resume-form-actions">
              <button disabled={!canSubmit} type="submit">
                작성 완료
              </button>
            </div>
          </form>
        </main>

        <aside className="resume-write-aside" aria-label="작성 도움말">
          <section>
            <h2>작성 팁</h2>
            <div className="resume-write-tip-list">
              {writingTips.map((tip) => (
                <article key={tip}>
                  <span>
                    <FileText size={18} strokeWidth={2.2} />
                  </span>
                  <p>{tip}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>좋은 요청 예시</h2>
            <div className="resume-example-card is-good">
              <strong>백엔드 개발자 신입입니다.</strong>
              <p>이력서의 프로젝트 경험이 잘 어필되고 있는지, 기술 스택의 적정성, 문장 표현 개선이 필요한 부분을 중점적으로 봐주세요.</p>
            </div>
            <div className="resume-example-card is-bad">
              <strong>피해야 할 요청 예시</strong>
              <p>이력서 피드백 부탁드려요. 잘 봐주세요.</p>
            </div>
          </section>

          <section>
            <h2>주의사항</h2>
            <ul className="resume-caution-list">
              <li>첨부된 이력서는 피드백 목적으로만 사용됩니다.</li>
              <li>개인정보 및 민감한 정보는 포함하지 마세요.</li>
              <li>비방, 욕설, 광고 등 부적절한 내용은 삭제될 수 있습니다.</li>
            </ul>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

export default ResumeFeedbackWritePage;

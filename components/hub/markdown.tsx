import { Fragment, type ReactNode } from "react";
import { CopyButton } from "./primitives";

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-cyber-emerald">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-white/10 px-1.5 py-0.5 font-code text-[13px] text-cyber-cyan">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function CodeBlock({ raw }: { raw: string }) {
  const newline = raw.indexOf("\n");
  const lang = newline > -1 ? raw.slice(0, newline).trim() : "";
  const code = (newline > -1 ? raw.slice(newline + 1) : raw).replace(/\n$/, "");

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-white/10 bg-[#020406]">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <span className="font-code text-xs uppercase text-slate-500">{lang || "code"}</span>
        <CopyButton text={code} label="Copy Code" className="h-7" />
      </div>
      <pre className="overflow-x-auto p-3 font-code text-[13px] leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p key={blocks.length} className="whitespace-pre-line">
          {renderInline(paragraph.join("\n"))}
        </p>,
      );
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      const Tag = list.ordered ? "ol" : "ul";
      blocks.push(
        <Tag key={blocks.length} className={list.ordered ? "list-decimal space-y-1 pl-5" : "list-disc space-y-1 pl-5"}>
          {list.items.map((item, i) => (
            <li key={i} className="marker:text-cyber-emerald">
              {renderInline(item)}
            </li>
          ))}
        </Tag>,
      );
      list = null;
    }
  };

  for (const line of text.split("\n")) {
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const ordered = line.match(/^\d+\.\s+(.*)$/);
    const bullet = line.match(/^[-*]\s+(.*)$/);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(
        <h3 key={blocks.length} className="font-outfit text-base font-bold text-white">
          {renderInline(heading[2])}
        </h3>,
      );
    } else if (ordered || bullet) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      if (!list) list = { ordered: isOrdered, items: [] };
      list.items.push((ordered ?? bullet)![1]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return <>{blocks}</>;
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="msg-text space-y-2.5 break-words text-slate-100">
      {text.split("```").map((part, i) => (i % 2 ? <CodeBlock key={i} raw={part} /> : <TextBlock key={i} text={part} />))}
    </div>
  );
}

"use client";

import * as React from "react";
import { Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";

function reverseGraphemes(input: string) {
  if (!input) return "";

  const Segmenter = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter })
    .Segmenter;
  if (typeof Segmenter === "function") {
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(input), (s) => s.segment)
      .reverse()
      .join("");
  }

  return Array.from(input).reverse().join("");
}

async function writeClipboardText(text: string) {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // 忽略，走兜底逻辑
  }

  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "fixed";
  el.style.top = "-9999px";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export default function Home() {
  const [text, setText] = React.useState("");
  const [copied, setCopied] = React.useState<"idle" | "ok" | "fail">("idle");

  const reversed = React.useMemo(() => reverseGraphemes(text), [text]);

  const inputCount = React.useMemo(() => Array.from(text).length, [text]);
  const outputCount = React.useMemo(
    () => Array.from(reversed).length,
    [reversed]
  );

  React.useEffect(() => {
    if (copied === "idle") return;
    const timer = window.setTimeout(() => setCopied("idle"), 1400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="min-h-svh">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,hsl(var(--ring)/0.10)_0%,transparent_60%),radial-gradient(40%_30%_at_10%_20%,hsl(var(--chart-2)/0.10)_0%,transparent_55%),radial-gradient(45%_35%_at_90%_30%,hsl(var(--chart-1)/0.10)_0%,transparent_60%)]" />

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:py-14">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              我爱说反话
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-pretty text-base text-muted-foreground">
            你说什么，我就把它倒过来输出。例：输入“你好”，输出“好你”。
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle>我说</CardTitle>
              <CardDescription>支持多行。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="比如：你好"
                className="min-h-40 md:min-h-56"
              />
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>字符数：{inputCount}</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setText("");
                    setCopied("idle");
                  }}
                  disabled={!text}
                >
                  <RotateCcw aria-hidden />
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle>反转</CardTitle>
              <CardDescription>可以一键复制到剪贴板。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Textarea
                value={reversed}
                readOnly
                placeholder="这里会显示“反话”结果"
                className="min-h-40 md:min-h-56"
              />
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  字符数：{outputCount}
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-5 text-muted-foreground">
                    {copied === "ok"
                      ? "已复制"
                      : copied === "fail"
                      ? "复制失败"
                      : ""}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={async () => {
                      try {
                        await writeClipboardText(reversed);
                        setCopied("ok");
                      } catch {
                        setCopied("fail");
                      }
                    }}
                    disabled={!reversed}
                  >
                    <Copy aria-hidden />
                    复制
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

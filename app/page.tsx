"use client";

import { useState } from "react";

type GeneratedContent = {
  title?: string;
  introduction?: string;
  content?: string;
  conclusion?: string;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter your blog topic.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
          details: details.trim(),
          keywords: keywords.trim(),
          tone,
          length,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Something went wrong while generating the blog."
        );
      }

      if (!data?.result) {
        throw new Error("AI returned an empty result.");
      }

      let generated: GeneratedContent;

      if (typeof data.result === "string") {
        try {
          generated = JSON.parse(data.result);
        } catch {
          generated = {
            content: data.result,
          };
        }
      } else {
        generated = data.result;
      }

      setResult({
        title: generated.title || "",
        introduction: generated.introduction || "",
        content: generated.content || "",
        conclusion: generated.conclusion || "",
      });
    } catch (err) {
      console.error("BLOG GENERATION ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate blog content."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;

    const text = [
      result.title ? `TITLE\n\n${result.title}` : "",
      result.introduction
        ? `INTRODUCTION\n\n${result.introduction}`
        : "",
      result.content ? `BLOG CONTENT\n\n${result.content}` : "",
      result.conclusion
        ? `CONCLUSION\n\n${result.conclusion}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      alert("Blog copied successfully!");
    } catch {
      alert("Unable to copy. Please copy manually.");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#071c16] via-[#071310] to-[#050807] text-white">

      {/* BACKGROUND GLOWS */}

      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[600px] w-[800px] max-w-[100vw] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[150px]" />

      <div className="pointer-events-none absolute left-[-180px] top-[45%] h-[350px] w-[350px] rounded-full bg-green-500/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[65%] h-[350px] w-[350px] rounded-full bg-teal-400/10 blur-[140px]" />

      {/* NAVBAR */}

      <nav className="relative z-20 mx-4 mt-5 rounded-3xl border border-emerald-400/10 bg-[#07100d]/80 px-4 py-4 shadow-2xl shadow-emerald-950/30 backdrop-blur-2xl sm:mx-auto sm:max-w-6xl sm:px-6">

        <div className="flex items-center justify-between gap-4">

          {/* BRAND */}

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-400/20 bg-white/5">

              <img
                src="/logo.png"
                alt="KrishAIWorks"
                className="h-full w-full rounded-full object-cover"
              />

            </div>

            <div className="min-w-0">

              <h2 className="truncate text-sm font-bold text-white sm:text-base">
                KrishAIWorks
              </h2>

              <p className="text-[10px] text-zinc-500 sm:text-xs">
                AI Solutions That Work
              </p>

            </div>

          </div>

          {/* DESKTOP NAV */}

          <div className="hidden items-center gap-7 text-sm text-zinc-300 md:flex">

            <a
              href="#home"
              className="transition hover:text-emerald-300"
            >
              Home
            </a>

            <a
              href="#features"
              className="transition hover:text-emerald-300"
            >
              Features
            </a>

            <a
              href="#how"
              className="transition hover:text-emerald-300"
            >
              How To Use
            </a>

            <a
              href="#faq"
              className="transition hover:text-emerald-300"
            >
              FAQ
            </a>

            <a
              href="https://www.instagram.com/krishaiworks/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-400 px-5 py-2 font-medium text-black shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-300"
            >
              Follow
            </a>

          </div>

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-300 transition hover:bg-emerald-400/20 md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

        </div>

      </nav>

      {/* MOBILE NAV */}

      {menuOpen && (
        <div className="relative z-30 mx-4 mt-2 rounded-3xl border border-emerald-400/10 bg-[#07100d]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden">

          <div className="flex flex-col gap-1">

            {[
              ["#home", "Home"],
              ["#features", "Features"],
              ["#how", "How To Use"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-emerald-400/10 hover:text-emerald-300"
              >
                {label}
              </a>
            ))}

            <a
              href="https://www.instagram.com/krishaiworks/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-2xl bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-emerald-300"
            >
              Follow
            </a>

          </div>

        </div>
      )}

      {/* HERO */}

      <section
        id="home"
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-8 sm:pt-24"
      >

        <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs text-emerald-200">
          ✍️ AI-Powered Blog Generator
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Built by{" "}
          <span className="font-semibold text-emerald-400">
            KrishAIWorks
          </span>
        </p>

        <h1 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">

          Turn Ideas Into

          <br />

          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Powerful Blogs.
          </span>

        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
          Generate well-structured, engaging blog posts with AI.
          Choose your tone and length, add your keywords, and turn
          your idea into publish-ready content.
        </p>

        {/* PILLS */}

        <div className="mt-7 flex max-w-full flex-wrap justify-center gap-3">

          <span className="rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300">
            ✍️ AI Writing
          </span>

          <span className="rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300">
            🔎 Keyword Friendly
          </span>

          <span className="rounded-full border border-white/5 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300">
            ⚡ Instant Generation
          </span>

        </div>

        {/* GENERATOR */}

        <div
          id="generator"
          className="mt-12 w-full max-w-4xl"
        >

          <div className="w-full rounded-[2rem] border border-emerald-400/10 bg-[#07100d]/70 p-4 text-left shadow-2xl shadow-emerald-950/30 backdrop-blur-2xl sm:p-7">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              AI Blog Generator
            </p>

            <h2 className="mt-3 text-lg font-semibold text-white sm:text-xl">
              Write your next great article.
            </h2>

            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
              Give AI your idea and let it create a complete blog.
            </p>

            <div className="mt-7 space-y-5">

              {/* TOPIC */}

              <div>

                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Blog Topic
                </label>

                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Example: How AI is changing the future of education..."
                  rows={5}
                  className="box-border block w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-600 transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 sm:px-5"
                />

              </div>

              {/* DETAILS */}

              <div>

                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Extra Details{" "}
                  <span className="text-zinc-600">(Optional)</span>
                </label>

                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Audience, key points, information, examples, etc..."
                  rows={5}
                  className="box-border block w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-zinc-600 transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 sm:px-5"
                />

              </div>

              {/* KEYWORDS */}

              <div>

                <label className="mb-2 block text-xs font-medium text-zinc-400">
                  Keywords{" "}
                  <span className="text-zinc-600">(Optional)</span>
                </label>

                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Example: artificial intelligence, education, students"
                  className="box-border block h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                />

              </div>

              {/* OPTIONS */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Writing Tone
                  </label>

                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="box-border block h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  >
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Conversational</option>
                    <option>Educational</option>
                    <option>Persuasive</option>
                    <option>Storytelling</option>
                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-xs font-medium text-zinc-400">
                    Blog Length
                  </label>

                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="box-border block h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                  >
                    <option>Short</option>
                    <option>Medium</option>
                    <option>Long</option>
                  </select>

                </div>

              </div>

              {/* BUTTON */}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-emerald-400 px-5 text-sm font-semibold text-black shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "🧠 Writing Your Blog..."
                  : "✨ Generate Blog"}
              </button>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-300">
                ⚠️ {error}
              </div>
            )}

            {/* RESULT */}

            {result && (
              <div
                id="blog-result"
                className="mt-8 rounded-3xl border border-emerald-400/10 bg-black/40 p-5 shadow-xl shadow-emerald-950/10 sm:p-7"
              >

                {/* RESULT HEADER */}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                      AI Generated Result
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-white">
                      Your Blog Content
                    </h3>

                  </div>

                  <button
                    type="button"
                    onClick={copyResult}
                    className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/20"
                  >
                    📋 Copy All
                  </button>

                </div>

                {/* TITLE */}

                <div className="mt-7">

                  <div className="flex items-center gap-2">

                    <span className="text-lg">📌</span>

                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                      Blog Title
                    </h4>

                  </div>

                  <div className="mt-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5 text-base font-semibold leading-7 text-white">
                    {result.title || "No title returned."}
                  </div>

                </div>

                {/* INTRODUCTION */}

                <div className="mt-8">

                  <div className="flex items-center gap-2">

                    <span className="text-lg">🌱</span>

                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                      Introduction
                    </h4>

                  </div>

                  <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/5 bg-[#07100d] p-5 text-sm leading-8 text-zinc-300">
                    {result.introduction || "No introduction returned."}
                  </div>

                </div>

                {/* BLOG CONTENT */}

                <div className="mt-8">

                  <div className="flex items-center gap-2">

                    <span className="text-lg">📝</span>

                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                      Blog Content
                    </h4>

                  </div>

                  <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/5 bg-[#07100d] p-5 text-sm leading-8 text-zinc-300">
                    {result.content || "No blog content returned."}
                  </div>

                </div>

                {/* CONCLUSION */}

                <div className="mt-8">

                  <div className="flex items-center gap-2">

                    <span className="text-lg">🎯</span>

                    <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                      Conclusion
                    </h4>

                  </div>

                  <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/5 bg-[#07100d] p-5 text-sm leading-8 text-zinc-300">
                    {result.conclusion || "No conclusion returned."}
                  </div>

                </div>

              </div>
            )}

            <p className="mt-4 text-xs text-zinc-600">
              AI-generated content should be reviewed and customized before
              publishing.
            </p>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-8"
      >

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            What You Get
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Everything you need to write better.
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-500">
            Turn simple ideas into structured, readable and engaging
            blog content.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          <FeatureCard
            icon="✍️"
            title="AI-Powered Writing"
            description="Generate complete blog content from a simple topic or idea."
          />

          <FeatureCard
            icon="🎯"
            title="Multiple Tones"
            description="Choose from professional, friendly, educational, persuasive and more."
          />

          <FeatureCard
            icon="📏"
            title="Flexible Length"
            description="Control whether your generated blog is short, medium or long."
          />

          <FeatureCard
            icon="🔎"
            title="Keyword Support"
            description="Provide relevant keywords to guide your AI-generated content."
          />

          <FeatureCard
            icon="🧠"
            title="Structured Content"
            description="Get a clear title, introduction, main content and conclusion."
          />

          <FeatureCard
            icon="📋"
            title="Easy To Copy"
            description="Copy the entire generated blog instantly and customize it."
          />

        </div>

      </section>

      {/* HOW TO USE */}

      <section
        id="how"
        className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-8"
      >

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            How To Use
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Three simple steps.
          </h2>

          <p className="mt-4 text-sm leading-7 text-zinc-500">
            From idea to complete blog in just a few clicks.
          </p>

        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">

          <StepCard
            number="01"
            title="Enter Your Topic"
            description="Tell AI what you want your blog to be about."
          />

          <StepCard
            number="02"
            title="Customize"
            description="Add keywords, details, tone and your preferred blog length."
          />

          <StepCard
            number="03"
            title="Generate"
            description="Let AI create a structured blog ready for your review."
          />

        </div>

      </section>

      {/* FAQ */}

      <section
        id="faq"
        className="relative z-10 mx-auto w-full max-w-3xl px-4 py-24 sm:px-8"
      >

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            FAQ
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="mt-10 space-y-4">

          <Faq
            question="What can this blog generator create?"
            answer="It can generate structured blog content including a title, introduction, main content and conclusion based on your topic and details."
          />

          <Faq
            question="Can I choose the writing tone?"
            answer="Yes. You can choose from professional, friendly, conversational, educational, persuasive and storytelling styles."
          />

          <Faq
            question="Can I control the blog length?"
            answer="Yes. Choose Short, Medium or Long depending on how much content you want."
          />

          <Faq
            question="Can I provide keywords?"
            answer="Yes. You can provide relevant keywords to help guide the generated blog content."
          />

        </div>

      </section>

      {/* CTA */}

      <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-20 sm:px-8">

        <div className="rounded-[2rem] border border-emerald-400/10 bg-emerald-950/20 px-5 py-14 text-center shadow-2xl shadow-emerald-950/20">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Start Writing
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Your next blog starts with one idea.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            Give AI your topic and turn it into a polished article in
            seconds.
          </p>

          <a
            href="#generator"
            className="mt-7 inline-flex rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-black shadow-xl shadow-emerald-400/20 transition hover:bg-emerald-300"
          >
            ✨ Generate Your Blog
          </a>

        </div>

      </section>

  {/* FOOTER */}

<footer className="relative z-10 border-t border-white/5">

  <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8">

    {/* RELATED TOOLS */}

    <div className="mb-12">

      <div className="mx-auto max-w-2xl text-center">

        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
          Explore More
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          More AI Writing Tools
        </h2>

        <p className="mt-3 text-sm leading-7 text-zinc-500">
          Explore more AI-powered tools from KrishAIWorks to write,
          improve and create better content.
        </p>

      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* AI TEXT HUMANIZER */}

        <a
          href="https://aitexthumanizer.krishaiworks.com/"
          className="group rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-lg">
            ✨
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white transition group-hover:text-emerald-300">
            AI Text Humanizer
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-500">
            Make AI-generated text sound more natural and human.
          </p>

        </a>

        {/* AI GRAMMAR & WRITING FIXER */}

        <a
          href="https://aigrammarwritingfixer.krishaiworks.com/"
          className="group rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-lg">
            ✍️
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white transition group-hover:text-emerald-300">
            AI Grammar & Writing Fixer
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-500">
            Fix grammar, spelling and improve your writing with AI.
          </p>

        </a>

        {/* AI INSTAGRAM CAPTION GENERATOR */}

        <a
          href="https://aiinstagramcaptiongenerator.krishaiworks.com/"
          className="group rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-lg">
            📸
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white transition group-hover:text-emerald-300">
            AI Instagram Caption Generator
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-500">
            Create engaging Instagram captions for your posts.
          </p>

        </a>

        {/* AI LINKEDIN POST GENERATOR */}

        <a
          href="https://ailinkedinpostgenerator.krishaiworks.com/"
          className="group rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-lg">
            💼
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white transition group-hover:text-emerald-300">
            AI LinkedIn Post Generator
          </h3>

          <p className="mt-2 text-xs leading-6 text-zinc-500">
            Generate professional and engaging LinkedIn posts with AI.
          </p>

        </a>

      </div>

      {/* EXTRA RELEVANT LINK */}

      <div className="mt-4 flex justify-center">

        <a
          href="https://aiyoutubetitledescriptiongenerator.krishaiworks.com/"
          className="group flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]"
        >

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/10 text-lg">
            🎬
          </div>

          <div>

            <h3 className="text-sm font-semibold text-white transition group-hover:text-emerald-300">
              AI YouTube Title & Description Generator
            </h3>

            <p className="mt-1 text-xs leading-6 text-zinc-500">
              Create optimized titles and descriptions for YouTube videos.
            </p>

          </div>

        </a>

      </div>

    </div>

    {/* FOOTER MAIN */}

    <div className="border-t border-white/5 pt-8">

      <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">

        {/* BRAND */}

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-emerald-400/20 bg-white/5">

            <img
              src="/logo.png"
              alt="KrishAIWorks"
              className="h-full w-full rounded-full object-cover"
            />

          </div>

          <div>

            <p className="text-sm font-semibold text-white">
              KrishAIWorks
            </p>

            <p className="text-xs text-zinc-600">
              AI Solutions That Work
            </p>

          </div>

        </div>

        {/* COPYRIGHT */}

        <p className="text-xs text-zinc-600">
          © 2026 KrishAIWorks. Built with AI.
        </p>

      </div>

    </div>

  </div>

</footer>

    </main>
  );
}

/* FEATURE CARD */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-400/[0.03]">

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/10 text-lg">
        {icon}
      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* STEP CARD */

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.025] p-6">

      <span className="text-xs font-bold tracking-[0.2em] text-emerald-400">
        {number}
      </span>

      <h3 className="mt-4 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-zinc-500">
        {description}
      </p>

    </div>
  );
}

/* FAQ */

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-white/5 bg-white/[0.025] p-5">

      <summary className="cursor-pointer list-none text-sm font-semibold text-white">
        <div className="flex items-center justify-between gap-4">
          <span>{question}</span>

          <span className="text-emerald-400 transition group-open:rotate-45">
            +
          </span>
        </div>
      </summary>

      <p className="mt-4 text-sm leading-7 text-zinc-500">
        {answer}
      </p>

    </details>
  );
}
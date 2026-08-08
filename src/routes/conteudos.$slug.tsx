import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ARTICLES, getArticle, type Article } from "@/lib/articles";
import { CATEGORIES, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTriage } from "@/components/site/triage-context";
import { trackEvent } from "@/lib/analytics";
import {
  absoluteUrl,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  jsonLdScript,
  pageHead,
} from "@/lib/seo";

export const Route = createFileRoute("/conteudos/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  component: ArticlePage,
  head: ({ params, loaderData }) => {
    const article = loaderData?.article as Article | undefined;
    if (!article) return {};
    const path = `/conteudos/${params.slug}`;
    const url = absoluteUrl(path);
    const head = pageHead({
      title: article.title,
      description: article.description,
      path,
      type: "article",
      keywords: [
        article.topic,
        "SICAF",
        "cadastro no SICAF",
        "licitações públicas",
        ...article.h1.toLowerCase().split(/\s+/).slice(0, 6),
      ],
    });

    const scripts = [
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.h1,
        description: article.description,
        inLanguage: "pt-BR",
        mainEntityOfPage: url,
        url,
        author: { "@type": "Organization", name: SITE.name, url: SITE.url },
        publisher: {
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          logo: { "@type": "ImageObject", url: absoluteUrl(SITE.logo) },
        },
        image: absoluteUrl(SITE.ogImage),
        about:
          article.topic === "SICAF"
            ? {
                "@type": "Thing",
                name: "SICAF",
                alternateName: "Cadastro no SICAF",
              }
            : undefined,
      }),
      jsonLdScript(faqSchema(article.faq)),
      jsonLdScript(
        breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Conteúdos", path: "/conteudos" },
          { name: article.h1, path },
        ]),
      ),
    ];

    if (article.slug === "cadastro-no-sicaf") {
      scripts.push(
        jsonLdScript(
          howToSchema({
            name: "Como fazer o cadastro no SICAF",
            description: article.description,
            steps: article.blocks
              .filter((b) => b.heading && (b.paragraphs?.length || b.list?.length))
              .slice(0, 6)
              .map((b) => ({
                name: b.heading,
                text: b.paragraphs?.[0] ?? b.list?.join("; ") ?? b.heading,
              })),
          }),
        ),
      );
    }

    return { ...head, scripts };
  },
});

function ArticlePage() {
  const { article } = Route.useLoaderData() as { article: Article };
  const { openTriage } = useTriage();
  const category = CATEGORIES.find((c) => c.id === article.ctaCategory);
  const related = article.related
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is (typeof ARTICLES)[number] => Boolean(a));

  return (
    <div className="container-page py-12">
      <Breadcrumbs items={[{ label: "Conteúdos", to: "/conteudos" }, { label: article.h1 }]} />

      <article className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <header>
            <p className="eyebrow">{article.topic}</p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{article.h1}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.intro}</p>
          </header>

          <nav aria-label="Neste artigo" className="mt-8 rounded-2xl border border-border p-5">
            <h2 className="text-sm font-bold tracking-wider uppercase">Neste artigo</h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {article.blocks.map((b, i) => (
                <li key={b.heading}>
                  <a href={`#secao-${i}`} className="text-primary hover:underline">
                    {b.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-9">
            {article.blocks.map((block, i) => (
              <section key={block.heading} id={`secao-${i}`}>
                <h2 className="text-xl font-bold sm:text-2xl">{block.heading}</h2>
                {block.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
                {block.list && (
                  <ul className="mt-4 space-y-2">
                    {block.list.map((item) => (
                      <li key={item} className="flex gap-3 text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-12" aria-labelledby="faq-artigo">
            <h2 id="faq-artigo" className="text-xl font-bold sm:text-2xl">
              Perguntas frequentes
            </h2>
            <Accordion type="single" collapsible className="mt-4">
              {article.faq.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {article.sources && (
            <section className="mt-10" aria-labelledby="fontes">
              <h2 id="fontes" className="text-sm font-bold tracking-wider uppercase">
                Fontes oficiais
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {article.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener nofollow"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      {s.label} <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="surface-navy mt-12 rounded-3xl p-8">
            <h2 className="text-xl font-bold sm:text-2xl">{article.ctaText}</h2>
            <p className="mt-2 max-w-xl text-sm text-navy-foreground/75">
              Faça a pré-triagem gratuita e receba a recomendação do próximo passo para a sua
              empresa. Se for necessário apoio operacional, encaminhamos para o atendimento
              especializado da {SITE.partnerName}.
            </p>
            <Button
              size="lg"
              className="mt-6 bg-success text-success-foreground hover:bg-success/90"
              onClick={() => openTriage(article.ctaCategory)}
            >
              Começar pré-triagem gratuita <ArrowRight className="size-4" aria-hidden />
            </Button>
          </section>
        </div>

        <aside className="space-y-8">
          {category && (
            <div className="rounded-2xl border border-border p-5">
              <h2 className="text-sm font-bold tracking-wider uppercase">Caminho indicado</h2>
              <p className="mt-3 text-sm font-semibold">{category.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {category.steps.map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-border p-5">
            <h2 className="text-sm font-bold tracking-wider uppercase">Leia também</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to="/conteudos/$slug"
                    params={{ slug: r.slug }}
                    onClick={() => trackEvent("artigo_click", { slug: r.slug, origem: "related" })}
                    className="font-medium hover:text-primary"
                  >
                    {r.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/conteudos" className="font-semibold text-primary hover:underline">
                  Ver todos os conteúdos
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </article>
    </div>
  );
}

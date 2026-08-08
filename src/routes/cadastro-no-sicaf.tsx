import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  ListChecks,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LEGAL_DISCLAIMER, SITE } from "@/lib/site";
import { ARTICLES } from "@/lib/articles";
import { useTriage } from "@/components/site/triage-context";
import { trackEvent } from "@/lib/analytics";
import {
  absoluteUrl,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  jsonLdScript,
  pageHead,
  serviceSchema,
} from "@/lib/seo";

const PAGE_PATH = "/cadastro-no-sicaf";

const FAQ_SICAF = [
  {
    q: "O que é o cadastro no SICAF?",
    a: "É o cadastramento da empresa no Sistema de Cadastramento Unificado de Fornecedores, usado pelo governo federal e por muitos órgãos no Compras.gov.br para habilitar fornecedores em licitações.",
  },
  {
    q: "Como fazer o cadastro no SICAF?",
    a: "Organize documentos e certidões, acesse o ambiente oficial com gov.br (selo prata ou superior) ou certificado digital, credencie o CNPJ e complete os níveis de habilitação jurídica, fiscal, trabalhista e demais exigências do seu caso.",
  },
  {
    q: "Quais documentos são necessários para o cadastro no SICAF?",
    a: "Em geral: atos constitutivos, documentos dos sócios, CNPJ, certidões federais, estaduais e municipais, FGTS, certidão trabalhista e, conforme o caso, demonstrações contábeis e atestados técnicos.",
  },
  {
    q: "MEI pode fazer cadastro no SICAF?",
    a: "Sim. MEI e microempresas podem se cadastrar e participar de contratações compatíveis com a atividade e com o limite de faturamento, observando o tratamento diferenciado da LC 123/2006.",
  },
  {
    q: "O SICAF é obrigatório para todas as licitações?",
    a: "É padrão nas contratações federais e em processos no Compras.gov.br. Estados e municípios podem exigir SICAF ou cadastros próprios — a regra está sempre no edital.",
  },
  {
    q: "Este portal é o site oficial do SICAF?",
    a: "Não. Este é um portal privado e independente de orientação. O cadastro oficial é feito nos canais do governo. A CADBRASIL oferece assessoria privada e opcional.",
  },
];

const STEPS = [
  {
    name: "Diagnóstico da empresa",
    text: "Confirme CNPJ ativo, CNAE compatível, contrato social atualizado e situação das certidões antes de iniciar o cadastro no SICAF.",
  },
  {
    name: "Organização documental",
    text: "Reúna habilitação jurídica, regularidade fiscal e trabalhista, dados econômico-financeiros e documentos dos representantes.",
  },
  {
    name: "Credenciamento no sistema oficial",
    text: "Acesse o SICAF pelo Portal de Compras com gov.br ou certificado digital e credencie a empresa pelo CNPJ.",
  },
  {
    name: "Preenchimento dos níveis",
    text: "Complete habilitação jurídica, regularidade fiscal/trabalhista e demais níveis exigidos para o tipo de contratação desejado.",
  },
  {
    name: "Validação e manutenção",
    text: "Confira se não há pendências e estabeleça rotina de atualização de certidões para manter o cadastro no SICAF regular.",
  },
];

const RELATED = ["cadastro-no-sicaf", "o-que-e-sicaf", "documentos-exigidos-no-sicaf", "como-renovar-o-sicaf"]
  .map((slug) => ARTICLES.find((a) => a.slug === slug))
  .filter(Boolean);

export const Route = createFileRoute("/cadastro-no-sicaf")({
  component: CadastroSicafPage,
  head: () => {
    const title = "Cadastro no SICAF — Como Cadastrar sua Empresa Passo a Passo";
    const description =
      "Cadastro no SICAF: guia completo para cadastrar sua empresa, organizar documentos, habilitar níveis e participar de licitações no Compras.gov.br. Pré-triagem gratuita.";
    const head = pageHead({
      title,
      description,
      path: PAGE_PATH,
      keywords: [
        "cadastro no SICAF",
        "SICAF",
        "cadastrar no SICAF",
        "como fazer cadastro no SICAF",
        "SICAF Digital",
        "documentos para cadastro no SICAF",
        "fornecedor governo",
        "Compras.gov.br",
      ],
    });

    return {
      ...head,
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Cadastro no SICAF", path: PAGE_PATH },
          ]),
        ),
        jsonLdScript(faqSchema(FAQ_SICAF)),
        jsonLdScript(
          howToSchema({
            name: "Como fazer o cadastro no SICAF",
            description:
              "Passo a passo para preparar documentos e cadastrar a empresa no SICAF para participar de licitações públicas.",
            steps: STEPS,
          }),
        ),
        jsonLdScript(
          serviceSchema({
            name: "Orientação para cadastro no SICAF",
            description:
              "Pré-triagem e orientação independente para empresas que precisam fazer ou regularizar o cadastro no SICAF.",
            path: PAGE_PATH,
          }),
        ),
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": absoluteUrl(PAGE_PATH),
          url: absoluteUrl(PAGE_PATH),
          name: title,
          description,
          inLanguage: "pt-BR",
          isPartOf: { "@id": `${SITE.url}/#website` },
          about: {
            "@type": "Thing",
            name: "SICAF",
            alternateName: [
              "Sistema de Cadastramento Unificado de Fornecedores",
              "Cadastro no SICAF",
              "SICAF Digital",
            ],
            description:
              "Sistema oficial de cadastramento e habilitação de fornecedores da Administração Pública Federal.",
          },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", ".lead", "#passo-a-passo"],
          },
        }),
      ],
    };
  },
});

function CadastroSicafPage() {
  const { openTriage } = useTriage();

  return (
    <div>
      <section className="surface-hero border-b border-border">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumbs items={[{ label: "Cadastro no SICAF" }]} />
          <div className="mt-6 max-w-3xl">
            <p className="eyebrow">SICAF · Compras.gov.br</p>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Cadastro no <span className="text-primary">SICAF</span>
            </h1>
            <p className="lead mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Guia prático para cadastrar sua empresa no SICAF, organizar documentos e habilitar sua
              participação em licitações públicas federais.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-14 px-7 text-base"
                onClick={() => {
                  trackEvent("card_click", { origem: "cadastro_sicaf_hero" });
                  openTriage("cadastro-sicaf");
                }}
              >
                Começar pré-triagem do SICAF
                <ArrowRight className="size-5" aria-hidden />
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-7 text-base">
                <Link to="/conteudos/$slug" params={{ slug: "cadastro-no-sicaf" }}>
                  Ler o guia completo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-extrabold">O que é o SICAF e por que cadastrar?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              O <strong className="text-foreground">SICAF</strong> (Sistema de Cadastramento
              Unificado de Fornecedores) é o cadastro usado pelo governo federal para registrar e
              habilitar empresas que querem vender produtos ou serviços a órgãos públicos. O{" "}
              <strong className="text-foreground">cadastro no SICAF</strong> é, na prática, a porta
              de entrada para disputar pregões e outras modalidades no Compras.gov.br.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Empresas com cadastro incompleto ou certidões vencidas são inabilitadas com
              frequência — mesmo com preço competitivo. Por isso o cadastro no SICAF precisa estar
              completo, atualizado e alinhado ao CNPJ e ao contrato social.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              {
                icon: ClipboardCheck,
                title: "Habilitação automática",
                text: "O órgão consulta a regularidade da empresa no sistema.",
              },
              {
                icon: ShieldCheck,
                title: "Menos risco de inabilitação",
                text: "Documentação organizada reduz surpresas na disputa.",
              },
              {
                icon: FileCheck2,
                title: "Base para licitar",
                text: "Sem SICAF regular, a maioria das compras federais fica inacessível.",
              },
              {
                icon: RefreshCw,
                title: "Manutenção contínua",
                text: "Certidões vencem — o cadastro precisa ser acompanhado.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3 rounded-2xl border border-border p-4">
                <item.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="passo-a-passo" className="scroll-mt-24 border-y border-border bg-secondary/40">
        <div className="container-page py-14 sm:py-20">
          <header className="max-w-2xl">
            <p className="eyebrow">Passo a passo</p>
            <h2 className="mt-4 text-3xl font-extrabold">Como fazer o cadastro no SICAF</h2>
            <p className="mt-3 text-muted-foreground">
              Siga esta sequência para reduzir retrabalho e pendências no sistema oficial.
            </p>
          </header>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {STEPS.map((step, i) => (
              <li key={step.name} className="rounded-2xl border border-border bg-background p-5">
                <span className="font-display text-sm font-bold text-primary">
                  Etapa {i + 1}
                </span>
                <h3 className="mt-2 text-base font-bold">{step.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
          <Button
            size="lg"
            className="mt-10 h-14 px-7"
            onClick={() => openTriage("cadastro-sicaf")}
          >
            <ListChecks className="size-5" aria-hidden />
            Quero um roteiro para o meu caso
          </Button>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <h2 className="text-3xl font-extrabold">Documentos para o cadastro no SICAF</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A lista exata varia por porte e objeto, mas estes grupos aparecem na maioria dos cadastros.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Habilitação jurídica",
              items: ["Contrato social / estatuto", "Documentos dos sócios", "CNPJ", "Procuração"],
            },
            {
              title: "Regularidade fiscal",
              items: ["Certidão federal", "Estadual e/ou municipal", "FGTS", "CNDT"],
            },
            {
              title: "Econômico e técnico",
              items: ["Demonstrações contábeis", "Certidão de falência", "Atestados técnicos"],
            },
          ].map((group) => (
            <li key={group.title} className="rounded-2xl border border-border p-5">
              <BadgeCheck className="size-5 text-success" aria-hidden />
              <h3 className="mt-3 font-bold">{group.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link
            to="/conteudos/$slug"
            params={{ slug: "documentos-exigidos-no-sicaf" }}
            className="font-semibold text-primary hover:underline"
          >
            Ver checklist completo de documentos do SICAF
          </Link>
        </p>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container-page py-14 sm:py-20">
          <h2 className="text-3xl font-extrabold">Perguntas frequentes sobre cadastro no SICAF</h2>
          <Accordion type="single" collapsible className="mt-8 max-w-3xl">
            {FAQ_SICAF.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container-page py-14 sm:py-20">
        <h2 className="text-3xl font-extrabold">Conteúdos relacionados ao SICAF</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {RELATED.map(
            (article) =>
              article && (
                <li key={article.slug}>
                  <Link
                    to="/conteudos/$slug"
                    params={{ slug: article.slug }}
                    onClick={() => trackEvent("artigo_click", { slug: article.slug })}
                    className="card-interactive block p-5"
                  >
                    <p className="text-xs font-bold tracking-wider text-primary uppercase">
                      {article.topic}
                    </p>
                    <h3 className="mt-2 font-bold">{article.h1}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{article.description}</p>
                  </Link>
                </li>
              ),
          )}
        </ul>
      </section>

      <section className="surface-navy">
        <div className="container-page py-14 text-center sm:py-16">
          <h2 className="text-3xl font-extrabold">Precisa de ajuda com o cadastro no SICAF?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-foreground/80">
            Faça a pré-triagem gratuita e descubra se sua empresa precisa de cadastro novo,
            renovação, documentação ou suporte para pendências.
          </p>
          <Button
            size="lg"
            className="mt-8 h-14 bg-success px-7 text-base text-success-foreground hover:bg-success/90"
            onClick={() => openTriage("cadastro-sicaf")}
          >
            Fazer pré-triagem gratuita
            <ArrowRight className="size-5" aria-hidden />
          </Button>
          <p className="mx-auto mt-8 max-w-3xl text-xs leading-relaxed text-navy-foreground/60">
            {LEGAL_DISCLAIMER}
          </p>
        </div>
      </section>
    </div>
  );
}

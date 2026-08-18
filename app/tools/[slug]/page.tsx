import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InnerHeader, SiteFooter } from "../../components/GlobalChrome";
import { ErpReadiness, CustomizationLadder } from "../../components/ToolExperiences";
import { toolsDirectory } from "../../content";

const liveTools = toolsDirectory.filter((tool) => tool.status === "Dùng ngay");

export function generateStaticParams() {
  return liveTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = liveTools.find((item) => item.slug === slug);
  return tool ? { title: tool.title, description: tool.description } : {};
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!liveTools.some((tool) => tool.slug === slug)) notFound();
  return (
    <main className="inner-shell tool-experience-shell" id="top">
      <InnerHeader />
      {slug === "erp-readiness" ? <ErpReadiness /> : <CustomizationLadder />}
      <SiteFooter />
    </main>
  );
}

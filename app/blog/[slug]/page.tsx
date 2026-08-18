import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InnerHeader, SiteFooter } from "../../components/GlobalChrome";
import { posts } from "../../content";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <main className={`inner-shell article-shell accent-${post.accent}`} id="top">
      <InnerHeader />
      <article>
        <header className="article-hero">
          <Link className="back-link" href="/blog">← TRỞ LẠI NHẬT KÝ</Link>
          <div className="article-meta"><span>{post.category}</span><span>{post.date}</span><span>{post.readTime} đọc</span></div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-visual" aria-hidden="true"><span>{post.number}</span><i /><i /><i /></div>
        </header>

        <div className="article-layout">
          <aside>
            <span>IN THIS NOTE</span>
            {post.sections.map((section, index) => <a href={`#section-${index}`} key={index}>{String(index + 1).padStart(2, "0")} {section.heading || "Mở đầu"}</a>)}
          </aside>
          <div className="article-body">
            {post.sections.map((section, index) => (
              <section id={`section-${index}`} key={index}>
                {section.heading && <h2>{section.heading}</h2>}
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.quote && <blockquote>{section.quote}</blockquote>}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}
            <div className="article-signoff"><span>— HUY CHIẾN</span><p>Viết từ những việc tôi đang làm và những điều tôi vẫn đang học.</p></div>
          </div>
        </div>
      </article>

      <section className="related-posts">
        <p className="section-code dark-code">ĐỌC TIẾP</p>
        <div>{related.map((item) => <Link href={`/blog/${item.slug}`} key={item.slug}><span>{item.category}</span><h2>{item.title}</h2><b>↗</b></Link>)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}

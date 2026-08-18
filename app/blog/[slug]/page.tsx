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
      <article className="magazine-issue">
        <header className="magazine-cover">
          <div className="magazine-masthead">
            <Link href="/blog">← NHẬT KÝ</Link>
            <span>1NGUOI.COM / FIELD NOTES</span>
            <span>ISSUE {post.number}</span>
          </div>

          <div className="magazine-cover-grid">
            <div className="magazine-spine" aria-hidden="true">
              <span>INDEPENDENT OPERATIONS MAGAZINE</span>
              <b>{post.number}</b>
            </div>

            <div className="magazine-cover-copy">
              <div className="article-meta"><span>{post.category}</span><span>{post.date}</span><span>{post.readTime} đọc</span></div>
              <h1>{post.title}</h1>
              <p>{post.excerpt}</p>
              <div className="magazine-byline"><span>WORDS / NGUYỄN HUY CHIẾN</span><i /></div>
            </div>

            <figure className="magazine-cover-art">
              <div className="magazine-grid-mark" aria-hidden="true" />
              <div className="magazine-art-top"><span>HỆ THỐNG / CON NGƯỜI</span><b>VOL.01</b></div>
              <img src={post.coverImage} alt="" width="1024" height="1536" />
              <figcaption>{post.coverCaption}</figcaption>
              <div className="magazine-metric"><strong>{post.metric}</strong><span>{post.metricLabel}</span></div>
              <div className="magazine-crosshair" aria-hidden="true"><i /><i /></div>
            </figure>
          </div>

          <div className="magazine-cover-footer">
            <span>ERP • OPERATIONS • AUTOMATION • AI</span>
            <span>SCROLL TO READ ↓</span>
          </div>
        </header>

        <div className="magazine-reading-layout">
          <aside className="magazine-toc">
            <span>MỤC LỤC</span>
            {post.sections.map((section, index) => (
              <a href={`#section-${index}`} key={index}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <span>{section.heading || "Mở đầu"}</span>
              </a>
            ))}
            <div><span>ISSUE</span><strong>{post.number}</strong></div>
          </aside>

          <div className="magazine-body">
            {post.sections.map((section, index) => (
              <section className={`magazine-section ${index === 0 ? "magazine-lede-section" : ""}`} id={`section-${index}`} key={index}>
                <header className="magazine-section-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{index === 0 ? "OPENING NOTE" : `CHAPTER ${String(index + 1).padStart(2, "0")}`}</small>{section.heading && <h2>{section.heading}</h2>}</div>
                </header>
                {section.paragraphs && (
                  <div className="magazine-paragraphs">
                    {section.paragraphs.map((paragraph, paragraphIndex) => <p className={index === 0 && paragraphIndex === 0 ? "has-dropcap" : ""} key={paragraph}>{paragraph}</p>)}
                  </div>
                )}
                {section.quote && <blockquote><span>“</span><p>{section.quote}</p><i>— FIELD NOTE {post.number}</i></blockquote>}
                {section.bullets && (
                  <ol className="magazine-list">
                    {section.bullets.map((bullet, bulletIndex) => <li key={bullet}><span>{String(bulletIndex + 1).padStart(2, "0")}</span><p>{bullet}</p><b>↗</b></li>)}
                  </ol>
                )}
              </section>
            ))}
            <div className="article-signoff"><span>— HUY CHIẾN</span><p>Viết từ những việc tôi đang làm và những điều tôi vẫn đang học.</p><b>{post.number}</b></div>
          </div>
        </div>
      </article>

      <section className="related-posts">
        <p className="section-code dark-code">ISSUE TIẾP THEO</p>
        <div>{related.map((item) => <Link className={`accent-${item.accent}`} href={`/blog/${item.slug}`} key={item.slug}><span>{item.number} / {item.category}</span><h2>{item.title}</h2><b>↗</b></Link>)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}

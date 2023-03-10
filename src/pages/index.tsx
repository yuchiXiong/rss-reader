import { useEffect, useState } from 'react';
import Head from 'next/head';
import { extract } from '@extractus/feed-extractor';
import { GithubOne } from '@icon-park/react';
import { getRelativeTimeString } from '@/utils';
import Link from 'next/link';

const LINKS = [
  'https://xiongyuchi.top/atom.xml',
  'https://coderemixer.com/atom.xml',
];

export interface IRss {
  author: {
    name: string;
  },
  title: string,
  link: string,
  entry: IEntry[],
  updated: string,
  icon: string,
  id: string,
}

export interface IEntry {
  category: {
    '@_term': string,
    '@_scheme': string,
  }[],
  content: string,
  id: string,
  link: string,
  published: string,
  summary: string,
  title: string,
  updated: string,
}

export async function getServerSideProps() {

  return {
    props: {
      rss: [await extract(LINKS[0], { descriptionMaxLen: Infinity, normalization: false })]
    }
  };
}

export default function Home({ rss = [] }: { rss: IRss[] }) {
  const [current, setCurrent] = useState<string>(rss[0]?.link || '');
  const [expanded, setExpanded] = useState<string>('');
  const [rssList, setRssList] = useState<IRss[]>(rss);

  useEffect(() => {
    Promise.all(LINKS.map(async (link) => extract(link, { descriptionMaxLen: Infinity, normalization: false }))).then((rss) => {
      setRssList(rss as IRss[]);
    });
  }, []);

  const handleArticleClick = (link: string) => {
    if (expanded === link) {
      setExpanded('');
    } else {
      setExpanded(link);
    }
  }

  return (
    <section className='flex flex-col h-screen overflow-hidden'>
      <Head>
        <title>RSS Reader | 不太专业的 RSS 阅读器</title>
        <meta name="description" content="rss reader" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='w-full h-12 border-gray-200 border-b box-border bg-white flex items-center py-4 px-8'>
        <GithubOne theme="outline" size="24" fill="#000000" className='ml-auto cursor-pointer' onClick={() => window.open('https://github.com/yuchiXiong', '_black')} />
      </header>
      <main className='bg-gray-200 flex flex-1 h-full'>
        <aside className='w-2/12 sticky'>
          <div className='flex flex-col items-center h-full max-h-full bg-white'>
            {rssList.map((rss) => (
              <div
                key={rss.link}
                className={[
                  'flex cursor-pointer border-b border-gray-100  p-4 h-12 w-full justify-between items-center',
                  current === rss.link ? 'bg-gray-100' : ''
                ].join(' ')}
                onClick={() => setCurrent(rss!.link as string)}
              >
                <span className='font-semibold text-sm'>{rss.title}</span>
                <span className='font-semibold text-gray-500 text-xs'>{rss.entry?.length || 0}</span>
              </div>
            ))}
            <div
              className='text-center mt-auto text-sm cursor-pointer border-t border-gray-100  p-4 h-12 w-full justify-between items-center'
            >
              添加更多 RSS 订阅
            </div>
          </div>
        </aside>
        <section className='p-4 w-10/12 flex h-full flex-col items-center justify-center '>
          <div className='bg-white h-full w-full overflow-scroll'>
            {rssList.find((rss) => rss.link === current)?.entry?.map((post) => (
              <section
                key={post.id}
                className='border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-100 transition-all'
                onClick={() => handleArticleClick(post.link)}
              >
                <div className='flex items-center'>
                  <div className='flex flex-col w-full'>
                    <span className='font-semibold text-sm'>{post.title}</span>
                    <small className='mt-1 flex w-full'>
                      <span>
                        from&nbsp;
                        <Link
                          href={post.link as string}
                          target="_blank"
                          className='border-b border-gray-400'
                        >
                          {rssList.find(rss => rss.link === current)?.title}: {post.title}
                        </Link>
                      </span>
                      {post.published && (
                        <span
                          className='ml-auto text-gray-500 text-xs'
                          title={new Date(post.published).toLocaleString()}
                          suppressHydrationWarning
                        >
                          {new Date(post.published).toLocaleDateString()} ({getRelativeTimeString(new Date(post.published))})
                        </span>
                      )}
                    </small>
                  </div>
                </div>

                <div className='mt-1 text-gray-400 text-sm'>
                  <div dangerouslySetInnerHTML={{ __html: post.link === expanded ? post.content : post.summary }} />
                </div>

              </section>
            ))}
          </div>
        </section>
      </main >
    </section >
  )
}

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

export default function Home() {
  const [current, setCurrent] = useState<string>('');
  const [expanded, setExpanded] = useState<string>('');
  const [rssList, setRssList] = useState<IRss[]>([]);

  useEffect(() => {
    Promise.all(LINKS.map(async (link) => extract(link, { descriptionMaxLen: Infinity, normalization: false }))).then((rss) => {
      setRssList(rss as IRss[]);
      setCurrent(rss[0]?.link || '');
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
    <section className='flex flex-col h-screen'>
      <Head>
        <title>RSS Reader | 一无是处的 RSS 阅读器</title>
        <meta name="description" content="RSS Reader | 一无是处的 RSS 阅读器" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className='box-border flex items-center w-full h-12 px-8 py-4 bg-white border-b border-gray-200'>
        <GithubOne theme="outline" size="24" fill="#000000" className='ml-auto cursor-pointer' onClick={() => window.open('https://github.com/yuchiXiong', '_black')} />
      </header>
      <main className='flex flex-1 h-0 bg-gray-200'>
        <aside className='w-2/12'>
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
                <span className='text-sm font-semibold'>{rss.title}</span>
                <span className='text-xs font-semibold text-gray-500'>{rss.entry?.length || 0}</span>
              </div>
            ))}
            <div
              className='items-center justify-between w-full h-12 p-4 mt-auto text-sm text-center border-t border-gray-100 cursor-pointer'
            >
              添加更多 RSS 订阅
            </div>
          </div>
        </aside>
        <section className='flex flex-col w-10/12 h-full p-4'>
          <div className='box-border flex-1 h-full overflow-y-scroll bg-white'>
            {rssList.find((rss) => rss.link === current)?.entry?.slice(0, 1000).map((post) => (
              <section
                key={post.id}
                className='p-4 transition-all border-b border-gray-100 cursor-pointer hover:bg-gray-100'
                onClick={() => handleArticleClick(post.link)}
              >
                <div className='flex items-center'>
                  <div className='flex flex-col w-full'>
                    <span className='text-sm font-semibold'>{post.title}</span>
                    <small className='flex w-full mt-1'>
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
                          className='ml-auto text-xs text-gray-500'
                          title={new Date(post.published).toLocaleString()}
                          suppressHydrationWarning
                        >
                          {new Date(post.published).toLocaleDateString()} ({getRelativeTimeString(new Date(post.published))})
                        </span>
                      )}
                    </small>
                  </div>
                </div>
                <div className='mt-1 text-sm text-gray-400'>
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

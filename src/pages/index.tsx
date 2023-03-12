import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { GithubOne, Link as LinkIcon, Rss } from '@icon-park/react';
import { getRelativeTimeString } from '@/utils';
import Link from 'next/link';
import AddRSSLinkModal from '@/components/add-rss-link-modal';
import { FeedData } from './api/pull';

export const USELESS_RSS_LINKS = 'USELESS_RSS_LINKS';

export default function Home() {
  const [currentAuthor, setCurrentAuthor] = useState<string>('');
  const [currentPost, setCurrentPost] = useState<string>('');
  const [rssList, setRssList] = useState<FeedData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchDate();
  }, []);

  const fetchDate = () => {
    const linksQuery = (JSON.parse(localStorage.getItem(USELESS_RSS_LINKS) || '[]') as string[]).map(link => `links=${link}`).join('&');

    fetch(`/api/pull?${linksQuery}`).then(result => result.json()).then((rss: FeedData[]) => {
      setRssList(rss);
      setCurrentAuthor(rss[0]?.link || '');
      setCurrentPost(rss[0]?.items[0]?.link || '')
    });
  }

  const handleRssToggle = (rss: FeedData) => {
    setCurrentAuthor(rss!.link as string);
    setCurrentPost(rss.items[0].link);
    document.querySelector('#posts > div')?.scrollTo(0, 0);
    document.querySelector('#article > div')?.scrollTo(0, 0);
  }

  return (
    <section className='flex flex-col h-screen'>
      <AddRSSLinkModal
        visible={visible}
        handleClose={() => setVisible(false)}
        afterSubmit={fetchDate}
      />

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
        {/* 订阅列表 */}
        <aside className='w-2/12 border-gray-100'>
          <div className='flex flex-col items-center h-full max-h-full overflow-y-auto bg-white'>
            {rssList.map((rss) => (
              <div
                key={rss.link}
                className={[
                  'flex cursor-pointer border-b border-gray-100  p-4 h-12 w-full justify-between items-center',
                  currentAuthor === rss.link ? 'bg-gray-100' : ''
                ].join(' ')}
                onClick={() => handleRssToggle(rss)}
              >
                <span className='text-sm font-semibold'>{rss.title}</span>
                <span className='text-xs font-semibold text-gray-500'>{rss.items?.length || 0}</span>
              </div>
            ))}
            <div
              className='items-center justify-between w-full h-12 p-4 mt-auto text-sm text-center text-white border-t border-gray-100 cursor-pointer'
              style={{ backgroundColor: '#2bbc8a' }}
              onClick={() => setVisible(true)}
            >
              添加更多 RSS 订阅
            </div>
          </div>
        </aside>

        {/* 订阅的作者文章列表 */}
        <aside id="posts" className='w-2/12 border-l border-gray-200'>
          <div className='flex flex-col items-center h-full max-h-full overflow-y-auto bg-white'>
            {rssList.find(rss => rss.link === currentAuthor)?.items?.map((post) => (
              <div
                key={post.link}
                className={[
                  'flex flex-col cursor-pointer border-b border-gray-100  p-2 w-full',
                  currentPost === post.link ? 'bg-gray-100' : ''
                ].join(' ')}
                onClick={() => {
                  setCurrentPost(post!.link as string);
                  document.querySelector('#article > div')?.scrollTo(0, 0);
                }}
              >
                <span className='text-sm line-clamp-1'>{post.title}</span>
                <small className='flex items-center mt-1 text-xs'>
                  <span className='font-normal text-gray-400'>from {rssList.find(rss => rss.link === currentAuthor)?.title}</span>
                  {post.isoDate && <span className='ml-2'>{getRelativeTimeString(new Date(post.isoDate))}</span>}
                </small>
              </div>
            ))}
          </div>
        </aside>

        {/* 文章内容 */}
        <section id="article" className='flex flex-col w-8/12 h-full p-4'>
          <div className='box-border flex-1 h-full overflow-y-scroll bg-white'>
            {rssList.length === 0 && (
              <div className='flex flex-col items-center justify-center flex-1 h-full'>
                <div className='flex flex-col items-center justify-center w-1/2 h-1/2'>

                  <h1 className='flex items-center text-2xl font-semibold text-center'>
                    <Rss theme="outline" size="21" className='mr-1' fill="#000000" />
                    一无是处的 RSS 阅读器
                  </h1>
                  <p className='mt-2 text-center'>点击左侧下方的添加按钮，添加你喜欢的 RSS 订阅</p>
                </div>
              </div>
            )}
            {rssList.find((rss) => rss.link === currentAuthor)?.items?.filter(post => post.link === currentPost).map((post) => (
              <article
                key={post.id}
                className='p-4 '
              >
                <div className='flex items-center'>
                  <div className='flex flex-col w-full pb-2 -mb-4 border-b-2 border-black'>
                    <span className='text-base font-semibold'>
                      <Link
                        href={post.link as string}
                        target="_blank"
                        className='flex items-center border-gray-400 w-max'
                      >
                        {post.title}
                        <LinkIcon theme="outline" size="18" fill="#000000" className='ml-1' />
                      </Link></span>
                    <small className='flex w-full mt-1'>
                      <span>
                        from&nbsp;
                        {rssList.find(rss => rss.link === currentAuthor)?.title}
                      </span>
                      {post.isoDate && (
                        <span
                          className='ml-auto text-xs text-gray-500'
                          title={new Date(post.isoDate).toLocaleString()}
                          suppressHydrationWarning
                        >
                          {new Date(post.isoDate).toLocaleDateString()} ({getRelativeTimeString(new Date(post.isoDate))})
                        </span>
                      )}
                    </small>
                  </div>
                </div>
                <div className='mt-2 text-sm text-gray-400 content'>
                  <div dangerouslySetInnerHTML={{ __html: post.content || '没有拉取到内容，您可以点击标题查看原文' }} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main >
    </section >
  )
}

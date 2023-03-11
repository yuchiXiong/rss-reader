import React, { FormEvent, useRef } from 'react';
import { CloseSmall } from '@icon-park/react';
import { USELESS_RSS_LINKS } from '@/pages';

export default function AddRSSLinkModal({
  visible,
  handleClose,
  afterSubmit
}: {
  visible: boolean,
  handleClose: () => void,
  afterSubmit?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const link: string = inputRef.current?.value.trim() || '';
    if (!link) return;

    fetch(`/api/pull?links=${link}`).then(result => result.json()).then((rss) => {
      handleClose();
      const links = JSON.parse(localStorage.getItem(USELESS_RSS_LINKS) || '[]') as string[];
      links.push(link);
      localStorage.setItem(USELESS_RSS_LINKS, JSON.stringify(links));
      afterSubmit?.();
    });
  }

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center overflow-auto bg-black bg-opacity-50 ${visible ? '' : 'hidden'}`}
      onClick={handleClose}
    >
      <div className='relative w-1/3 p-4 bg-white rounded-md h-max' onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className='flex items-center p-4 mb-2 -m-4 border-b border-gray-100'>
            <h1 className='text-lg font-medium'>添加新的 RSS 订阅</h1>
            <CloseSmall className='ml-auto cursor-pointer' onClick={handleClose} theme="outline" size="24" fill="#000000" />
          </div>
          {visible && (
            <input
              ref={inputRef}
              type="url"
              name="link"
              className='w-full p-2 border border-gray-200 rounded-lg outline-none '
              placeholder='输入有效的 RSS 链接'
              required
            />
          )}
          <p className='mt-2 text-xs text-gray-400'>* RSS Reader 并不保证您添加的每一个订阅都可读，如果文章不完整您可以点击标题查看原文或提交 Issue <del>虽然我可能不知道咋修复</del>。</p>
          <button
            className='px-4 py-1 mt-4 text-white bg-blue-500 rounded '
            type="submit"
            style={{ backgroundColor: '#2bbc8a' }}
          >添加</button>
        </form>
      </div>
    </div>

  )
}

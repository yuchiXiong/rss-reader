// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from '@/utils/redis';
import Parser from 'rss-parser';

const parser = new Parser();

export interface FeedData {
  items: {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
    summary: string;
    id: string;
    isoDate: string;
  }[],
  link: string,
  title: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeedData[]>
) {

  let { links } = req.query as { links: string[] };

  if (!Array.isArray(links)) links = [links];

  const data = await Promise.all(links.map(async (link) => {
    const key = `useless-RSS:${link}`;
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const json = await parser.parseURL(link);

    redis.set(key, JSON.stringify(json));

    return json;
  }));

  res.status(200).json(data);
}

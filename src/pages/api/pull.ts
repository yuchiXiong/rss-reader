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

  if (!links) return res.status(200).json([]);

  if (!Array.isArray(links)) links = [links];

  const data = await Promise.all(links.map(async (link) => {
    const key = `useless-RSS:${link}`;
    const cached = await redis.get(key);
    let json: FeedData;

    if (cached) {
      json = JSON.parse(cached);

      parser.parseURL(link).then((result) => {
        if (JSON.stringify(result) !== JSON.stringify(json)) {
          console.log('Updating cache for', link)
          redis.set(key, JSON.stringify(result));
        }
      }, err => { });
    } else {
      json = await parser.parseURL(link) as FeedData;
      redis.set(key, JSON.stringify(json));
    }

    return json;
  }));

  res.status(200).json(data);
}

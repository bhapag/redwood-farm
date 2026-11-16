import { abs } from '../data/urls.js';

const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'Applebot-Extended', 'Bingbot'];

export function GET() {
  const groups = bots.map((b) => ['User-agent: ' + b, 'Allow: /'].join('\n')).join('\n\n');
  const body = [
    '# Red Wood Farm. All crawlers welcome, including AI answer engines.',
    'User-agent: *',
    'Allow: /',
    '',
    groups,
    '',
    'Sitemap: ' + abs('/sitemap.xml'),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

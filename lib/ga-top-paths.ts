import { gaClient } from './ga-client';

export async function getTopPaths(limit = 100): Promise<string[]> {
  try {
    const [res] = await gaClient.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit,
    });

    return (
      (res.rows
        ?.map(r => r.dimensionValues?.[0].value)
        .filter((v): v is string => typeof v === 'string') as string[]) ?? []
    );
  } catch (error) {
    console.error('GA RunReport Error:', error);
    throw error;
  }
}

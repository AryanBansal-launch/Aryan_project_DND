import { NextResponse } from 'next/server';

// Multiple external APIs to call in parallel
const EXTERNAL_APIS = [
  // JSONPlaceholder APIs
  {
    name: 'JSONPlaceholder Post',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  },
  {
    name: 'JSONPlaceholder User',
    url: 'https://jsonplaceholder.typicode.com/users/1',
  },
  // Joke APIs
  {
    name: 'Official Joke API',
    url: 'https://official-joke-api.appspot.com/random_joke',
  },
  {
    name: 'Chuck Norris Joke',
    url: 'https://api.chucknorris.io/jokes/random',
  },
  {
    name: 'Dad Joke',
    url: 'https://icanhazdadjoke.com/',
  },
  // Quote APIs
  {
    name: 'Random Quote',
    url: 'https://api.quotable.io/random',
  },
  {
    name: 'Kanye Quote',
    url: 'https://api.kanye.rest/',
  },
  // Fun APIs
  {
    name: 'Random Dog Image',
    url: 'https://dog.ceo/api/breeds/image/random',
  },
  {
    name: 'Random Cat Fact',
    url: 'https://catfact.ninja/fact',
  },
  {
    name: 'Bored API',
    url: 'https://www.boredapi.com/api/activity',
  },
  // Data APIs
  {
    name: 'Random User',
    url: 'https://randomuser.me/api/',
  },
  {
    name: 'IP Info',
    url: 'https://ipapi.co/json/',
  },
  // Advice & Facts
  {
    name: 'Random Advice',
    url: 'https://api.adviceslip.com/advice',
  },
  {
    name: 'Number Fact',
    url: 'http://numbersapi.com/random/trivia',
  },
  {
    name: 'Useless Fact',
    url: 'https://uselessfacts.jsph.pl/random.json?language=en',
  },
];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function to fetch from a single API
async function fetchFromAPI(name: string, url: string) {
  const startTime = Date.now();
  
  try {
    const res = await fetch(url, {
      headers: { 
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; RandomAPIBot/1.0)',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    let data: unknown;
    const contentType = res.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else if (contentType.includes('text/plain') || contentType.includes('text/html')) {
      data = await res.text();
    } else {
      data = await res.text();
    }

    const duration = Date.now() - startTime;

    return {
      name,
      url,
      status: res.status,
      ok: res.ok,
      duration,
      data,
      error: null,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      name,
      url,
      status: 0,
      ok: false,
      duration,
      data: null,
      error: message,
    };
  }
}

export async function GET() {
  const overallStartTime = Date.now();
  
  try {
    // Call all APIs in parallel (similar to homepage calling multiple CMS APIs)
    const results = await Promise.all(
      EXTERNAL_APIS.map(api => fetchFromAPI(api.name, api.url))
    );

    const overallDuration = Date.now() - overallStartTime;
    
    // Calculate statistics
    const successCount = results.filter(r => r.ok).length;
    const failCount = results.filter(r => !r.ok).length;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const maxDuration = Math.max(...results.map(r => r.duration));
    const minDuration = Math.min(...results.map(r => r.duration));

    return NextResponse.json({
      success: true,
      summary: {
        totalCalls: results.length,
        successful: successCount,
        failed: failCount,
        overallDuration,
        avgDuration: parseFloat(avgDuration.toFixed(2)),
        minDuration,
        maxDuration,
      },
      results,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
      },
    });
  } catch (error) {
    const overallDuration = Date.now() - overallStartTime;
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch from external APIs', 
        details: message,
        duration: overallDuration,
      },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
        },
      }
    );
  }
}

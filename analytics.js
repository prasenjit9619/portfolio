const CLIENT_ID = '357653556115-m4kf92vjfe3h2u7h7ju91ne3b1kov7gh.apps.googleusercontent.com'; // Get this from Google Cloud Console
const API_KEY = 'AIzaSyBpO6CbY1fC_SQi_26_5zli9rSelWuMf8E'; // Get this from Google Cloud Console
const PROPERTY_ID = '475883216'; // Your GA4 property ID

function initializeAnalytics() {
  gapi.load('client:auth2', async () => {
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    });

    await gapi.client.load('analyticsdata', 'v1beta');
    fetchVisitorCount();
  });
}

async function fetchVisitorCount() {
  try {
    const response = await gapi.client.analyticsdata.properties.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      metrics: [{ name: 'totalUsers' }]
    });

    const visitorCount = response.result.rows[0].metricValues[0].value;
    document.getElementById('visitor-count').textContent = visitorCount;
  } catch (err) {
    console.error('Error fetching visitor count:', err);
    document.getElementById('visitor-count').textContent = 'Error loading count';
  }
}

window.onload = initializeAnalytics;
(function() {
  if (!config || !config.clientId || !config.apiKey || !config.propertyId) {
    console.error('Analytics config missing');
    return;
  }

  const CLIENT_ID = config.clientId;
  const API_KEY = config.apiKey;
  const PROPERTY_ID = config.propertyId;
  const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

  async function fetchVisitorCount() {
    try {
      const response = await gapi.client.analyticsdata.properties.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{
          startDate: '2020-01-01',
          endDate: 'today'
        }],
        metrics: [{
          name: 'totalUsers'
        }]
      });

      if (response.result && response.result.rows) {
        const visitorCount = response.result.rows[0].metricValues[0].value;
        document.getElementById('visitor-count').textContent = visitorCount;
      }
    } catch (error) {
      console.error('Analytics Error:', error);
      document.getElementById('visitor-count').textContent = '---';
    }
  }

  async function initializeAnalytics() {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'],
        scope: SCOPES
      });

      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signIn();
      }

      await fetchVisitorCount();
    } catch (error) {
      console.error('Init Error:', error);
      document.getElementById('visitor-count').textContent = '---';
    }
  }

  if (document.readyState !== 'loading') {
    gapi.load('client:auth2', initializeAnalytics);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      gapi.load('client:auth2', initializeAnalytics);
    });
  }
})();
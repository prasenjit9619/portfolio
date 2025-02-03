(function() {
  const CLIENT_ID = config.clientId;
  const API_KEY = config.apiKey;
  const PROPERTY_ID = config.propertyId;
  const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

  async function initializeAnalytics() {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta']
      });

      // Check if we need to sign in
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signIn();
      }

      await fetchVisitorCount();
    } catch (error) {
      console.error('Init Error:', error);
      document.getElementById('visitor-count').textContent = '---';
    }
  }

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

      const visitorCount = response.result.rows[0].metricValues[0].value;
      document.getElementById('visitor-count').textContent = visitorCount;
    } catch (error) {
      console.error('Analytics Error:', error);
      document.getElementById('visitor-count').textContent = '---';
    }
  }

  gapi.load('client:auth2', initializeAnalytics);
})();
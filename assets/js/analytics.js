(function() {
  if (!config || !config.clientId || !config.apiKey || !config.propertyId) {
    console.error('Analytics config missing');
    return;
  }

  const CLIENT_ID = config.clientId;
  const API_KEY = config.apiKey;
  const PROPERTY_ID = config.propertyId;
  const SCOPES = 'https://www.googleapis.com/auth/analytics.readonly';

  async function initializeAnalytics() {
    try {
      // Initialize the JavaScript client library
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta'],
        scope: SCOPES
      });

      // Handle auth
      if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signIn();
      }

      await fetchVisitorCount();
    } catch (error) {
      console.error('Init Error:', error);
      document.getElementById('visitor-count').textContent = '---';
    }
  }

  function loadAnalytics() {
    gapi.load('client:auth2', initializeAnalytics);
  }

  // Wait for page load
  if (document.readyState !== 'loading') {
    loadAnalytics();
  } else {
    document.addEventListener('DOMContentLoaded', loadAnalytics);
  }
})();
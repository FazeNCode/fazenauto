'use client';
import { useState } from 'react';
import styles from './FacebookSetup.module.css';

export default function FacebookSetupPage() {
  const [shortToken, setShortToken] = useState('');
  const [pageId, setPageId] = useState('61577486330108'); // Your FazeNAuto page ID
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);

  const handleExchangeToken = async () => {
    if (!shortToken.trim()) {
      alert('Please enter the short-lived token from Graph API Explorer');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/facebook/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'exchange-token',
          shortLivedToken: shortToken.trim(),
          pageId: pageId || null
        }),
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetPages = async () => {
    if (!shortToken.trim()) {
      alert('Please enter the short-lived token first');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/facebook/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-pages',
          shortLivedToken: shortToken.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPages(data.pages);
      } else {
        alert(`Failed to get pages: ${data.error}`);
      }

    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🔧 Facebook API Setup</h1>
        <p>Get your long-lived Facebook access tokens for automatic posting</p>
      </div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <h3>📋 Step 1: Get Short-Lived Token</h3>
          <ol>
            <li>Go to <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer">Facebook Graph API Explorer</a></li>
            <li>Select your <strong>FazeNAuto MarketPlace</strong> app</li>
            <li>Click <strong>"Generate Access Token"</strong></li>
            <li>Choose <strong>"Get Page Access Token"</strong></li>
            <li>Select your business page</li>
            <li>Grant permissions: <code>pages_manage_posts</code>, <code>pages_show_list</code>, <code>business_management</code></li>
            <li>Copy the token and paste it below</li>
          </ol>
        </div>

        <div className={styles.step}>
          <h3>🔄 Step 2: Exchange for Long-Lived Token</h3>
          
          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Short-Lived Token from Graph API Explorer:</label>
              <textarea
                value={shortToken}
                onChange={(e) => setShortToken(e.target.value)}
                placeholder="Paste your short-lived token here..."
                rows={3}
                className={styles.tokenInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Page ID (optional - will auto-detect):</label>
              <input
                type="text"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                placeholder="61577486330108"
                className={styles.pageIdInput}
              />
              <button 
                onClick={handleGetPages} 
                disabled={loading}
                className={styles.secondaryBtn}
              >
                {loading ? 'Loading...' : 'Get My Pages'}
              </button>
            </div>

            {pages.length > 0 && (
              <div className={styles.pagesSection}>
                <h4>Your Pages:</h4>
                {pages.map(page => (
                  <div key={page.id} className={styles.pageItem}>
                    <span>{page.name}</span>
                    <code>{page.id}</code>
                    <button 
                      onClick={() => setPageId(page.id)}
                      className={styles.selectBtn}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={handleExchangeToken} 
              disabled={loading || !shortToken.trim()}
              className={styles.primaryBtn}
            >
              {loading ? 'Exchanging...' : 'Exchange for Long-Lived Token'}
            </button>
          </div>
        </div>

        {result && (
          <div className={styles.step}>
            <h3>📝 Step 3: Save Your Tokens</h3>
            
            {result.success ? (
              <div className={styles.success}>
                <p>✅ {result.message}</p>
                
                <div className={styles.tokenResult}>
                  <h4>Add these to your <code>.env.local</code> file:</h4>
                  
                  <div className={styles.envVar}>
                    <code>FACEBOOK_USER_TOKEN={result.userToken}</code>
                    <button onClick={() => copyToClipboard(result.userToken)}>Copy</button>
                  </div>
                  
                  {result.pageToken && (
                    <div className={styles.envVar}>
                      <code>FACEBOOK_PAGE_TOKEN={result.pageToken}</code>
                      <button onClick={() => copyToClipboard(result.pageToken)}>Copy</button>
                    </div>
                  )}
                  
                  {result.pageInfo && (
                    <div className={styles.pageInfo}>
                      <p><strong>Page:</strong> {result.pageInfo.name} (ID: {result.pageInfo.id})</p>
                    </div>
                  )}
                  
                  <div className={styles.tokenInfo}>
                    <p><strong>User Token Expires:</strong> {Math.floor(result.userTokenExpires / 86400)} days</p>
                    <p><strong>Page Token:</strong> Never expires (as long as user token is valid)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.error}>
                <p>❌ {result.error}</p>
                {result.details && (
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                )}
              </div>
            )}
          </div>
        )}

        <div className={styles.step}>
          <h3>⚙️ Step 4: Environment Variables</h3>
          <p>Make sure your <code>.env.local</code> file contains:</p>
          <div className={styles.envExample}>
            <code>
              FACEBOOK_APP_ID=your_app_id<br/>
              FACEBOOK_APP_SECRET=your_app_secret<br/>
              FACEBOOK_USER_TOKEN=your_long_lived_user_token<br/>
              FACEBOOK_PAGE_TOKEN=your_page_access_token<br/>
              FACEBOOK_PAGE_ID=61577486330108
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

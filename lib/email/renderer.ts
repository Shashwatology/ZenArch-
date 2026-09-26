// Basic templating function ensuring ZEN ARCH branding
export function renderEmailTemplate(title: string, bodyContent: string, cta?: { text: string, url: string }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #0A0A0A;
      color: #FFFFFF;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121212;
      border: 1px solid #333333;
    }
    .header {
      padding: 40px 40px 20px;
      text-align: center;
      border-bottom: 1px solid #333333;
    }
    .header h1 {
      margin: 0;
      font-weight: 300;
      letter-spacing: 0.1em;
      color: #C8A97E;
      font-size: 24px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px;
      font-size: 15px;
      line-height: 1.6;
      color: #DDDDDD;
    }
    .content p {
      margin: 0 0 20px;
    }
    .cta {
      text-align: center;
      margin: 40px 0;
    }
    .cta a {
      display: inline-block;
      background-color: #C8A97E;
      color: #000000;
      text-decoration: none;
      padding: 14px 32px;
      font-weight: 500;
      letter-spacing: 0.05em;
      border-radius: 4px;
    }
    .footer {
      padding: 30px 40px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #333333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>ZEN ARCH</h1>
    </div>
    <div class="content">
      ${bodyContent}
      
      ${cta ? `
      <div class="cta">
        <a href="${cta.url}">${cta.text}</a>
      </div>
      ` : ''}
      
      <p style="margin-top: 40px; color: #888; font-size: 13px;">
        Best regards,<br>
        The ZEN ARCH Team
      </p>
    </div>
    <div class="footer">
      ZENARCH INTERIOR SOLUTION<br>
      Mumbai, Saki Naka<br>
      <a href="mailto:zenarchsolution@gmail.com" style="color: #666;">zenarchsolution@gmail.com</a>
    </div>
  </div>
</body>
</html>
  `
}

import { Router } from 'express';

const router = Router();

router.get('/privacy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Privacy Policy - Shop Vibe</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #333; }
        .container { max-width: 800px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, use our services, or communicate with us.</p>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>
        
        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.</p>
        
        <h2>Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us.</p>
      </div>
    </body>
    </html>
  `);
});

router.get('/terms', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Terms of Service - Shop Vibe</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #333; }
        .container { max-width: 800px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Terms of Service</h1>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>Use License</h2>
        <p>Permission is granted to temporarily use this service for personal, non-commercial transitory viewing only.</p>
        
        <h2>Disclaimer</h2>
        <p>The materials on this service are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
        
        <h2>Limitations</h2>
        <p>In no event shall our company or its suppliers be liable for any damages arising out of the use or inability to use this service.</p>
        
        <h2>Contact Us</h2>
        <p>If you have questions about these Terms of Service, please contact us.</p>
      </div>
    </body>
    </html>
  `);
});

export default router;

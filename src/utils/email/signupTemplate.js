export const signupTemplate = (activationLink) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Your Account</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
            }
            .header h1 {
                color: #333;
            }
            .content {
                text-align: center;
                margin: 20px 0;
            }
            .content p {
                font-size: 16px;
                color: #555;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 20px;
                color: #ffffff;
                background-color: #007BFF;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Activate Your Account</h1>
            </div>
            <div class="content">
                <p>Thank you for signing up for <strong>[Your Website/Platform Name]</strong>.</p>
                <p>You're just one step away from accessing your account. Click the button below to activate your account:</p>
                <a href="${activationLink}" class="button">Activate My Account</a>
                <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                <p>${activationLink}</p>
            </div>
            <div class="footer">
                <p>If you didn't create an account, you can safely ignore this email.</p>
                <p>© [Your Website/Platform Name], All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

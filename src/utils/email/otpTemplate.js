export const otpTemplate = (code, name, appName = "sarahah app") => {
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
            .otp-code {
                display: inline-block;
                width: 100%;
                background-color: #3a55ea;
                color: #fff;
                text-align: center;
                padding: 10px;
                border-radius: 5px;
                font-size: 20px;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                margin: 20px auto;
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
                <h2>Hello ${name},</h2>
                <p>Thank you for signing up for <strong>${appName}</strong>.</p>
                <h2 class="otp-code">${code}</h2>
            </div>
            <div class="footer">
                <p>If you did not sign up for this account, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

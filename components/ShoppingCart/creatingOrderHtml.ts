export const creatingOrderHtml = `
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Please wait, we are creating your order...</title>
        <style>
            body {
                height: 100vh;
                width: 100vw;
                font-family: poppins, sans-serif;
            }
            #logo-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                flex-direction: column;
            }
            #logo {
                display: flex;
                flex-direction: column;
            }
            #logo-top {
                rotate: -10deg;
                animation: logo-top 1.4s infinite;
            }
            #logo-bottom {
                rotate: -10deg;
                margin-top: 10px;
                animation: logo-bottom 1.4s infinite;
            }
            #text-loading {
                text-align: center;
                margin-top: 40px;
            }
            @keyframes logo-top {
                0% {
                    transform: translateX(0);
                }
                50% {
                    transform: translateX(20px);
                }
                100% {
                    transform: translateX(0);
                }
            }
            @keyframes logo-bottom {
                0% {
                    transform: translateX(0);
                }
                50% {
                    transform: translateX(-20px);
                }
                100% {
                    transform: translateX(0);
                }
            }
        </style>
    </head>
    <body>
        <div id="logo-container">
            <div id="logo">
                <img
                    src="/images/logo_top_frame.svg"
                    alt="logo"
                    width="100px"
                    height="50px"
                    id="logo-top"
                />
                <img
                    src="/images/logo_bottom_frame.svg"
                    alt="logo"
                    width="100px"
                    height="50px"
                    id="logo-bottom"
                />
            </div>
            <h4 id="text-loading">Please wait, your order is being processed...</h4>
        </div>
    </body>
</html>
`;
